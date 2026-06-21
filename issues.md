# 植物管家 — 问题诊断与修改文档

> 审查对象：http://8.130.151.197:3001/
> 审查日期：2026-06-16
> 技术栈：Next.js (App Router) + zustand + PWA
> 核心流程：拍照 → 压缩成 base64 → 存入客户端 store → 跳转 `/diagnosis/<id>` → server action 调用 AI 诊断

---

## 问题总览

| 编号 | 严重程度 | 问题 | 影响 |
|------|----------|------|------|
| 1 | 🔴 严重 | HTTP 裸 IP 部署，无 HTTPS | 拍照功能在远程基本失效 |
| 2 | 🔴 严重 | 号称 PWA 但无 Service Worker | 无法离线、无法真正安装 |
| 3 | 🟡 中等 | 首页日期/问候被静态预渲染「烤死」 | 显示昨天日期，时段错误 |
| 4 | 🟡 中等 | 数据全存 localStorage，图片同库 | 易写爆、换设备丢失、无同步 |
| 5 | 🟢 工程卫生 | 缺基本安全响应头 | 暴露框架、缺防护 |
| 6 | 🟢 架构 | 纯客户端会话，无法分享诊断 | 分享链接对方打不开 |

---

## 🔴 1. HTTP 裸 IP 部署，摄像头基本废了

**现状**：站点跑在 `http://8.130.151.197:3001`，无 HTTPS。

**问题**：app 核心是「拍照问诊」，浏览器的 `getUserMedia` / `capture="environment"` 属于 secure context，只在 `https://` 或 `localhost` 下可用。远程用户用 HTTP 打开，点「拍照」要么无声失败，要么只能退化成「从相册选文件」。对一个主打拍照诊断的产品是致命的。

**修改方案**：
- 配置域名 + TLS 证书（Let's Encrypt 免费），或在前面套一层 Nginx / Caddy 做 HTTPS 反代。
- Caddy 示例（自动签发证书）：
  ```
  your-domain.com {
      reverse_proxy localhost:3001
  }
  ```
- 上线后把所有 HTTP 访问 301 重定向到 HTTPS。

---

## 🔴 2. 号称 PWA，却装不了也不能离线

**现状**：`manifest.json` 存在，`display: standalone`，但 `/sw.js`、`/service-worker.js` 均为 404 —— 没有 Service Worker。manifest 本身也不达标：只有一张 `icon-192.svg`（`sizes:"any"`），缺标准尺寸 PNG，缺 `maskable` 图标。

**影响**：不能离线、不能真正「添加到主屏幕」当 app 用；iOS/部分安卓不认这个图标配置。

**修改方案**：
- 引入 Service Worker（推荐 `next-pwa` 或 `@serwist/next`）做离线缓存与安装。
- 补齐图标：
  ```json
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
  ```

---

## 🟡 3. 首页日期/问候是「烤死」的，显示昨天

**现状**：首页是静态预渲染（响应头 `x-nextjs-prerender: 1`，`Cache-Control: s-maxage=31536000`）。`Good evening · 6月15日` 这串文字是构建时写进 HTML 的。今天是 6/16，仍显示 6/15；且无论几点都显示 "Good evening"。

**影响**：「今日任务」面板显示错误日期，很伤用户信任。

**修改方案**：
- 把日期/问候这段逻辑拆到客户端组件（`"use client"`）里用 `new Date()` 实时渲染。
- 或将首页标记为动态渲染：
  ```ts
  export const dynamic = 'force-dynamic';
  ```
- 注意：仅日期这种小动态内容，优先用客户端组件，避免整页放弃静态优化。

---

## 🟡 4. 所有数据只存 localStorage，且 base64 图片同库

**现状**：植物、诊断会话、聊天记录全在一个 localStorage key `plant-care-storage` 里。诊断会话连 `imageBase64` 原图（压到 800px / JPEG 0.8）也一起 persist 进去。

**问题**：
- localStorage 通常上限 ~5MB，几张诊断图就可能写爆，之后静默报错、数据丢失。
- 换设备 / 清缓存 / 换浏览器 = 数据全没；无账号、无同步、无后端持久化。

**修改方案**：
- 图片改存 IndexedDB（容量大、二进制友好），zustand persist 可换 `idb-keyval` 作为 storage。
- 或将图片上传到对象存储（OSS / S3），本地只存 URL。
- 结构化数据（植物列表、提醒）若要跨设备，需加轻量后端做同步。
- 短期止血：persist 时用 `partialize` 排除 `imageBase64`，避免原图占满本地存储。

---

## 🟢 5. 缺基本安全响应头

**现状**：无 `Content-Security-Policy`、`Strict-Transport-Security`、`X-Frame-Options` / `frame-ancestors`、`X-Content-Type-Options`；且 `X-Powered-By: Next.js` 暴露了框架。

**修改方案**（`next.config.js`）：
```js
module.exports = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: blob:; ..." },
      ],
    }];
  },
};
```
> CSP 需结合实际外部资源（AI 接口域名等）调整，先用 report-only 模式验证再强制。

---

## 🟢 6. 纯客户端会话，无法分享诊断结果

**现状**：诊断 session 只存在本地内存 + localStorage。直接访问 `/diagnosis/test` 这类不存在的 id 会显示「找不到这次诊断记录」——兜底逻辑是有的，这点 OK。

**问题**：刷新后靠 localStorage 还原；把诊断链接分享给别人，对方没有那条本地数据，必然打不开。

**修改方案**：
- 若产品要支持「分享诊断结果」，需把诊断记录存到后端，分享页按 id 从服务端读取。
- 当前纯客户端架构做不到分享，需要架构调整。

---

## 优先级建议

按投入产出排序，建议依次处理：

1. **上 HTTPS** — 否则核心拍照功能无法用（最高优先级）
2. **修首页日期** — 改动小、体验提升明显
3. **图片改存 IndexedDB** — 防数据丢失
4. **补 Service Worker + 安全响应头** — 完善 PWA 与工程卫生
5. **诊断结果后端化**（可选）— 取决于是否要做分享/多端同步

---

## 总体评价

功能流程设计完整（拍照 → 压缩 → 诊断 → 养护提醒，zustand 持久化用得也规范），主要短板在**部署层与数据持久化**：HTTP 让拍照失效、PWA 名不副实、首页日期是死的、数据全压在 localStorage 上有丢失风险。把上面前四项处理掉，可用性和专业度会有明显提升。
