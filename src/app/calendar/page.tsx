"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets, Sparkles, Check } from "lucide-react";
import { usePlantStore, type MyPlant } from "@/lib/store";

type ViewMode = "week" | "month";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getTasksForDate(
  plants: Record<string, MyPlant>,
  date: Date
): { plant: MyPlant; type: "water" | "fertilize" }[] {
  const tasks: { plant: MyPlant; type: "water" | "fertilize" }[] = [];
  const targetDay = new Date(date);
  targetDay.setHours(0, 0, 0, 0);

  Object.values(plants).forEach((plant) => {
    // 浇水任务
    const lastWatered = new Date(plant.lastWateredAt);
    lastWatered.setHours(0, 0, 0, 0);
    const nextWater = new Date(lastWatered);
    nextWater.setDate(nextWater.getDate() + plant.wateringIntervalDays);

    // 检查目标日期是否是浇水日（或之后的周期日）
    const daysDiff = Math.floor(
      (targetDay.getTime() - nextWater.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff >= 0 && daysDiff % plant.wateringIntervalDays === 0) {
      tasks.push({ plant, type: "water" });
    } else if (targetDay.getTime() === nextWater.getTime()) {
      tasks.push({ plant, type: "water" });
    }

    // 施肥任务
    const lastFert = new Date(plant.lastFertilizedAt);
    lastFert.setHours(0, 0, 0, 0);
    const nextFert = new Date(lastFert);
    nextFert.setDate(nextFert.getDate() + plant.fertilizingIntervalDays);

    if (targetDay.getTime() === nextFert.getTime()) {
      tasks.push({ plant, type: "fertilize" });
    }
  });

  return tasks;
}

function getWeekDates(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatWeekDay(date: Date): string {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[date.getDay()];
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function CalendarPage() {
  const { plants, waterPlant, fertilizePlant } = usePlantStore();

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const weekDates = getWeekDates();

  const handleComplete = (plantId: string, type: "water" | "fertilize") => {
    const key = `${plantId}-${type}`;
    if (type === "water") waterPlant(plantId);
    else fertilizePlant(plantId);
    setCompletedTasks((prev) => new Set([...prev, key]));
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <main className="min-h-dvh px-5 pt-6 pb-4 page-slide-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1A2E1A]">养护日历</h1>
        <button
          onClick={() => setViewMode(viewMode === "week" ? "month" : "week")}
          className="px-3 py-1.5 text-xs font-medium text-[#2D7D46] bg-green-50 rounded-lg"
        >
          {viewMode === "week" ? "月视图" : "周视图"}
        </button>
      </div>

      {viewMode === "month" ? (
        /* 月视图 */
        <div className="card-natural p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1">
              <ChevronLeft className="w-5 h-5 text-[#6B7B6B]" />
            </button>
            <span className="text-sm font-medium text-[#1A2E1A]">
              {currentYear}年{currentMonth + 1}月
            </span>
            <button onClick={nextMonth} className="p-1">
              <ChevronRight className="w-5 h-5 text-[#6B7B6B]" />
            </button>
          </div>

          {/* 星期头 */}
          <div className="grid grid-cols-7 mb-2">
            {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
              <div key={d} className="text-center text-[10px] text-[#6B7B6B]">
                {d}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: (getFirstDayOfMonth(currentYear, currentMonth) + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, i) => {
              const date = new Date(currentYear, currentMonth, i + 1);
              const tasks = getTasksForDate(plants, date);
              const isSel =
                selectedDate.getDate() === i + 1 &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`relative h-9 flex flex-col items-center justify-center rounded-lg text-xs transition-colors ${
                    isSel
                      ? "bg-[#2D7D46] text-white"
                      : isToday(date)
                      ? "bg-green-50 text-[#2D7D46] font-medium"
                      : "text-[#1A2E1A]"
                  }`}
                >
                  {i + 1}
                  {tasks.length > 0 && !isSel && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#2D7D46]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 周视图 */
        <div className="mb-4">
          <p className="text-sm font-medium text-[#1A2E1A] mb-3">本周养护计划</p>
        </div>
      )}

      {/* 任务列表 */}
      <div className="space-y-4">
        {(viewMode === "week" ? weekDates : [selectedDate]).map((date) => {
          const tasks = getTasksForDate(plants, date);
          const dateLabel = isToday(date)
            ? "今天"
            : `${date.getMonth() + 1}/${date.getDate()} ${formatWeekDay(date)}`;

          return (
            <div key={date.toISOString()}>
              <p className={`text-xs font-medium mb-2 ${isToday(date) ? "text-[#2D7D46]" : "text-[#6B7B6B]"}`}>
                {dateLabel}
              </p>
              {tasks.length === 0 ? (
                <p className="text-xs text-[#6B7B6B] pl-2 mb-2">无任务</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const key = `${task.plant.id}-${task.type}`;
                    const isDone = completedTasks.has(key);
                    return (
                      <div
                        key={key}
                        className={`card-natural p-3 flex items-center gap-3 ${isDone ? "opacity-50" : ""}`}
                      >
                        <Link href={`/plants/${task.plant.id}`} className="flex-1 flex items-center gap-3">
                          {task.type === "water" ? (
                            <Droplets className="w-4 h-4 text-[#4FC3F7]" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-[#F5A623]" />
                          )}
                          <span className={`text-sm ${isDone ? "line-through text-[#6B7B6B]" : "text-[#1A2E1A]"}`}>
                            {task.plant.name} · {task.type === "water" ? "浇水" : "施肥"}
                          </span>
                        </Link>
                        {!isDone && (
                          <button
                            onClick={() => handleComplete(task.plant.id, task.type)}
                            className="w-7 h-7 rounded-full border-2 border-[#2D7D46] flex items-center justify-center hover:bg-green-50"
                          >
                            <Check className="w-3.5 h-3.5 text-[#2D7D46]" />
                          </button>
                        )}
                        {isDone && (
                          <div className="w-7 h-7 rounded-full bg-[#2D7D46] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(plants).length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-[#6B7B6B]">添加植物后，养护计划会显示在这里</p>
        </div>
      )}
    </main>
  );
}
