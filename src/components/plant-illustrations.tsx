"use client";

// 每种植物的精致 SVG 插画，扁平化 + 渐变 + 柔和风格

interface IllustrationProps {
  className?: string;
}

export function MonsteraIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="m-pot" x1="42" y1="85" x2="42" y2="105"><stop offset="0%" stopColor="#D4A574" /><stop offset="100%" stopColor="#B8845C" /></linearGradient>
        <linearGradient id="m-leaf1" x1="40" y1="50" x2="80" y2="12"><stop offset="0%" stopColor="#43A047" /><stop offset="100%" stopColor="#66BB6A" /></linearGradient>
        <linearGradient id="m-leaf2" x1="72" y1="45" x2="85" y2="20"><stop offset="0%" stopColor="#2E7D32" /><stop offset="100%" stopColor="#43A047" /></linearGradient>
      </defs>
      <path d="M42 85 L48 105 L72 105 L78 85 Z" fill="url(#m-pot)" />
      <rect x="38" y="82" width="44" height="5" rx="2" fill="#E8C9A0" />
      <path d="M60 82 C60 70 58 60 60 50" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 65 C60 60 68 52 72 45" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 72 C60 68 52 62 48 56" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 50 C45 35 35 40 40 25 C45 12 60 18 60 30 C60 18 75 12 80 25 C85 40 75 35 60 50 Z" fill="url(#m-leaf1)" />
      <ellipse cx="50" cy="32" rx="3" ry="5" fill="#FAFDF7" opacity="0.5" />
      <ellipse cx="70" cy="32" rx="3" ry="5" fill="#FAFDF7" opacity="0.5" />
      <path d="M72 45 C82 35 88 38 85 28 C82 20 74 24 72 32" fill="url(#m-leaf2)" />
      <path d="M48 56 C38 48 32 52 35 42 C38 34 46 38 48 46" fill="#66BB6A" opacity="0.8" />
      <circle cx="55" cy="28" r="8" fill="white" opacity="0.08" />
    </svg>
  );
}

export function PothosIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="p-pot" x1="45" y1="60" x2="45" y2="80"><stop offset="0%" stopColor="#8D6E63" /><stop offset="100%" stopColor="#6D4C41" /></linearGradient>
      </defs>
      <rect x="42" y="58" width="36" height="24" rx="4" fill="url(#p-pot)" />
      <rect x="39" y="55" width="42" height="5" rx="2" fill="#A1887F" />
      {/* 藤蔓 */}
      <path d="M55 55 C50 45 45 48 42 40 C39 32 35 35 30 28" stroke="#43A047" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 55 C70 42 75 45 80 35 C85 25 88 30 92 22" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 55 C58 40 55 35 50 25" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
      {/* 心形叶子 */}
      <path d="M30 28 C26 24 22 26 24 22 C26 18 30 20 30 24 C30 20 34 18 36 22 C38 26 34 24 30 28 Z" fill="#66BB6A" />
      <path d="M92 22 C88 18 84 20 86 16 C88 12 92 14 92 18 C92 14 96 12 98 16 C100 20 96 18 92 22 Z" fill="#81C784" />
      <path d="M50 25 C47 21 44 23 45 19 C46 15 50 17 50 21 C50 17 54 15 55 19 C56 23 53 21 50 25 Z" fill="#4CAF50" />
      <path d="M42 40 C39 37 36 38 37 35 C38 32 41 33 41 36 C41 33 44 32 45 35 C46 38 43 37 42 40 Z" fill="#A5D6A7" />
      <path d="M80 35 C77 32 74 33 75 30 C76 27 79 28 79 31 C79 28 82 27 83 30 C84 33 81 32 80 35 Z" fill="#66BB6A" />
    </svg>
  );
}

export function SucculentIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="s-pot" x1="40" y1="75" x2="40" y2="100"><stop offset="0%" stopColor="#FFCCBC" /><stop offset="100%" stopColor="#FF8A65" /></linearGradient>
        <linearGradient id="s-leaf" x1="60" y1="75" x2="60" y2="35"><stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#AED581" /></linearGradient>
      </defs>
      <path d="M40 75 L45 100 L75 100 L80 75 Z" fill="url(#s-pot)" />
      <rect x="37" y="72" width="46" height="5" rx="2" fill="#FFAB91" />
      {/* 莲座状叶片 */}
      <ellipse cx="60" cy="62" rx="18" ry="10" fill="url(#s-leaf)" />
      <ellipse cx="60" cy="55" rx="14" ry="8" fill="#A5D6A7" />
      <ellipse cx="60" cy="49" rx="10" ry="6" fill="#C5E1A5" />
      <ellipse cx="60" cy="44" rx="6" ry="4" fill="#DCEDC8" />
      {/* 侧面叶片 */}
      <ellipse cx="42" cy="65" rx="8" ry="5" fill="#81C784" transform="rotate(-20 42 65)" />
      <ellipse cx="78" cy="65" rx="8" ry="5" fill="#81C784" transform="rotate(20 78 65)" />
      {/* 粉色边缘 */}
      <path d="M48 68 C52 72 68 72 72 68" stroke="#F48FB1" strokeWidth="1" opacity="0.5" fill="none" />
    </svg>
  );
}

export function FiddleLeafIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="fl-pot" x1="45" y1="88" x2="45" y2="108"><stop offset="0%" stopColor="#D4A574" /><stop offset="100%" stopColor="#B8845C" /></linearGradient>
      </defs>
      <path d="M45 88 L50 108 L70 108 L75 88 Z" fill="url(#fl-pot)" />
      <rect x="42" y="85" width="36" height="5" rx="2" fill="#E8C9A0" />
      {/* 高挑树干 */}
      <path d="M60 85 C60 70 59 55 60 40" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
      {/* 大提琴形叶片 */}
      <path d="M60 40 C50 30 45 32 47 22 C49 12 58 16 60 24 C62 16 71 12 73 22 C75 32 70 30 60 40 Z" fill="#2E7D32" />
      <path d="M55 55 C45 48 40 50 43 42 C46 34 54 38 55 45" fill="#388E3C" />
      <path d="M65 50 C75 43 80 45 77 37 C74 29 66 33 65 40" fill="#43A047" />
      {/* 叶脉 */}
      <line x1="60" y1="40" x2="60" y2="22" stroke="#1B5E20" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

export function SnakePlantIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="sp-pot" x1="40" y1="80" x2="40" y2="105"><stop offset="0%" stopColor="#78909C" /><stop offset="100%" stopColor="#546E7A" /></linearGradient>
      </defs>
      <path d="M40 80 L45 105 L75 105 L80 80 Z" fill="url(#sp-pot)" />
      <rect x="37" y="77" width="46" height="5" rx="2" fill="#90A4AE" />
      {/* 剑形叶片 */}
      <path d="M52 77 C51 55 50 35 52 18" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 77 C60 50 59 30 60 12" stroke="#388E3C" strokeWidth="5" strokeLinecap="round" />
      <path d="M68 77 C69 55 70 35 68 20" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
      {/* 黄色边缘 */}
      <path d="M49 77 C48 55 47 35 49 18" stroke="#FDD835" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M71 77 C72 55 73 35 71 20" stroke="#FDD835" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SpiderPlantIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M45 65 L50 85 L70 85 L75 65 Z" fill="#8D6E63" />
      <rect x="42" y="62" width="36" height="4" rx="2" fill="#A1887F" />
      {/* 细长叶片向外弯曲 */}
      <path d="M60 62 C55 45 40 40 30 45" stroke="#66BB6A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M60 62 C65 45 80 40 90 45" stroke="#66BB6A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M60 62 C58 42 48 35 38 32" stroke="#81C784" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 62 C62 42 72 35 82 32" stroke="#81C784" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 62 C60 48 55 38 50 28" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 62 C60 48 65 38 70 28" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 小吊兰宝宝 */}
      <circle cx="30" cy="48" r="4" fill="#A5D6A7" />
      <circle cx="90" cy="48" r="4" fill="#A5D6A7" />
      <path d="M30 52 L30 58" stroke="#66BB6A" strokeWidth="1" />
      <path d="M90 52 L90 58" stroke="#66BB6A" strokeWidth="1" />
    </svg>
  );
}

export function MoneyTreeIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M45 85 L50 108 L70 108 L75 85 Z" fill="#D4A574" />
      <rect x="42" y="82" width="36" height="5" rx="2" fill="#E8C9A0" />
      {/* 编织树干 */}
      <path d="M55 82 C55 70 58 65 55 55 C52 45 58 40 55 30" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M65 82 C65 70 62 65 65 55 C68 45 62 40 65 30" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 掌状叶 */}
      <circle cx="60" cy="22" r="15" fill="#43A047" opacity="0.8" />
      <circle cx="48" cy="28" r="10" fill="#66BB6A" opacity="0.7" />
      <circle cx="72" cy="28" r="10" fill="#66BB6A" opacity="0.7" />
      <circle cx="60" cy="15" r="8" fill="#81C784" opacity="0.6" />
    </svg>
  );
}

export function CactusIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="cac-body" x1="60" y1="30" x2="60" y2="85"><stop offset="0%" stopColor="#66BB6A" /><stop offset="100%" stopColor="#2E7D32" /></linearGradient>
      </defs>
      <path d="M45 88 L48 105 L72 105 L75 88 Z" fill="#FFCCBC" />
      <rect x="42" y="85" width="36" height="5" rx="2" fill="#FFAB91" />
      {/* 仙人掌主体 */}
      <rect x="50" y="35" width="20" height="50" rx="10" fill="url(#cac-body)" />
      {/* 侧臂 */}
      <path d="M50 55 C40 55 38 45 38 40 C38 35 42 33 42 40 C42 47 45 50 50 50" fill="#4CAF50" />
      <path d="M70 50 C80 50 82 40 82 35 C82 30 78 28 78 35 C78 42 75 45 70 45" fill="#4CAF50" />
      {/* 刺 */}
      <line x1="55" y1="40" x2="52" y2="37" stroke="#FDD835" strokeWidth="1" />
      <line x1="65" y1="45" x2="68" y2="42" stroke="#FDD835" strokeWidth="1" />
      <line x1="55" y1="55" x2="52" y2="53" stroke="#FDD835" strokeWidth="1" />
      <line x1="65" y1="60" x2="68" y2="58" stroke="#FDD835" strokeWidth="1" />
      {/* 小花 */}
      <circle cx="60" cy="32" r="4" fill="#FF7043" />
      <circle cx="60" cy="32" r="2" fill="#FFAB91" />
    </svg>
  );
}

export function RubberPlantIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M45 88 L50 108 L70 108 L75 88 Z" fill="#D4A574" />
      <rect x="42" y="85" width="36" height="5" rx="2" fill="#E8C9A0" />
      <path d="M60 85 C60 70 60 55 60 40" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" />
      {/* 厚实椭圆叶 */}
      <ellipse cx="48" cy="35" rx="12" ry="8" fill="#1B5E20" transform="rotate(-15 48 35)" />
      <ellipse cx="72" cy="42" rx="12" ry="8" fill="#2E7D32" transform="rotate(15 72 42)" />
      <ellipse cx="50" cy="55" rx="11" ry="7" fill="#1B5E20" transform="rotate(-10 50 55)" />
      <ellipse cx="70" cy="62" rx="11" ry="7" fill="#2E7D32" transform="rotate(10 70 62)" />
      <ellipse cx="55" cy="25" rx="10" ry="7" fill="#388E3C" transform="rotate(-5 55 25)" />
      {/* 叶片光泽 */}
      <ellipse cx="50" cy="33" rx="4" ry="2" fill="white" opacity="0.15" transform="rotate(-15 50 33)" />
    </svg>
  );
}

export function ArecaPalmIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M48 90 L52 108 L68 108 L72 90 Z" fill="#8D6E63" />
      <rect x="45" y="87" width="30" height="5" rx="2" fill="#A1887F" />
      {/* 棕榈茎 */}
      <path d="M60 87 C60 75 60 65 60 55" stroke="#A5D6A7" strokeWidth="3" strokeLinecap="round" />
      {/* 羽状叶片 */}
      <path d="M60 55 C50 40 35 35 25 38" stroke="#43A047" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 55 C70 40 85 35 95 38" stroke="#43A047" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 55 C52 38 40 28 30 25" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 55 C68 38 80 28 90 25" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 55 C55 35 48 22 42 15" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M60 55 C65 35 72 22 78 15" stroke="#81C784" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* 小叶片 */}
      <path d="M35 35 L30 32 M35 35 L32 38" stroke="#66BB6A" strokeWidth="1" />
      <path d="M85 35 L90 32 M85 35 L88 38" stroke="#66BB6A" strokeWidth="1" />
    </svg>
  );
}

export function PeaceLilyIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M45 80 L50 100 L70 100 L75 80 Z" fill="#D4A574" />
      <rect x="42" y="77" width="36" height="4" rx="2" fill="#E8C9A0" />
      <path d="M60 77 C60 65 58 55 60 45" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M55 77 C53 65 48 55 45 48" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 77 C67 65 72 55 75 48" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
      {/* 白色佛焰苞 */}
      <path d="M60 45 C55 35 50 30 55 22 C60 14 65 20 60 30 C65 20 70 14 75 22 C80 30 65 35 60 45 Z" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
      <path d="M60 42 C60 35 60 28 60 22" stroke="#FDD835" strokeWidth="2" strokeLinecap="round" />
      {/* 绿叶 */}
      <path d="M45 48 C38 42 35 44 37 38 C39 32 44 35 45 40" fill="#43A047" />
      <path d="M75 48 C82 42 85 44 83 38 C81 32 76 35 75 40" fill="#43A047" />
    </svg>
  );
}

export function AloeIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M42 80 L47 100 L73 100 L78 80 Z" fill="#FFCCBC" />
      <rect x="39" y="77" width="42" height="4" rx="2" fill="#FFAB91" />
      {/* 肉质三角叶 */}
      <path d="M60 77 L55 35 L50 77 Z" fill="#66BB6A" />
      <path d="M60 77 L65 35 L70 77 Z" fill="#4CAF50" />
      <path d="M55 77 L42 45 L48 77 Z" fill="#81C784" />
      <path d="M65 77 L78 45 L72 77 Z" fill="#81C784" />
      <path d="M50 77 L35 55 L43 77 Z" fill="#A5D6A7" />
      <path d="M70 77 L85 55 L77 77 Z" fill="#A5D6A7" />
      {/* 锯齿边缘 */}
      <circle cx="53" cy="50" r="1" fill="white" opacity="0.3" />
      <circle cx="67" cy="50" r="1" fill="white" opacity="0.3" />
    </svg>
  );
}

export function AsparagusIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M48 82 L52 100 L68 100 L72 82 Z" fill="#5D4037" />
      <rect x="45" y="79" width="30" height="4" rx="2" fill="#795548" />
      {/* 纤细飘逸的云雾状 */}
      <path d="M60 79 C60 70 58 60 60 50" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 65 C55 60 48 58 42 55" stroke="#66BB6A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M60 65 C65 60 72 58 78 55" stroke="#66BB6A" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M60 55 C53 50 45 48 38 45" stroke="#81C784" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M60 55 C67 50 75 48 82 45" stroke="#81C784" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M60 50 C55 45 50 42 44 38" stroke="#A5D6A7" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M60 50 C65 45 70 42 76 38" stroke="#A5D6A7" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* 小叶点 */}
      <circle cx="42" cy="55" r="2" fill="#81C784" opacity="0.6" />
      <circle cx="78" cy="55" r="2" fill="#81C784" opacity="0.6" />
      <circle cx="38" cy="45" r="1.5" fill="#A5D6A7" opacity="0.5" />
      <circle cx="82" cy="45" r="1.5" fill="#A5D6A7" opacity="0.5" />
    </svg>
  );
}

export function PileaIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M48 80 L52 98 L68 98 L72 80 Z" fill="#8D6E63" />
      <rect x="45" y="77" width="30" height="4" rx="2" fill="#A1887F" />
      <path d="M60 77 C60 70 60 65 60 58" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
      {/* 圆形铜钱叶 */}
      <circle cx="60" cy="48" r="12" fill="#66BB6A" />
      <circle cx="48" cy="55" r="9" fill="#81C784" />
      <circle cx="72" cy="55" r="9" fill="#81C784" />
      <circle cx="52" cy="42" r="8" fill="#A5D6A7" />
      <circle cx="68" cy="42" r="8" fill="#A5D6A7" />
      {/* 叶脉 */}
      <circle cx="60" cy="48" r="12" fill="none" stroke="#43A047" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

export function PeperomiaIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M48 82 L52 98 L68 98 L72 82 Z" fill="#FFCCBC" />
      <rect x="45" y="79" width="30" height="4" rx="2" fill="#FFAB91" />
      {/* 小圆叶紧凑排列 */}
      <ellipse cx="55" cy="65" rx="8" ry="6" fill="#2E7D32" />
      <ellipse cx="68" cy="68" rx="7" ry="5" fill="#388E3C" />
      <ellipse cx="52" cy="55" rx="7" ry="5" fill="#43A047" />
      <ellipse cx="65" cy="55" rx="7" ry="5" fill="#388E3C" />
      <ellipse cx="58" cy="46" rx="6" ry="5" fill="#4CAF50" />
      <ellipse cx="62" cy="40" rx="5" ry="4" fill="#66BB6A" />
      {/* 茎 */}
      <path d="M55 72 L55 79" stroke="#388E3C" strokeWidth="1.5" />
      <path d="M65 72 L65 79" stroke="#388E3C" strokeWidth="1.5" />
    </svg>
  );
}

export function StrelitziaIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M48 90 L52 108 L68 108 L72 90 Z" fill="#D4A574" />
      <rect x="45" y="87" width="30" height="5" rx="2" fill="#E8C9A0" />
      <path d="M60 87 C60 70 58 55 60 40" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      {/* 大蕉叶 */}
      <path d="M60 40 C45 25 35 28 38 15 C41 5 58 12 60 25 C62 12 79 5 82 15 C85 28 75 25 60 40 Z" fill="#2E7D32" />
      <path d="M55 60 C42 52 35 55 38 45 C41 37 52 42 55 50" fill="#388E3C" />
      <path d="M65 55 C78 47 85 50 82 40 C79 32 68 37 65 45" fill="#388E3C" />
      {/* 鸟形花 */}
      <path d="M62 20 L72 12 L68 18 L75 15" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M62 20 L58 15" stroke="#7B1FA2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IvyIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M50 55 L53 72 L67 72 L70 55 Z" fill="#8D6E63" />
      <rect x="47" y="52" width="26" height="4" rx="2" fill="#A1887F" />
      {/* 攀爬藤蔓 */}
      <path d="M55 52 C50 40 42 35 35 30 C28 25 22 28 18 22" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M65 52 C70 40 78 35 85 30 C92 25 98 28 102 22" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M60 52 C58 38 55 28 50 18" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* 星形叶 */}
      <path d="M35 30 L32 26 L35 28 L38 25 L36 29 Z" fill="#66BB6A" transform="scale(1.5) translate(-12,-5)" />
      <path d="M85 30 L82 26 L85 28 L88 25 L86 29 Z" fill="#66BB6A" transform="scale(1.5) translate(42,-5)" />
      <circle cx="18" cy="22" r="5" fill="#81C784" />
      <circle cx="102" cy="22" r="5" fill="#81C784" />
      <circle cx="50" cy="18" r="4" fill="#66BB6A" />
    </svg>
  );
}

export function LuckyBambooIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      {/* 玻璃瓶 */}
      <path d="M42 60 L42 100 C42 105 50 108 60 108 C70 108 78 105 78 100 L78 60 Z" fill="#E3F2FD" opacity="0.5" stroke="#90CAF9" strokeWidth="1" />
      <ellipse cx="60" cy="60" rx="18" ry="4" fill="#E3F2FD" opacity="0.3" stroke="#90CAF9" strokeWidth="1" />
      {/* 水 */}
      <path d="M44 75 L44 100 C44 104 51 106 60 106 C69 106 76 104 76 100 L76 75 Z" fill="#81D4FA" opacity="0.3" />
      {/* 竹节 */}
      <rect x="55" y="30" width="4" height="70" rx="2" fill="#66BB6A" />
      <rect x="62" y="35" width="4" height="65" rx="2" fill="#4CAF50" />
      <rect x="48" y="40" width="4" height="60" rx="2" fill="#81C784" />
      {/* 竹节线 */}
      <line x1="55" y1="50" x2="59" y2="50" stroke="#2E7D32" strokeWidth="1" />
      <line x1="55" y1="70" x2="59" y2="70" stroke="#2E7D32" strokeWidth="1" />
      <line x1="62" y1="55" x2="66" y2="55" stroke="#2E7D32" strokeWidth="1" />
      <line x1="62" y1="75" x2="66" y2="75" stroke="#2E7D32" strokeWidth="1" />
      {/* 顶部叶片 */}
      <path d="M57 30 C52 22 48 24 50 18 C52 12 57 16 57 22" fill="#66BB6A" />
      <path d="M57 30 C62 22 66 24 64 18 C62 12 57 16 57 22" fill="#81C784" />
      <path d="M64 35 C68 28 72 30 70 24" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 根据植物 ID 获取对应插画
export function PlantIllustrationById({ id, className = "" }: { id: string; className?: string }) {
  const map: Record<string, React.FC<IllustrationProps>> = {
    monstera: MonsteraIllustration,
    pothos: PothosIllustration,
    echeveria: SucculentIllustration,
    "ficus-lyrata": FiddleLeafIllustration,
    sansevieria: SnakePlantIllustration,
    chlorophytum: SpiderPlantIllustration,
    pachira: MoneyTreeIllustration,
    cactus: CactusIllustration,
    "rubber-plant": RubberPlantIllustration,
    "areca-palm": ArecaPalmIllustration,
    spathiphyllum: PeaceLilyIllustration,
    aloe: AloeIllustration,
    "asparagus-fern": AsparagusIllustration,
    pilea: PileaIllustration,
    peperomia: PeperomiaIllustration,
    strelitzia: StrelitziaIllustration,
    ivy: IvyIllustration,
    "lucky-bamboo": LuckyBambooIllustration,
  };

  const Component = map[id] || MonsteraIllustration;
  return <Component className={className} />;
}
