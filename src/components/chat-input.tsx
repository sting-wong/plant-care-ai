"use client";

import { useState, useRef } from "react";
import { Send, Camera } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSendPhoto?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onSendPhoto,
  disabled = false,
  placeholder = "问问关于你的植物...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendPhoto) {
      onSendPhoto(file);
    }
    // 重置 input 以便再次选择同一文件
    e.target.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="chat-input-bar flex items-center gap-2 p-4 bg-white border-t border-gray-100 safe-bottom"
    >
      {/* 追加照片按钮 */}
      {onSendPhoto && (
        <>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={disabled}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-30 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-300 border border-transparent transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white disabled:opacity-30 disabled:bg-gray-300 transition-all hover:bg-green-700 active:scale-95"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
