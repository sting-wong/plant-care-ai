"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft } from "lucide-react";
import { usePlantStore } from "@/lib/store";
import { ChatMessage, TypingIndicator } from "@/components/chat-message";
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

export default function DiagnosisPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const session = usePlantStore((s) => s.sessions[sessionId]);
  const setDiagnosis = usePlantStore((s) => s.setDiagnosis);
  const addMessage = usePlantStore((s) => s.addMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasDiagnosed = useRef(false);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isTyping]);

  // 首次加载时自动发起诊断
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

  // 发送追问
  const handleSend = async (message: string) => {
    addMessage(sessionId, {
      id: nanoid(8),
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    setIsTyping(true);
    try {
      // 构建历史上下文传给后端
      // history 必须以 user 开头，交替排列
      const currentSession = usePlantStore.getState().sessions[sessionId];
      const history = [
        // 第一条固定为用户上传图片的动作
        { role: "user", content: "请帮我看看这棵植物" },
        // 第二条为 AI 首次诊断回复
        ...(currentSession?.diagnosis?.greeting
          ? [{ role: "assistant", content: currentSession.diagnosis.greeting }]
          : []),
        // 后续对话历史
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

  // 在对话中追加照片
  const handleSendPhoto = async (file: File) => {
    const { base64 } = await compressImage(file);

    // 显示用户发送的图片作为消息
    addMessage(sessionId, {
      id: nanoid(8),
      role: "user",
      content: "[发送了一张照片]",
      timestamp: Date.now(),
    });

    setIsTyping(true);
    try {
      // Mock: 对追加照片给出回复
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

  return (
    <div className="chat-container bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3 safe-top shrink-0">
        <button
          onClick={() => router.push("/")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-medium text-gray-900">
          {session.diagnosis?.plantName || "正在分析..."}
        </h1>
      </header>

      {/* 消息区域 */}
      <div className="chat-messages px-4 py-4 flex flex-col gap-4">
        {/* 用户上传的图片 */}
        <div className="self-end max-w-[70%]">
          <img
            src={session.imageBase64}
            alt="植物照片"
            className="rounded-2xl shadow-sm border border-gray-100"
          />
        </div>

        {/* 加载状态 */}
        {isLoading && <TypingIndicator />}

        {/* 诊断卡片 */}
        {session.diagnosis && !isLoading && (
          <div className="-mx-4">
            <DiagnosisCard diagnosis={session.diagnosis} />
          </div>
        )}

        {/* 快捷追问按钮 — 仅在首次诊断后、还没有追问时展示 */}
        {session.diagnosis && !isLoading && session.messages.filter(m => m.role === "user").length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {(session.diagnosis.nextQuestions?.length ? session.diagnosis.nextQuestions : []).map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3.5 py-2 bg-white border border-green-100 rounded-full text-xs text-[#2D7D46] hover:bg-green-50 transition-colors press-effect shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 对话分隔线 — 已有追问时显示 */}
        {session.diagnosis && !isLoading && session.messages.filter(m => m.role === "user").length > 0 && (
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
            <span className="text-[10px] text-[#6B7B6B] whitespace-nowrap">继续追问 ↓</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
          </div>
        )}

        {/* 对话消息 */}
        {session.messages.filter((msg, index) => {
          const isDuplicateOpening =
            index === 0 &&
            msg.role === "assistant" &&
            session.diagnosis?.greeting &&
            msg.content === session.diagnosis.greeting;
          return !isDuplicateOpening;
        }).map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {/* 追问时的打字指示器 */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
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
