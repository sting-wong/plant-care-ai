"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlantStore } from "@/lib/store";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hours}:${minutes}`;
}

export default function HistoryPage() {
  const router = useRouter();
  const sessions = usePlantStore((s) => s.sessions);

  const sessionList = Object.values(sessions)
    .filter((s) => s.diagnosis)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-medium text-gray-900">诊断历史</h1>
      </header>

      <div className="px-4 py-4">
        {sessionList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-500 mb-1">暂无诊断记录</p>
            <p className="text-sm text-gray-400">
              去首页拍张照片，开始第一次问诊
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessionList.map((session) => (
              <Link
                key={session.id}
                href={`/diagnosis/${session.id}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 hover:border-green-200 transition-colors press-effect"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
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
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(session.createdAt)} · {session.messages.length} 条对话
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
