#!/usr/bin/env node
/**
 * patches/patch-zustand.js
 *
 * Why this exists
 * ---------------
 * Zustand 5.0.14 ships with a useStore implementation that wraps
 * getServerSnapshot in useCallback([api, selector]). When a component
 * passes an inline arrow selector (new reference each render), useCallback
 * produces a new getServerSnapshot function each render. React's
 * useSyncExternalStore hydration check calls getServerSnapshot() twice and
 * expects referential identity; the mismatch triggers:
 *   "getServerSnapshot should be cached to avoid an infinite loop"
 * which cascades into "Maximum update depth exceeded" and unmounts the tree.
 *
 * Fix: replace the useCallback-based getServerSnapshot with a useRef-based
 * stable function (created once per component instance) that always
 * delegates to the latest selector via a selectorRef. getSnapshot (client
 * side) is unchanged — it still uses useCallback so Zustand's subscription
 * batching works correctly.
 *
 * Validated against: zustand 5.0.14 + Next.js 15.5.x + React 19.
 *
 * Why not patch-package
 * ---------------------
 * patch-package is not available in this project's registry environment
 * (npm install returns 403). This script is the equivalent: it writes the
 * same diff, is committed to the repo under patches/, and is re-applied
 * automatically via the postinstall hook after every npm install.
 *
 * Version safety
 * --------------
 * The script reads node_modules/zustand/package.json and hard-errors if
 * the installed version is not exactly 5.0.14. This prevents silent
 * corruption if the lockfile is changed or zustand is upgraded without
 * reviewing this patch first.
 *
 * Verifying the patch after a clean install
 * ------------------------------------------
 *   npm ci               # or npm install
 *   # postinstall runs automatically and prints:
 *   #   patched node_modules/zustand/react.js
 *   #   patched node_modules/zustand/esm/react.mjs
 *   #   zustand patch applied (2 files)
 *   grep -c "selectorRef" node_modules/zustand/react.js   # should print 1
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const VALIDATED_VERSION = '5.0.14';

// ── 1. Version guard ────────────────────────────────────────────────────────

const pkgPath = path.join(__dirname, '../node_modules/zustand/package.json');

if (!fs.existsSync(pkgPath)) {
  console.warn('patches/patch-zustand.js: zustand not found in node_modules, skipping.');
  process.exit(0);
}

const installedVersion = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;

if (installedVersion !== VALIDATED_VERSION) {
  console.error(
    `patches/patch-zustand.js: version mismatch.\n` +
    `  Expected : ${VALIDATED_VERSION}\n` +
    `  Installed: ${installedVersion}\n` +
    `\n` +
    `  This patch has only been validated against zustand ${VALIDATED_VERSION}.\n` +
    `  Before upgrading, verify the fix is still needed and update VALIDATED_VERSION\n` +
    `  in patches/patch-zustand.js, then re-lock package.json.\n`
  );
  process.exit(1);
}

// ── 2. Patched file content ──────────────────────────────────────────────────

const CJS_PATCHED = `'use strict';

var React = require('react');
var vanilla = require('zustand/vanilla');

const identity = (arg) => arg;
function useStore(api, selector = identity) {
  var selectorRef = React.useRef(selector);
  selectorRef.current = selector;
  var getServerSnapshot = React.useRef(
    function() { return selectorRef.current(api.getInitialState()); }
  ).current;
  var slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(function() { return selector(api.getState()); }, [api, selector]),
    getServerSnapshot
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = vanilla.createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);

exports.create = create;
exports.useStore = useStore;
`;

const ESM_PATCHED = `import React from 'react';
import { createStore } from 'zustand/vanilla';

const identity = (arg) => arg;
function useStore(api, selector = identity) {
  var selectorRef = React.useRef(selector);
  selectorRef.current = selector;
  var getServerSnapshot = React.useRef(
    function() { return selectorRef.current(api.getInitialState()); }
  ).current;
  var slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(function() { return selector(api.getState()); }, [api, selector]),
    getServerSnapshot
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);

export { create, useStore };
`;

// ── 3. Write patches ─────────────────────────────────────────────────────────

const cjsPath = path.join(__dirname, '../node_modules/zustand/react.js');
const esmPath = path.join(__dirname, '../node_modules/zustand/esm/react.mjs');
let applied = 0;

try {
  fs.writeFileSync(cjsPath, CJS_PATCHED, 'utf8');
  console.log('  patched node_modules/zustand/react.js');
  applied++;
} catch (e) {
  console.error(`  error patching zustand/react.js: ${e.message}`);
  process.exit(1);
}

try {
  fs.writeFileSync(esmPath, ESM_PATCHED, 'utf8');
  console.log('  patched node_modules/zustand/esm/react.mjs');
  applied++;
} catch (e) {
  console.error(`  error patching zustand/esm/react.mjs: ${e.message}`);
  process.exit(1);
}

console.log(`  zustand ${installedVersion} patch applied (${applied} files)`);
