"use client";

import { useEffect } from "react";
import { usePlantStore } from "@/lib/store";

/**
 * 检查是否有植物需要浇水/施肥，发送浏览器通知
 * 在 layout 中使用，每次页面可见时检查一次
 */
export function useRemindCheck() {
  const plants = usePlantStore((s) => s.plants);

  useEffect(() => {
    const checkReminders = () => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const now = Date.now();
      const reminders: string[] = [];

      Object.values(plants).forEach((plant) => {
        const daysSinceWatered = Math.floor(
          (now - plant.lastWateredAt) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceWatered >= plant.wateringIntervalDays) {
          reminders.push(`${plant.name} 该浇水了`);
        }
      });

      if (reminders.length > 0) {
        // 避免重复通知：每天最多通知一次
        const lastNotified = localStorage.getItem("last-remind-date");
        const today = new Date().toDateString();
        if (lastNotified === today) return;

        new Notification("植物管家提醒", {
          body: reminders.slice(0, 3).join("、"),
          icon: "/icons/icon-192.svg",
        });
        localStorage.setItem("last-remind-date", today);
      }
    };

    // 页面可见时检查
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkReminders();
      }
    };

    // 首次加载检查
    checkReminders();

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [plants]);
}
