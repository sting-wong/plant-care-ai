"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { Droplets, Sparkles, ChevronRight, Clock, Plus, Camera } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { usePlantStore } from "@/lib/store";
import { getTodayReminders } from "@/lib/care-tasks";

function PlantAvatar({ imageBase64, name, size = 56 }: { imageBase64?: string; name: string; size?: number }) {
  if (imageBase64 && imageBase64.startsWith("data:")) {
    return (
      <img
        src={imageBase64}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  const colors = ["#C8E6C9", "#DCEDC8", "#B2DFDB", "#F0F4C3", "#D7CCC8"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{ width: size, height: size, background: color }}
      className="rounded-full flex items-center justify-center shrink-0"
    >
      <span className="text-lg">🌿</span>
    </div>
  );
}

// Maps 0–100 score to SVG stroke-dashoffset for a circle with r=38 (circumference ≈ 239)
function scoreToOffset(score: number) {
  const circumference = 2 * Math.PI * 38;
  return circumference * (1 - score / 100);
}

export default function HomePage() {
  const router = useRouter();
  const store = usePlantStore();
  const { createSession, plants, sessions } = store;

  const reminders = getTodayReminders(plants);
  const plantList = Object.values(plants).sort((a, b) => b.createdAt - a.createdAt);
  const recentSessions = Object.values(sessions)
    .filter((s) => s.diagnosis)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const heroReminder = reminders[0];
  const overdueCount = reminders.filter((r) => r.daysOverdue > 0).length;
  const healthyCount = plantList.filter((p) => p.health === "healthy").length;
  const watchCount = plantList.filter((p) => p.health === "watch").length;
  const urgentCount = plantList.filter((p) => p.health === "urgent").length;

  // Garden health score: overdue -15, watch -10, urgent -20, floored at 0
  const healthPenalty = urgentCount * 20 + watchCount * 10;
  const gardenScore = plantList.length === 0
    ? 0
    : Math.max(0, 100 - overdueCount * 15 - healthPenalty);
  const circumference = 2 * Math.PI * 38;
  const dashOffset = scoreToOffset(gardenScore);

  const handleCapture = async (file: File) => {
    const { base64 } = await compressImage(file);
    const sessionId = nanoid(10);
    createSession(sessionId, base64);
    router.push(`/diagnosis/${sessionId}`);
  };
  void handleCapture;

  const now = new Date();
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateLabel = `${month}月${day}日`;

  const taskSubtitle =
    overdueCount > 0
      ? `有 ${overdueCount} 棵植物需要照顾`
      : plantList.length > 0
        ? "植物们今天状态都不错"
        : "添加你的第一棵植物";

  return (
    <main className="glass-bg min-h-dvh pb-28 animate-fade-in">

      {/* ── 深绿 Hero ── */}
      <div className="hero-forest">
        {/* 状态栏占位 + 问候 */}
        <div className="px-5 pt-14 pb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">
            {timeGreeting} · {dateLabel}
          </p>
          <h1 className="text-[26px] font-extrabold text-white leading-tight">我的植物花园</h1>
          <p className="text-[13px] text-white/55 mt-1">{taskSubtitle}</p>
        </div>

        {/* 花园健康评分卡 */}
        <div className="mx-4 mb-6 rounded-3xl px-5 py-4 flex items-center gap-5"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}>
          {/* SVG 环 */}
          <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
            <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="7" />
              <circle
                cx="44" cy="44" r="38" fill="none"
                stroke={gardenScore >= 70 ? "#4CAF7A" : gardenScore >= 40 ? "#FBBF24" : "#F87171"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={plantList.length === 0 ? circumference : dashOffset}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[26px] font-black text-white leading-none">
                {plantList.length === 0 ? "—" : gardenScore}
              </span>
              <span className="text-[8px] font-bold tracking-widest uppercase text-white/40 mt-0.5">SCORE</span>
            </div>
          </div>

          {/* 统计列 */}
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">花园概览</p>
            {plantList.length === 0 ? (
              <p className="text-[13px] text-white/50">还没有植物</p>
            ) : (
              <>
                {urgentCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#F87171", boxShadow: "0 0 6px rgba(248,113,113,.4)" }} />
                    <span className="flex-1 text-[13px] font-medium text-white/80">需要紧急处理</span>
                    <span className="text-[14px] font-black text-white">{urgentCount}</span>
                  </div>
                )}
                {watchCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#FBBF24", boxShadow: "0 0 6px rgba(251,191,36,.4)" }} />
                    <span className="flex-1 text-[13px] font-medium text-white/80">需要关注</span>
                    <span className="text-[14px] font-black text-white">{watchCount}</span>
                  </div>
                )}
                {healthyCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#4CAF7A", boxShadow: "0 0 6px rgba(76,175,122,.4)" }} />
                    <span className="flex-1 text-[13px] font-medium text-white/80">状态良好</span>
                    <span className="text-[14px] font-black text-white">{healthyCount}</span>
                  </div>
                )}
                {urgentCount === 0 && watchCount === 0 && healthyCount === 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#4CAF7A" }} />
                    <span className="flex-1 text-[13px] font-medium text-white/80">全部待评估</span>
                    <span className="text-[14px] font-black text-white">{plantList.length}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 奶油色主体区（圆角上推） ── */}
      <div
        className="relative -mt-5 px-4 pt-5 space-y-5"
        style={{ background: "var(--cream, #F9F6EF)", borderRadius: "28px 28px 0 0", minHeight: "60vh" }}
      >
        {/* 今日任务 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7B6B]">今日任务</span>
            {reminders.length > 0 && (
              <span className="text-[11px] font-semibold text-[#2D7D46]">{reminders.length} 项</span>
            )}
          </div>

          {reminders.length > 0 ? (
            <div className="space-y-2">
              {reminders.slice(0, 4).map((r) => {
                const isUrgent = r.daysOverdue > 0;
                return (
                  <div
                    key={`${r.plant.id}-${r.type}`}
                    className={isUrgent ? "task-card-urgent press-effect" : "task-card-warn press-effect"}
                    onClick={() => router.push(`/plants/${r.plant.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {/* avatar */}
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: isUrgent ? "#FEE2E2" : "#FEF3C7" }}
                      >
                        {r.plant.imageBase64?.startsWith("data:") ? (
                          <img src={r.plant.imageBase64} alt={r.plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🌿</span>
                        )}
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#111C13] leading-snug truncate">{r.plant.name}</p>
                        <p className="text-[12px] text-[#5A6B5A] mt-0.5">
                          {r.type === "water" ? "该浇水了" : "该施肥了"}
                        </p>
                      </div>
                      {/* badge */}
                      <div
                        className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={isUrgent
                          ? { background: "#FEE2E2", color: "#C53030" }
                          : { background: "#FEF3C7", color: "#B45309" }
                        }
                      >
                        {isUrgent ? `超 ${r.daysOverdue}天` : "今天"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : plantList.length === 0 ? (
            /* 空状态：无植物 */
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid rgba(21,46,30,0.06)" }}>
              <div className="w-10 h-10 rounded-full bg-[#2D7D46]/10 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-[#2D7D46]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A2E1A]">还没有植物</p>
                <p className="text-xs text-[#6B7B6B] mt-0.5">添加植物后自动生成养护提醒</p>
              </div>
              <button
                onClick={() => router.push("/plants/add")}
                className="shrink-0 text-xs font-semibold text-[#2D7D46] bg-[#2D7D46]/10 px-3 py-1.5 rounded-full"
              >
                添加
              </button>
            </div>
          ) : (
            /* 空状态：有植物但今天无任务 */
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid rgba(21,46,30,0.06)" }}>
              <span className="text-2xl">☀️</span>
              <p className="text-sm text-[#5A6B5A]">植物们今天都很好，无需照顾</p>
            </div>
          )}
        </section>

        {/* 我的植物横滚 */}
        {(plantList.length > 0 || true) && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7B6B]">
                我的植物 {plantList.length > 0 ? `(${plantList.length})` : ""}
              </span>
              {plantList.length > 0 && (
                <Link href="/plants" className="text-[12px] font-bold text-[#2D7D46]">查看全部</Link>
              )}
            </div>
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
              {plantList.map((plant) => {
                const daysSinceWatered = Math.floor((Date.now() - plant.lastWateredAt) / 86400000);
                const needsWater = daysSinceWatered >= plant.wateringIntervalDays;
                const healthColor = plant.health === "urgent" ? "#F87171"
                  : plant.health === "watch" ? "#FBBF24"
                  : "#4CAF7A";
                return (
                  <Link
                    key={plant.id}
                    href={`/plants/${plant.id}`}
                    className="shrink-0"
                    aria-label={`查看 ${plant.name}`}
                    style={{ width: 90 }}
                  >
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 4px 14px rgba(21,46,30,0.09)" }}>
                      <div className="relative" style={{ width: 90, height: 76 }}>
                        {plant.imageBase64?.startsWith("data:") ? (
                          <img src={plant.imageBase64} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#C8E6C9] text-3xl">🌿</div>
                        )}
                        {/* 顶部健康色条 */}
                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: healthColor }} />
                        {/* 浇水角标 */}
                        {needsWater && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center">
                            <Droplets className="w-2 h-2 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="px-2 py-1.5">
                        <p className="text-[11px] font-bold text-[#111C13] truncate">{plant.name}</p>
                        <p className="text-[10px] font-semibold mt-0.5"
                          style={{ color: healthColor }}>
                          {plant.health === "urgent" ? "紧急" : plant.health === "watch" ? "关注" : "良好"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link
                href="/plants/add"
                className="shrink-0 flex flex-col items-center justify-center gap-1.5"
                aria-label="添加植物"
                style={{ width: 90, height: 118 }}
              >
                <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1.5"
                  style={{ border: "2px dashed rgba(45,125,70,0.22)" }}>
                  <Plus className="w-5 h-5 text-[#2D7D46]/50" />
                  <span className="text-[11px] font-semibold text-[#2D7D46]/50">添加</span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* AI 诊断 CTA */}
        <section>
          <div
            className="rounded-2xl px-4 py-4 press-effect cursor-pointer"
            style={{ background: "linear-gradient(135deg, #152E1E 0%, #1E4029 100%)", boxShadow: "0 8px 28px rgba(21,46,30,0.14)" }}
            onClick={() => router.push("/scan")}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7A]" style={{ animation: "livepulse 2s infinite" }} />
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/45">AI 植物诊断</p>
            </div>
            <p className="text-[14px] text-white/85 leading-snug">
              发现叶片异常？拍张照片，AI 立即分析健康状态
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] font-semibold text-white/30">识别 · 诊断 · 养护建议</p>
              <div className="w-8 h-8 rounded-full bg-[#4CAF7A]/20 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#4CAF7A]" />
              </div>
            </div>
          </div>
        </section>

        {/* 最近诊断 */}
        {recentSessions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6B7B6B]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7B6B]">最近诊断</span>
              </div>
              <Link href="/history" className="text-[12px] font-bold text-[#2D7D46]">全部记录</Link>
            </div>
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const isHealthy = session.diagnosis?.healthStatus === "healthy";
                return (
                  <Link
                    key={session.id}
                    href={`/diagnosis/${session.id}`}
                    className="flex items-center gap-3 p-3 press-effect rounded-2xl"
                    style={{ background: "#fff", boxShadow: "0 1px 3px rgba(21,46,30,0.06)" }}
                    aria-label={`诊断记录 ${session.diagnosis?.plantName}`}
                  >
                    <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                      <img src={session.imageBase64} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#111C13] truncate">{session.diagnosis?.plantName}</p>
                      <p className="text-[11px] text-[#5A6B5A] mt-0.5 truncate">
                        {(session.diagnosis?.greeting || "").slice(0, 30)}...
                      </p>
                    </div>
                    <div
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black"
                      style={isHealthy
                        ? { background: "#DCFCE7", color: "#15803D" }
                        : { background: "#FEF3C7", color: "#B45309" }
                      }
                    >
                      {isHealthy ? "良好" : "关注"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9AAA9A] shrink-0 ml-1" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* livepulse 动画（内联 style） */}
      <style>{`
        @keyframes livepulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(.85); }
        }
      `}</style>
    </main>
  );
}
