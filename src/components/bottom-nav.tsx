"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { Home, Compass, Users, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlantStore, type MyPlant } from "@/lib/store";
import { useRef, useState } from "react";
import { compressImage } from "@/lib/utils";
import { ActionSheet } from "./action-sheet";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/discover", label: "发现", icon: Compass },
  { href: "__action__", label: "", icon: Plus }, // 中间按钮
  { href: "/community", label: "社区", icon: Users },
  { href: "/plants", label: "我的", icon: User },
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
  const router = useRouter();
  const plants = usePlantStore((s) => s.plants);
  const createSession = usePlantStore((s) => s.createSession);
  const remindersCount = getRemindersCount(plants);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // 这些页面隐藏底部导航
  const hideOnPaths = ["/diagnosis/", "/plants/add", "/history", "/community/post", "/community/post-", "/tools/"];
  const shouldHide = hideOnPaths.some((p) => {
    if (p === "/plants/add") return pathname === "/plants/add";
    return pathname.startsWith(p);
  });
  // 植物详情页、编辑页、社区帖子详情页隐藏
  if (pathname.match(/^\/plants\/[^/]+/)) return null;
  if (pathname.match(/^\/community\/[^/]+/) && pathname !== "/community") return null;
  if (shouldHide) return null;

  const handleCenterButton = () => {
    setShowActionSheet(true);
  };

  const handleCamera = () => {
    fileInputRef.current?.click();
  };

  const handleAddPlant = () => {
    router.push("/plants/add");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { base64 } = await compressImage(file);
    const sessionId = nanoid(10);
    createSession(sessionId, base64);
    router.push(`/diagnosis/${sessionId}`);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-green-100/30 safe-bottom z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
          {tabs.map((tab, index) => {
            if (tab.href === "__action__") {
              // 中间的 + 按钮
              return (
                <button
                  key="center"
                  onClick={handleCenterButton}
                  className="w-12 h-12 -mt-4 rounded-full bg-[#2D7D46] text-white flex items-center justify-center shadow-lg shadow-green-700/20 active:scale-95 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
              );
            }

            const Icon = tab.icon;
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
                  isActive
                    ? "text-[#2D7D46]"
                    : "text-[#6B7B6B]"
                )}
              >
                <Icon
                  className="w-5 h-5"
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 1.5 : 2}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {/* 选中态小圆点 */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#2D7D46]" />
                )}
                {/* 首页提醒角标 */}
                {tab.href === "/" && remindersCount > 0 && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {remindersCount > 9 ? "9+" : remindersCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onCamera={handleCamera}
        onAddPlant={handleAddPlant}
      />
    </>
  );
}
