"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, ImagePlus, Camera } from "lucide-react";
import { usePlantStore } from "@/lib/store";
import { compressImage } from "@/lib/utils";

function ScanCorners() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 256 256"
      fill="none"
    >
      {/* 左上 */}
      <path d="M20 56 L20 20 L56 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* 右上 */}
      <path d="M200 20 L236 20 L236 56" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* 左下 */}
      <path d="M20 200 L20 236 L56 236" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* 右下 */}
      <path d="M200 236 L236 236 L236 200" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

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
    <main className="relative h-dvh overflow-hidden bg-[#1a2a1a]">
      {/* 背景植物图 */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop')",
          filter: "blur(2px) brightness(0.55)",
        }}
      />

      {/* 顶部导航 */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-safe pt-4 pb-2">
        <button
          aria-label="关闭"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white font-semibold text-base tracking-wide">Scan Your Plant</span>
        <div className="w-10" />
      </header>

      {/* 扫描框 */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ marginTop: "8vh" }}>
        <div className="relative w-64 h-64">
          <ScanCorners />
          <div className="scan-line" />
        </div>
        <p className="mt-6 text-white/65 text-xs tracking-wide">将植物置于框内，自动识别</p>
      </div>

      {/* 底部操作面板 */}
      <div className="glass-panel absolute bottom-0 left-0 right-0 safe-bottom px-8 pt-7 pb-10">
        <div className="flex items-center justify-around">
          {/* 相册 */}
          <button
            aria-label="从相册选择"
            onClick={openAlbum}
            className="btn-circle glass-dark"
          >
            <ImagePlus className="w-6 h-6 text-[#2D7D46]" />
          </button>

          {/* 拍照主按钮 */}
          <button
            aria-label="拍照"
            onClick={openCamera}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-black/20 press-effect"
          >
            <Camera className="w-8 h-8 text-[#2D7D46]" />
          </button>

          {/* 占位（保持对称） */}
          <div className="w-16 h-16" />
        </div>
      </div>
    </main>
  );
}
