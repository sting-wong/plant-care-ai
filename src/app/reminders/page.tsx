"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyWateringIllustration } from "@/components/illustrations";
import {
  Bell,
  BellOff,
  Droplets,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePlantStore, type MyPlant } from "@/lib/store";

interface ReminderItem {
  plant: MyPlant;
  type: "water" | "fertilize";
  dueDate: Date;
  daysFromNow: number; // negative = overdue, 0 = today, positive = future
}

function getUpcomingReminders(plants: Record<string, MyPlant>): ReminderItem[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const items: ReminderItem[] = [];

  Object.values(plants).forEach((plant) => {
    // 浇水提醒
    const lastWatered = new Date(plant.lastWateredAt);
    const nextWater = new Date(lastWatered);
    nextWater.setDate(nextWater.getDate() + plant.wateringIntervalDays);
    nextWater.setHours(0, 0, 0, 0);
    const waterDaysFromNow = Math.floor(
      (nextWater.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (waterDaysFromNow <= 7) {
      items.push({ plant, type: "water", dueDate: nextWater, daysFromNow: waterDaysFromNow });
    }

    // 施肥提醒
    const lastFertilized = new Date(plant.lastFertilizedAt);
    const nextFert = new Date(lastFertilized);
    nextFert.setDate(nextFert.getDate() + plant.fertilizingIntervalDays);
    nextFert.setHours(0, 0, 0, 0);
    const fertDaysFromNow = Math.floor(
      (nextFert.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (fertDaysFromNow <= 7) {
      items.push({ plant, type: "fertilize", dueDate: nextFert, daysFromNow: fertDaysFromNow });
    }
  });

  return items.sort((a, b) => a.daysFromNow - b.daysFromNow);
}

function getDayLabel(daysFromNow: number): string {
  if (daysFromNow < 0) return "已过期";
  if (daysFromNow === 0) return "今天";
  if (daysFromNow === 1) return "明天";
  if (daysFromNow === 2) return "后天";
  return `${daysFromNow}天后`;
}

function ReminderRow({
  item,
  onComplete,
}: {
  item: ReminderItem;
  onComplete: () => void;
}) {
  const [done, setDone] = useState(false);

  if (done) return null;

  const isOverdue = item.daysFromNow < 0;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
        isOverdue
          ? "bg-red-50 border-red-100"
          : "bg-white border-gray-100"
      }`}
    >
      <Link
        href={`/plants/${item.plant.id}`}
        className="w-9 h-9 rounded-full overflow-hidden shrink-0"
      >
        <img
          src={item.plant.imageBase64}
          alt={item.plant.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <Link href={`/plants/${item.plant.id}`} className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.plant.name}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          {item.type === "water" ? (
            <><Droplets className="w-3 h-3 text-blue-500" /> 浇水</>
          ) : (
            <><Sparkles className="w-3 h-3 text-amber-500" /> 施肥</>
          )}
          {isOverdue && (
            <span className="text-red-500 ml-1">
              超期 {Math.abs(item.daysFromNow)} 天
            </span>
          )}
        </p>
      </Link>

      <button
        onClick={() => {
          onComplete();
          setDone(true);
        }}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          item.type === "water"
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
            : "bg-amber-50 text-amber-600 hover:bg-amber-100 active:bg-amber-200"
        }`}
      >
        {item.type === "water" ? "已浇水" : "已施肥"}
      </button>
    </div>
  );
}

export default function RemindersPage() {
  const plants = usePlantStore((s) => s.plants);
  const waterPlant = usePlantStore((s) => s.waterPlant);
  const fertilizePlant = usePlantStore((s) => s.fertilizePlant);

  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }
  }, []);

  const requestNotification = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification("植物管家", {
          body: "通知已开启！我会在植物需要照顾时提醒你。",
          icon: "/icons/icon-192.svg",
        });
      }
    }
  };

  const reminders = getUpcomingReminders(plants);

  const handleComplete = (item: ReminderItem) => {
    const key = `${item.plant.id}-${item.type}`;
    if (item.type === "water") {
      waterPlant(item.plant.id);
    } else {
      fertilizePlant(item.plant.id);
    }
    setCompletedItems((prev) => [...prev, key]);
  };

  // 按日期分组
  const groups: Record<string, ReminderItem[]> = {};
  reminders.forEach((item) => {
    const label = getDayLabel(item.daysFromNow);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  const activeReminders = reminders.filter(
    (r) => !completedItems.includes(`${r.plant.id}-${r.type}`)
  );

  return (
    <main className="min-h-dvh px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">养护提醒</h1>

      {/* 通知权限 */}
      {notificationPermission !== "granted" &&
        notificationPermission !== "unsupported" && (
          <button
            onClick={requestNotification}
            className="w-full flex items-center gap-3 p-4 mb-4 bg-green-50 border border-green-100 rounded-xl text-left"
          >
            <Bell className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                开启通知提醒
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                在植物需要浇水或施肥时推送提醒
              </p>
            </div>
          </button>
        )}

      {notificationPermission === "denied" && (
        <div className="flex items-center gap-3 p-4 mb-4 bg-gray-50 border border-gray-100 rounded-xl">
          <BellOff className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-xs text-gray-500">
            通知权限已被拒绝，请在浏览器设置中手动开启
          </p>
        </div>
      )}

      {/* 空状态 */}
      {Object.keys(plants).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <EmptyWateringIllustration className="w-36 h-36 mb-2 animate-float" />
          <p className="text-sm font-medium text-[#1A2E1A] mb-1">暂无提醒</p>
          <p className="text-xs text-[#6B7B6B]">
            先去"我的植物"添加植物，设置浇水周期后就会有提醒了
          </p>
        </div>
      ) : activeReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
          <EmptyWateringIllustration className="w-32 h-32 mb-2" />
          <p className="text-sm font-medium text-[#2D7D46] mb-1">全部搞定！</p>
          <p className="text-xs text-[#6B7B6B]">
            未来 7 天暂时没有需要照顾的植物
          </p>
        </div>
      ) : (
        /* 按日期分组展示 */
        <div className="space-y-5">
          {Object.entries(groups).map(([label, items]) => {
            const activeItems = items.filter(
              (r) => !completedItems.includes(`${r.plant.id}-${r.type}`)
            );
            if (activeItems.length === 0) return null;

            return (
              <div key={label}>
                <p
                  className={`text-xs font-medium mb-2 ${
                    label === "已过期" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {label}
                  {label === "已过期" && " ⚠️"}
                </p>
                <div className="space-y-2">
                  {activeItems.map((item, i) => (
                    <ReminderRow
                      key={`${item.plant.id}-${item.type}-${i}`}
                      item={item}
                      onComplete={() => handleComplete(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 已完成折叠区 */}
      {completedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm text-gray-500 mb-2"
          >
            {showCompleted ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            已完成 ({completedItems.length})
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completedItems.map((key) => {
                const [plantId, type] = key.split("-");
                const plant = plants[plantId];
                if (!plant) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-60"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-500 line-through">
                      {plant.name} — {type === "water" ? "浇水" : "施肥"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
