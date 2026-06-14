"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Leaf, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlantStore, type MyPlant } from "@/lib/store";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/scan", label: "诊断", icon: Camera },
  { href: "/plants", label: "植物", icon: Leaf },
  { href: "/history", label: "我的", icon: User },
];

function getRemindersCount(plants: Record<string, MyPlant>): number {
  let count = 0;
  Object.values(plants).forEach((plant) => {
    const daysSinceWatered = Math.floor(
      (Date.now() - plant.lastWateredAt) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceWatered >= plant.wateringIntervalDays) count++;
  });
  return count;
}

export function BottomNav() {
  const pathname = usePathname();
  const { plants } = usePlantStore();
  const remindersCount = getRemindersCount(plants);

  // 全屏/沉浸式页面隐藏导航
  if (pathname === "/scan") return null;
  if (pathname.startsWith("/diagnosis/")) return null;
  if (pathname.startsWith("/plants/") && pathname !== "/plants") return null;
  if (pathname === "/plants/add") return null;
  if (pathname.startsWith("/tools/")) return null;
  if (pathname.startsWith("/demo/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/30 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-1 transition-colors",
                isActive ? "text-[#2D7D46]" : "text-[#6B7B6B]"
              )}
            >
              <Icon
                className="w-5 h-5"
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 1.5 : 2}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#2D7D46]" />
              )}
              {tab.href === "/" && remindersCount > 0 && (
                <span className="absolute -top-0.5 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {remindersCount > 9 ? "9+" : remindersCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
