"use client";

import { cn } from "@/lib/utils";
import { Leaf, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAI = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isAI ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {/* 头像 */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isAI ? "bg-[#2D7D46]/10 text-[#2D7D46]" : "bg-[#4FC3F7]/10 text-[#4FC3F7]"
        )}
      >
        {isAI ? <Leaf className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* 消息气泡 */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAI
            ? "bg-white text-[#1A2E1A] shadow-[0_2px_12px_rgba(45,125,70,0.06)] border border-green-50"
            : "bg-[#2D7D46] text-white"
        )}
      >
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 self-start max-w-[85%]">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
        <Leaf className="w-4 h-4" />
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
