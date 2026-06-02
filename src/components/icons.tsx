"use client";

interface IconProps {
  size?: number;
  className?: string;
}

export function WaterDropIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="water-grad" x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#81D4FA" />
          <stop offset="100%" stopColor="#0288D1" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 5 10 5 14.5C5 18.64 8.13 22 12 22C15.87 22 19 18.64 19 14.5C19 10 12 2 12 2Z" fill="url(#water-grad)" />
      <ellipse cx="9.5" cy="14" rx="2" ry="3" fill="white" opacity="0.3" />
    </svg>
  );
}

export function SunshineIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <radialGradient id="sun-grad">
          <stop offset="0%" stopColor="#FFEE58" />
          <stop offset="100%" stopColor="#F9A825" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#sun-grad)" />
      <line x1="12" y1="1" x2="12" y2="4" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="23" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="4" y2="12" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="12" x2="23" y2="12" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FertilizerIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="fert-grad" x1="12" y1="4" x2="12" y2="22">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#F57F17" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="8" height="12" rx="2" fill="url(#fert-grad)" />
      <rect x="9" y="5" width="6" height="4" rx="1" fill="#FFE082" />
      <path d="M12 11 L12.8 13 L15 13 L13.2 14.2 L13.8 16.5 L12 15.2 L10.2 16.5 L10.8 14.2 L9 13 L11.2 13 Z" fill="white" opacity="0.8" />
    </svg>
  );
}

export function TemperatureIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="temp-grad" x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
      </defs>
      <rect x="10" y="3" width="4" height="14" rx="2" fill="#FFCDD2" stroke="#EF5350" strokeWidth="1" />
      <circle cx="12" cy="18" r="3.5" fill="url(#temp-grad)" />
      <rect x="11" y="8" width="2" height="9" rx="1" fill="url(#temp-grad)" />
    </svg>
  );
}

export function HumidityIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="humid-grad" x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#80CBC4" />
          <stop offset="100%" stopColor="#00897B" />
        </linearGradient>
      </defs>
      <path d="M12 2 C12 2 6 9 6 13 C6 16.3 8.7 19 12 19 C15.3 19 18 16.3 18 13 C18 9 12 2 12 2Z" fill="url(#humid-grad)" opacity="0.7" />
      <path d="M12 8 C12 8 9 12 9 14 C9 15.7 10.3 17 12 17 C13.7 17 15 15.7 15 14 C15 12 12 8 12 8Z" fill="url(#humid-grad)" />
      <ellipse cx="11" cy="13" rx="1.5" ry="2" fill="white" opacity="0.3" />
    </svg>
  );
}

export function LeafIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="leaf-grad" x1="4" y1="4" x2="20" y2="20">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25" fill="url(#leaf-grad)" />
      <path d="M12 12 C9 15 7 18 5.71 22" stroke="#1B5E20" strokeWidth="0.8" opacity="0.4" fill="none" />
    </svg>
  );
}
