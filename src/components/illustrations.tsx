"use client";

// 手绘风格植物插画 SVG 组件

export function EmptyPlantIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 花盆 */}
      <path d="M70 140 L80 180 L120 180 L130 140 Z" fill="#E8D5B7" stroke="#C4A882" strokeWidth="1.5" />
      <path d="M65 135 L135 135 L132 142 L68 142 Z" fill="#D4C4A8" stroke="#C4A882" strokeWidth="1.5" />
      {/* 土壤 */}
      <ellipse cx="100" cy="140" rx="30" ry="5" fill="#8B6914" opacity="0.3" />
      {/* 茎 */}
      <path d="M100 140 C100 120 95 110 100 90" stroke="#2D7D46" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M100 120 C100 115 110 105 115 95" stroke="#2D7D46" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 叶子 */}
      <path d="M100 90 C85 75 75 80 80 65 C85 50 100 55 100 70 C100 55 115 50 120 65 C125 80 115 75 100 90 Z" fill="#8BC34A" opacity="0.8" />
      <path d="M115 95 C125 80 135 82 130 70 C125 60 115 65 115 75" fill="#2D7D46" opacity="0.6" />
      <path d="M85 105 C70 95 60 100 65 85 C70 72 82 78 82 88" fill="#8BC34A" opacity="0.7" />
      {/* 小星星装饰 */}
      <circle cx="60" cy="60" r="2" fill="#F5A623" opacity="0.6" />
      <circle cx="145" cy="75" r="1.5" fill="#F5A623" opacity="0.5" />
      <circle cx="50" cy="100" r="1.5" fill="#8BC34A" opacity="0.4" />
      <circle cx="150" cy="110" r="2" fill="#4FC3F7" opacity="0.4" />
    </svg>
  );
}

export function EmptyWateringIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 浇水壶 */}
      <path d="M70 100 L70 140 C70 150 80 155 100 155 C120 155 130 150 130 140 L130 100 Z" fill="#4FC3F7" opacity="0.2" stroke="#4FC3F7" strokeWidth="1.5" />
      <path d="M130 110 L150 90 L155 93 L135 113" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" />
      {/* 水滴 */}
      <path d="M152 98 C152 95 155 90 155 90 C155 90 158 95 158 98 C158 101 155 103 155 103 C155 103 152 101 152 98 Z" fill="#4FC3F7" opacity="0.6" />
      <path d="M145 108 C145 106 147 103 147 103 C147 103 149 106 149 108 C149 110 147 111 147 111 C147 111 145 110 145 108 Z" fill="#4FC3F7" opacity="0.4" />
      <path d="M155 112 C155 110 157 107 157 107 C157 107 159 110 159 112 C159 114 157 115 157 115 C157 115 155 114 155 112 Z" fill="#4FC3F7" opacity="0.5" />
      {/* 笑脸 */}
      <circle cx="90" cy="125" r="3" fill="#1A2E1A" opacity="0.5" />
      <circle cx="110" cy="125" r="3" fill="#1A2E1A" opacity="0.5" />
      <path d="M88 135 C93 140 107 140 112 135" stroke="#1A2E1A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* 植物 */}
      <path d="M55 160 C55 145 60 140 65 130" stroke="#2D7D46" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 130 C55 120 50 125 55 115 C60 108 68 112 65 120" fill="#8BC34A" opacity="0.7" />
    </svg>
  );
}

export function EmptyCommunityIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 对话气泡 */}
      <rect x="40" y="50" width="80" height="50" rx="12" fill="#2D7D46" fillOpacity="0.1" stroke="#2D7D46" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M60 100 L55 112 L70 100" fill="#2D7D46" fillOpacity="0.1" stroke="#2D7D46" strokeWidth="1.5" strokeOpacity="0.3" />
      <rect x="80" y="90" width="80" height="50" rx="12" fill="#8BC34A" fillOpacity="0.1" stroke="#8BC34A" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M140 140 L145 152 L130 140" fill="#8BC34A" fillOpacity="0.1" stroke="#8BC34A" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* 植物图标 */}
      <circle cx="65" cy="70" r="4" fill="#2D7D46" opacity="0.4" />
      <circle cx="75" cy="70" r="4" fill="#8BC34A" opacity="0.4" />
      <circle cx="85" cy="70" r="4" fill="#4FC3F7" opacity="0.4" />
      {/* 心形 */}
      <path d="M115 105 C115 102 118 100 120 100 C122 100 125 102 125 105 C125 110 120 113 120 113 C120 113 115 110 115 105 Z" fill="#F5A623" opacity="0.5" />
      {/* 人物 */}
      <circle cx="55" cy="160" r="10" fill="#2D7D46" opacity="0.15" />
      <circle cx="100" cy="165" r="10" fill="#8BC34A" opacity="0.15" />
      <circle cx="145" cy="160" r="10" fill="#4FC3F7" opacity="0.15" />
    </svg>
  );
}

export function EmptySearchIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 放大镜 */}
      <circle cx="90" cy="90" r="35" stroke="#2D7D46" strokeWidth="3" opacity="0.3" />
      <line x1="115" y1="115" x2="145" y2="145" stroke="#2D7D46" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
      {/* 放大镜里的植物 */}
      <path d="M90 100 C90 90 85 85 90 75" stroke="#8BC34A" strokeWidth="2" strokeLinecap="round" />
      <path d="M90 75 C82 68 78 72 82 65 C86 58 92 62 90 68" fill="#8BC34A" opacity="0.6" />
      <path d="M90 82 C96 76 100 78 97 72" stroke="#2D7D46" strokeWidth="1.5" strokeLinecap="round" />
      {/* 问号 */}
      <text x="140" y="80" fontSize="24" fill="#F5A623" opacity="0.4">?</text>
    </svg>
  );
}
