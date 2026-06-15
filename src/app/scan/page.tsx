"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, ImagePlus, Camera } from "lucide-react";
import { usePlantStore } from "@/lib/store";
import { compressImage } from "@/lib/utils";

export default function ScanPage() {
  const router = useRouter();
  const { createSession } = usePlantStore();

  const handleCapture = async (file: File) => {
    const { base64 } = await compressImage(file);
    const sessionId = nanoid(10);
    createSession(sessionId, base64);
    router.push(`/diagnosis/${sessionId}`);
  };

  const openCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment" as never;
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) await handleCapture(file);
    };
    input.click();
  };

  const openAlbum = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) await handleCapture(file);
    };
    input.click();
  };

  return (
    <main className="glass-bg min-h-dvh flex flex-col">
      {/* 顶部导航 */}
      <header className="glass-panel border-b border-white/30 px-4 py-3 flex items-center gap-3 safe-top shrink-0">
        <button
          aria-label="返回"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A2E1A]" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">拍照诊断</h1>
      </header>

      {/* 主体 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        {/* 说明文字 */}
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-[#152E1E]">拍下植物照片</p>
          <p className="text-sm text-[#6B7B6B]">AI 帮你看健康状态，给出养护建议</p>
        </div>

        {/* 拍照主按钮 */}
        <button
          aria-label="拍照"
          onClick={openCamera}
          className="w-36 h-36 rounded-full bg-[#2D7D46] flex flex-col items-center justify-center gap-2 shadow-xl shadow-green-700/30 press-effect"
        >
          <Camera className="w-10 h-10 text-white" />
          <span className="text-white text-sm font-medium">拍照</span>
        </button>

        {/* 次级：从相册选 */}
        <button
          aria-label="从相册选择"
          onClick={openAlbum}
          className="glass-dark flex items-center gap-2 px-6 py-3 rounded-2xl press-effect"
        >
          <ImagePlus className="w-5 h-5 text-[#2D7D46]" />
          <span className="text-sm font-medium text-[#1A2E1A]">从相册选取</span>
        </button>

        <p className="text-xs text-[#6B7B6B]/70 text-center px-4">
          拍摄时确保光线充足，尽量包含叶片和茎部
        </p>
      </div>
    </main>
  );
}
