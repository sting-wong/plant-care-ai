"use client";

import type { DiagnosisResponse } from "@/lib/ai/types";
import { Heart, AlertTriangle, AlertCircle, Droplets, Sun, Sprout, MessageCircle } from "lucide-react";

interface DiagnosisCardProps {
  diagnosis: DiagnosisResponse;
}

const statusConfig = {
  healthy: {
    label: "状态良好",
    icon: Heart,
    color: "text-green-600 bg-green-50 border-green-200",
    emoji: "😊",
  },
  needs_attention: {
    label: "需要关注",
    icon: AlertTriangle,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    emoji: "🤔",
  },
  critical: {
    label: "需要紧急处理",
    icon: AlertCircle,
    color: "text-red-600 bg-red-50 border-red-200",
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
  const nextQuestions = diagnosis.nextQuestions?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-2xl border border-green-50/50 shadow-[0_2px_12px_rgba(45,125,70,0.06)] overflow-hidden mx-4">
      {/* 植物名称区域 */}
      <div className="px-5 pt-5 pb-3 border-b border-green-50/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">{status.emoji}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[#1A2E1A]">
              {diagnosis.plantName}
            </h3>
            {diagnosis.scientificName && (
              <p className="text-xs text-[#6B7B6B] mt-0.5">
                {diagnosis.scientificName}
              </p>
            )}
            <p className="mt-2 text-sm text-[#1A2E1A] leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* 状态标签网格 */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium whitespace-nowrap">
            <Droplets className="w-3.5 h-3.5" />
            看土再浇
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium whitespace-nowrap">
            <Sun className="w-3.5 h-3.5" />
            散射光
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}>
            <status.icon className="w-3.5 h-3.5" />
            {status.label}
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
                    className="flex gap-2 rounded-xl bg-amber-50/60 px-3 py-2 text-sm leading-relaxed text-[#5A4515]"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
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
                    className="flex gap-2 rounded-xl bg-[#F4FAF1] px-3 py-2 text-sm leading-relaxed text-[#1A2E1A]"
                  >
                    <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-[#2D7D46]" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {nextQuestions.length > 0 && (
            <section>
              <p className="mb-2 text-xs font-medium text-[#6B7B6B]">可以继续问我</p>
              <div className="flex flex-wrap gap-2">
                {nextQuestions.map((question) => (
                  <span
                    key={question}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs text-[#2D7D46] ring-1 ring-green-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {question}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 底部操作 */}
      <div className="mx-5 pb-5">
        <button className="w-full py-2.5 bg-[#2D7D46] text-white text-sm font-medium rounded-xl hover:bg-[#246838] transition-colors">
          保存到我的植物
        </button>
      </div>
    </div>
  );
}
