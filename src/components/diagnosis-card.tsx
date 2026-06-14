"use client";

import type { DiagnosisResponse } from "@/lib/ai/types";
import { Heart, AlertTriangle, AlertCircle, Droplets, Sun } from "lucide-react";
import { GlassCard } from "@/components/glass-card";

interface DiagnosisCardProps {
  diagnosis: DiagnosisResponse;
}

const statusConfig = {
  healthy: {
    label: "状态良好",
    icon: Heart,
    pillClass: "bg-green-500/10 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full",
    emoji: "🌿",
  },
  needs_attention: {
    label: "需要关注",
    icon: AlertTriangle,
    pillClass: "bg-amber-500/10 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full",
    emoji: "🤔",
  },
  critical: {
    label: "需要紧急处理",
    icon: AlertCircle,
    pillClass: "bg-red-500/10 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full",
    emoji: "⚠️",
  },
};

export function DiagnosisCard({ diagnosis }: DiagnosisCardProps) {
  if (!diagnosis) return null;

  const status =
    statusConfig[diagnosis.healthStatus as keyof typeof statusConfig] ||
    statusConfig.needs_attention;
  const summary = diagnosis.summary || diagnosis.greeting;
  const visibleTips = diagnosis.careTips.slice(0, 4);
  const visibleIssues = diagnosis.issues.slice(0, 3);
  const confidence = (diagnosis as DiagnosisResponse & { confidence?: number }).confidence;
  const confidencePct = confidence !== undefined ? Math.round(confidence * 100) : null;

  return (
    <div className="glass-dark mx-4 overflow-hidden">
      {/* 植物名称区 */}
      <div className="px-5 pt-5 pb-3 border-b border-white/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">{status.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-[#1A2E1A]">{diagnosis.plantName}</h3>
              <span className={status.pillClass}>{status.label}</span>
              {confidencePct !== null && (
                <span className="bg-green-500/10 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{confidencePct}% 匹配</span>
              )}
            </div>
            {diagnosis.scientificName && (
              <p className="text-xs text-[#6B7B6B] mt-0.5 italic">{diagnosis.scientificName}</p>
            )}
            <p className="mt-2 text-[15px] text-[#1A2E1A] leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* 快速标签 */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 chip">
            <Droplets className="w-3.5 h-3.5 text-[#4FC3F7]" />
            看土再浇
          </div>
          <div className="flex items-center gap-1.5 chip">
            <Sun className="w-3.5 h-3.5 text-[#F5A623]" />
            散射光
          </div>
        </div>
      </div>

      {(visibleIssues.length > 0 || visibleTips.length > 0) && (
        <div className="px-5 pb-5 space-y-4">
          {visibleIssues.length > 0 && (
            <section>
              <p className="mb-2 text-xs font-medium text-[#6B7B6B]">需要留意</p>
              <div className="space-y-2">
                {visibleIssues.map((issue, index) => (
                  <div
                    key={`${issue}-${index}`}
                    className="glass-amber rounded-xl flex gap-2 px-3 py-2 text-sm leading-relaxed text-[#5A4515]"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibleTips.length > 0 && (
            <section>
              <p className="mb-2 text-xs font-medium text-[#6B7B6B]">现在可以这样做</p>
              <div className="grid gap-2">
                {visibleTips.map((tip, index) => (
                  <div
                    key={`${tip}-${index}`}
                    className="glass-green rounded-xl flex gap-2 px-3 py-2 text-sm leading-relaxed text-[#1A2E1A]"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#2D7D46] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 底部操作 */}
      <div className="flex gap-2 mx-5 pb-5">
        <GlassCard className="flex-1 py-3 text-center text-sm font-semibold text-[#1A2E1A] press-effect cursor-pointer">
          重新诊断
        </GlassCard>
        <button className="flex-1 py-3 bg-[#2D7D46] text-white text-sm font-semibold rounded-3xl hover:bg-[#246838] transition-colors shadow-lg shadow-green-900/25 press-effect">
          保存到我的植物
        </button>
      </div>
    </div>
  );
}
