"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { Leaf, Droplets, Sparkles, ChevronRight, Clock, Plus, Sun, CalendarDays, BookOpen, Camera, ImagePlus } from "lucide-react";
import { PhotoCapture } from "@/components/photo-capture";
import { EmptyPlantIllustration } from "@/components/illustrations";
import { compressImage } from "@/lib/utils";
import { usePlantStore, type MyPlant } from "@/lib/store";
import { getCurrentSeasonalTips } from "@/lib/data/seasonal-tips";

function getTodayReminders(plants: Record<string, MyPlant>) {
  const reminders: { plant: MyPlant; type: "water" | "fertilize"; daysOverdue: number }[] = [];
  Object.values(plants).forEach((plant) => {
    const daysSinceWatered = Math.floor(
      (Date.now() - plant.lastWateredAt) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceWatered >= plant.wateringIntervalDays) {
      reminders.push({ plant, type: "water", daysOverdue: daysSinceWatered - plant.wateringIntervalDays });
    }
    const daysSinceFertilized = Math.floor(
      (Date.now() - plant.lastFertilizedAt) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceFertilized >= plant.fertilizingIntervalDays) {
      reminders.push({ plant, type: "fertilize", daysOverdue: daysSinceFertilized - plant.fertilizingIntervalDays });
    }
  });
  return reminders.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

function getGreeting(plants: Record<string, MyPlant>, reminders: ReturnType<typeof getTodayReminders>) {
  const overdueCount = reminders.filter((r) => r.daysOverdue > 0).length;
  const todayCount = reminders.length;

  if (overdueCount > 0) {
    return `有 ${overdueCount} 棵植物在等你浇水哦`;
  } else if (todayCount > 0) {
    return `今天有 ${todayCount} 棵植物需要照顾`;
  } else if (Object.keys(plants).length === 0) {
    return "添加你的第一棵植物吧";
  } else {
    return "你的植物们今天都很好 ✨";
  }
}

export default function HomePage() {
  const router = useRouter();
  const createSession = usePlantStore((s) => s.createSession);
  const plants = usePlantStore((s) => s.plants);
  const sessions = usePlantStore((s) => s.sessions);

  const reminders = getTodayReminders(plants);
  const seasonalTips = getCurrentSeasonalTips();
  const greeting = getGreeting(plants, reminders);
  const plantList = Object.values(plants).sort((a, b) => b.createdAt - a.createdAt);
  const recentSessions = Object.values(sessions)
    .filter((s) => s.diagnosis)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const handleCapture = async (file: File) => {
    const { base64 } = await compressImage(file);
    const sessionId = nanoid(10);
    createSession(sessionId, base64);
    router.push(`/diagnosis/${sessionId}`);
  };

  return (
    <main className="min-h-dvh animate-fade-in">
      {/* 顶部渐变问候区 */}
      <div className="bg-gradient-to-b from-[#E8F5E9] to-[#FAFDF7] -mx-0 px-5 pt-8 pb-5 rounded-b-[32px] mb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 bg-[#2D7D46]/10 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#2D7D46]" />
          </div>
          <h1 className="text-lg font-bold text-[#1A2E1A]">植物管家</h1>
        </div>
        <p className="text-sm text-[#6B7B6B] ml-[46px]">{greeting}</p>
      </div>

      <div className="px-5">
      {/* 双入口：拍照 + 相册 */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "environment" as any;
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) await handleCapture(file);
            };
            input.click();
          }}
          className="flex-1 card-natural p-3.5 flex flex-col items-center gap-2 press-effect"
        >
          <div className="w-11 h-11 rounded-full bg-[#2D7D46]/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#2D7D46]" />
          </div>
          <span className="text-xs font-medium text-[#1A2E1A]">拍照识别</span>
        </button>

        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) await handleCapture(file);
            };
            input.click();
          }}
          className="flex-1 card-natural p-3.5 flex flex-col items-center gap-2 press-effect"
        >
          <div className="w-11 h-11 rounded-full bg-[#8BC34A]/10 flex items-center justify-center">
            <ImagePlus className="w-5 h-5 text-[#8BC34A]" />
          </div>
          <span className="text-xs font-medium text-[#1A2E1A]">相册识别</span>
        </button>
      </div>

      {/* 快捷工具栏 */}
      <div className="flex gap-3 mb-5 overflow-x-auto hide-scrollbar -mx-5 px-5">
        <Link
          href="/tools/light-meter"
          className="card-natural px-4 py-3 flex items-center gap-2.5 shrink-0 press-effect"
        >
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <Sun className="w-4 h-4 text-[#F5A623]" />
          </div>
          <span className="text-xs font-medium text-[#1A2E1A]">光照计</span>
        </Link>
        <Link
          href="/calendar"
          className="card-natural px-4 py-3 flex items-center gap-2.5 shrink-0 press-effect"
        >
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#2D7D46]" />
          </div>
          <span className="text-xs font-medium text-[#1A2E1A]">养护日历</span>
        </Link>
        <Link
          href="/discover"
          className="card-natural px-4 py-3 flex items-center gap-2.5 shrink-0 press-effect"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#4FC3F7]" />
          </div>
          <span className="text-xs font-medium text-[#1A2E1A]">植物百科</span>
        </Link>
      </div>

      {/* 今日待办 */}
      {reminders.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">今日待办</span>
            <Link href="/reminders" className="text-xs text-green-600">
              查看全部
            </Link>
          </div>
          <div className="space-y-2">
            {reminders.slice(0, 4).map((r, i) => (
              <Link
                key={`${r.plant.id}-${r.type}-${i}`}
                href={`/plants/${r.plant.id}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-blue-200 transition-colors press-effect"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <img
                    src={r.plant.imageBase64}
                    alt={r.plant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {r.plant.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.type === "water" ? "需要浇水" : "需要施肥"}
                    {r.daysOverdue > 0 && (
                      <span className="text-red-500 ml-1">
                        · 已超期{r.daysOverdue}天
                      </span>
                    )}
                  </p>
                </div>
                {r.type === "water" ? (
                  <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 没有待办时的提示 */}
      {reminders.length === 0 && plantList.length > 0 && (
        <div className="mb-5 bg-green-50/50 border border-green-100/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-green-700">
            今天没有需要照顾的植物，放松一下吧 ☀️
          </p>
        </div>
      )}

      {/* 我的植物横向滚动 */}
      {plantList.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">
              我的植物 ({plantList.length})
            </span>
            <Link href="/plants" className="text-xs text-green-600">
              查看全部
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {plantList.map((plant) => (
              <Link
                key={plant.id}
                href={`/plants/${plant.id}`}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-green-100">
                  <img
                    src={plant.imageBase64}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] text-gray-600 max-w-[56px] truncate">
                  {plant.name}
                </span>
              </Link>
            ))}
            <Link
              href="/plants/add"
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-[10px] text-gray-400">添加</span>
            </Link>
          </div>
        </div>
      )}

      {/* 没有植物时的引导 */}
      {plantList.length === 0 && (
        <div className="mb-5 card-natural p-6 text-center animate-scale-in">
          <EmptyPlantIllustration className="w-32 h-32 mx-auto mb-2 animate-float" />
          <p className="text-sm font-medium text-[#1A2E1A] mb-1">还没有添加植物</p>
          <p className="text-xs text-[#6B7B6B] mb-4">
            添加你的植物，我来帮你记住浇水时间
          </p>
          <Link
            href="/plants/add"
            className="inline-block px-5 py-2.5 btn-primary text-sm"
          >
            添加第一棵植物
          </Link>
        </div>
      )}

      {/* 季节养护提示 */}
      {seasonalTips.length > 0 && (
        <div className="mb-5">
          <div className="card-natural p-4 border-l-4 border-l-[#8BC34A]">
            <p className="text-xs font-medium text-[#2D7D46] mb-1">
              💡 {seasonalTips[0].title}
            </p>
            <p className="text-xs text-[#6B7B6B] leading-relaxed">
              {seasonalTips[0].content.slice(0, 80)}...
            </p>
          </div>
        </div>
      )}

      {/* 最近诊断 */}
      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">最近诊断</span>
            </div>
            <Link href="/history" className="text-xs text-green-600">
              全部记录
            </Link>
          </div>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/diagnosis/${session.id}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-green-200 transition-colors press-effect"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={session.imageBase64}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.diagnosis?.plantName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {(session.diagnosis?.greeting || "").slice(0, 30)}...
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
