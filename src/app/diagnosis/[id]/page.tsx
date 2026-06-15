"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, Loader2, Save, Stethoscope, Leaf, CalendarDays } from "lucide-react";
import { usePlantStore } from "@/lib/store";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { DiagnosisCard } from "@/components/diagnosis-card";
import { compressImage } from "@/lib/utils";
import type { DiagnosisResponse } from "@/lib/ai/types";

const LOADING_MESSAGES = [
  "正在观察叶片状态...",
  "正在判断光照和浇水问题...",
  "小植正在看这张照片...",
  "正在整理养护建议...",
];

function getRandomLoadingMessage() {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}

// Map confidence 0-100 to severity label + color
function confidenceToSeverity(confidence: number): { label: string; color: string; bg: string } {
  if (confidence >= 80) return { label: "状态良好", color: "#4CAF7A", bg: "rgba(76,175,122,0.12)" };
  if (confidence >= 50) return { label: "需要关注", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" };
  return { label: "需要紧急处理", color: "#F87171", bg: "rgba(248,113,113,0.12)" };
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<div className="glass-bg min-h-dvh flex items-center justify-center"><Loader2 className="w-6 h-6 text-[#2D7D46] animate-spin" /></div>}>
      <DiagnosisPageInner />
    </Suspense>
  );
}

function DiagnosisPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const plantId = searchParams.get("plantId");

  const { sessions, plants, setDiagnosis, addMessage, updatePlantDiagnosis, addGrowthRecord } = usePlantStore();
  const session = sessions[sessionId];
  const plant = plantId ? plants[plantId] : undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [saved, setSaved] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasDiagnosed = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isTyping]);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const t1 = setTimeout(() => setLoadingStep(1), 1800);
    const t2 = setTimeout(() => setLoadingStep(2), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!session || session.diagnosis || hasDiagnosed.current) return;
    hasDiagnosed.current = true;

    const runDiagnosis = async () => {
      setIsLoading(true);
      setLoadingMessage(getRandomLoadingMessage());
      try {
        const res = await fetch("/api/diagnosis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: session.imageBase64,
            mimeType: "image/jpeg",
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "诊断失败");
        }

        setDiagnosis(sessionId, data as DiagnosisResponse);

      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "未知错误";
        addMessage(sessionId, {
          id: nanoid(8),
          role: "assistant",
          content: `诊断出了点问题: ${errMsg}`,
          timestamp: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    runDiagnosis();
  }, [session, sessionId, setDiagnosis, addMessage]);

  const handleSaveCheckup = () => {
    if (!plantId || !session?.diagnosis) return;

    const diagnosis = session.diagnosis;

    // Map confidence to health status
    const confidence = diagnosis.confidence ?? 0;
    const health = confidence >= 80 ? "healthy" : confidence >= 50 ? "watch" : "urgent";

    updatePlantDiagnosis(plantId, {
      health,
      lastDiagnosisAt: Date.now(),
      lastDiagnosisSummary: diagnosis.greeting?.slice(0, 60) || diagnosis.plantName || "",
    });

    addGrowthRecord({
      id: nanoid(8),
      plantId,
      imageBase64: session.imageBase64,
      note: `AI复查：${diagnosis.greeting?.slice(0, 40) || "诊断完成"}`,
      createdAt: Date.now(),
    });

    setSaved(true);
    setTimeout(() => router.push(`/plants/${plantId}`), 800);
  };

  const handleSend = async (message: string) => {
    addMessage(sessionId, {
      id: nanoid(8),
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    setIsTyping(true);
    try {
      const currentSession = usePlantStore.getState().sessions[sessionId];
      const history = [
        { role: "user", content: "请帮我看看这棵植物" },
        ...(currentSession?.diagnosis?.greeting
          ? [{ role: "assistant", content: currentSession.diagnosis.greeting }]
          : []),
        ...(currentSession?.messages || []).map(m => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const res = await fetch("/api/diagnosis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: session?.diagnosis?.conversationId || sessionId,
          message,
          history,
        }),
      });
      const data = await res.json();

      addMessage(sessionId, {
        id: nanoid(8),
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
      });
    } catch {
      addMessage(sessionId, {
        id: nanoid(8),
        role: "assistant",
        content: "网络好像不太稳定，再试一次？",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendPhoto = async (file: File) => {
    const { base64 } = await compressImage(file);
    void base64;

    addMessage(sessionId, {
      id: nanoid(8),
      role: "user",
      content: "[发送了一张照片]",
      timestamp: Date.now(),
    });

    setIsTyping(true);
    try {
      const res = await fetch("/api/diagnosis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: session?.diagnosis?.conversationId,
          message: "用户发送了一张新照片，请根据之前的诊断给出补充建议",
        }),
      });
      const data = await res.json();

      addMessage(sessionId, {
        id: nanoid(8),
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
      });
    } catch {
      addMessage(sessionId, {
        id: nanoid(8),
        role: "assistant",
        content: "照片收到了，不过网络好像不太稳定，再试一次？",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">找不到这次诊断记录</p>
      </div>
    );
  }

  const diagnosis = session.diagnosis;
  const confidence = diagnosis?.confidence ?? 0;
  const severity = confidenceToSeverity(confidence);
  const hasUserMessages = session.messages.filter(m => m.role === "user").length > 0;

  return (
    <div className="chat-container glass-bg">

      {/* ── 顶部 Header ── */}
      <header className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 safe-top shrink-0"
        style={{ background: "var(--forest, #152E1E)" }}>
        <button
          onClick={() => router.push(plantId ? `/plants/${plantId}` : "/")}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ background: "rgba(255,255,255,0.12)", border: "none", WebkitAppearance: "none", cursor: "pointer" }}
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Stethoscope className="w-4 h-4 shrink-0" style={{ color: "#4CAF7A" }} />
          <h1 className="font-bold text-white truncate text-[15px]">
            {plantId && plant ? `${plant.name} · 健康复查` : "植物医生报告"}
          </h1>
        </div>
      </header>

      <div className="chat-messages px-4 py-4 flex flex-col gap-4">

        {/* ── 患者档案卡（有关联植物时显示）── */}
        {plant && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(21,46,30,0.06)", border: "1px solid rgba(21,46,30,0.10)" }}>
            <div className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                style={{ background: "linear-gradient(160deg,#0F2518,#2D5C3E)" }}>
                <img src={plant.imageBase64} alt={plant.name}
                  className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#152E1E] text-[14px] truncate">{plant.name}</p>
                {plant.species && (
                  <p className="text-[11px] text-[#6B7B6B] italic truncate">{plant.species}</p>
                )}
                <div className="flex items-center gap-1 mt-0.5">
                  <CalendarDays className="w-3 h-3 text-[#6B7B6B]" />
                  <span className="text-[10px] text-[#6B7B6B]">
                    {plant.lastDiagnosisAt
                      ? `上次诊断 ${Math.floor((Date.now() - plant.lastDiagnosisAt) / 86400000)} 天前`
                      : "首次诊断"}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <Leaf className="w-4 h-4" style={{ color: "#4CAF7A" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── 用户上传的照片 ── */}
        <div className="self-end max-w-[70%]">
          <img
            src={session.imageBase64}
            alt="植物照片"
            className="rounded-2xl shadow-sm border border-white/40"
          />
        </div>

        {/* ── Loading 分析步骤 ── */}
        {isLoading && (
          <div className="glass-dark p-5 animate-scale-in">
            <p className="text-base font-semibold text-[#1A2E1A] mb-4">正在分析你的植物...</p>
            <div className="space-y-3">
              {[
                { label: "识别植物种类" },
                { label: "检测叶片与健康状态" },
                { label: "生成个性化养护建议" },
              ].map((step, i) => {
                const state = i < loadingStep ? "done" : i === loadingStep ? "active" : "pending";
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`step-dot-${state} shrink-0`} />
                    <span className={`text-sm ${state === "pending" ? "text-gray-400" : "text-[#1A2E1A]"}`}>
                      {step.label}
                    </span>
                    {state === "active" && (
                      <Loader2 className="w-3.5 h-3.5 text-[#2D7D46] animate-spin ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[#6B7B6B]">我正在观察叶片颜色、形态和整体状态</p>
          </div>
        )}

        {/* ── 诊断结果区 ── */}
        {diagnosis && !isLoading && (
          <>
            {/* 健康评分 Hero */}
            <div className="rounded-2xl p-4 text-center"
              style={{ background: "linear-gradient(160deg, #0F2518 0%, #1A3A2A 50%, #2D5C3E 100%)" }}>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">健康评分</p>
              <p className="text-[48px] font-black text-white leading-none">{confidence}</p>
              {/* 严重程度条 */}
              <div className="mt-3 mx-auto overflow-hidden rounded-full"
                style={{ width: 160, height: 6, background: "rgba(255,255,255,0.12)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${confidence}%`, background: severity.color }} />
              </div>
              <p className="mt-2 text-[12px] font-bold" style={{ color: severity.color }}>
                {severity.label}
              </p>
              {diagnosis.plantName && (
                <p className="mt-3 text-[11px] text-white/50 italic">{diagnosis.plantName}</p>
              )}
            </div>

            {/* DiagnosisCard — props 不变 */}
            <div className="-mx-4">
              <DiagnosisCard diagnosis={diagnosis} />
            </div>

            {/* 保存按钮 */}
            {plantId ? (
              <button
                onClick={handleSaveCheckup}
                disabled={saved}
                className="cta-primary-forest w-full flex items-center justify-center gap-2 py-3.5 text-[15px]"
                style={{
                  border: "none",
                  WebkitAppearance: "none",
                  cursor: saved ? "default" : "pointer",
                  opacity: saved ? 0.6 : 1,
                }}
              >
                <Save className="w-4 h-4" />
                {saved ? "已保存 ✓" : "保存复查结果到档案"}
              </button>
            ) : (
              <button
                onClick={() => router.push(`/plants/add?sessionId=${sessionId}`)}
                className="cta-primary-forest w-full flex items-center justify-center gap-2 py-3.5 text-[15px]"
                style={{ border: "none", WebkitAppearance: "none", cursor: "pointer" }}
              >
                保存到我的植物
              </button>
            )}

            {/* Ask-doctor 推荐问题卡（用户尚未发问时显示）*/}
            {!hasUserMessages && diagnosis.nextQuestions && diagnosis.nextQuestions.length > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
                <p className="text-[11px] font-black tracking-widest uppercase text-[#152E1E]/40 mb-3">
                  💬 继续问医生
                </p>
                <div className="flex flex-col gap-2">
                  {diagnosis.nextQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left px-3.5 py-2.5 rounded-xl text-[13px] text-[#152E1E] font-medium press-effect transition-colors"
                      style={{
                        background: "rgba(21,46,30,0.05)",
                        border: "1px solid rgba(21,46,30,0.08)",
                        WebkitAppearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 已追问分隔线 */}
            {hasUserMessages && (
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                <span className="text-[10px] text-[#6B7B6B] whitespace-nowrap">继续追问 ↓</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
              </div>
            )}
          </>
        )}

        {/* ── 对话消息 ── */}
        {session.messages.filter((msg, index) => {
          const isDuplicateOpening =
            index === 0 &&
            msg.role === "assistant" &&
            diagnosis?.greeting &&
            msg.content === diagnosis.greeting;
          return !isDuplicateOpening;
        }).map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {isTyping && (
          <div className="glass-dark px-4 py-3 self-start animate-scale-in">
            <div className="flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D46] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D46] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D46] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        onSendPhoto={handleSendPhoto}
        disabled={isLoading || isTyping}
        placeholder={
          isLoading
            ? loadingMessage
            : "问问浇水、光照、施肥..."
        }
      />
    </div>
  );
}
