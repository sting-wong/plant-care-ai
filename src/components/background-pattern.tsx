"use client";

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="plant-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 15 C35 8 28 12 32 5 C36 -2 42 4 40 10" fill="#2D7D46" />
            <path d="M15 55 C12 48 8 50 11 44 C14 38 18 42 16 48" fill="#2D7D46" />
            <path d="M65 60 C62 54 58 56 60 50 C62 44 67 48 65 54" fill="#2D7D46" />
            <circle cx="70" cy="20" r="1.5" fill="#2D7D46" />
            <circle cx="10" cy="30" r="1" fill="#2D7D46" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#plant-pattern)" />
      </svg>
    </div>
  );
}
