"use client";

import { useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";

interface PhotoCaptureProps {
  onCapture: (file: File) => void;
}

export function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      {/* 拍照按钮 */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-3 bg-[#2D7D46] hover:bg-[#246838] active:scale-[0.98] text-white rounded-2xl py-4 px-6 text-base font-medium transition-all shadow-lg shadow-[#2D7D46]/20"
      >
        <Camera className="w-5 h-5" />
        给植物拍张照
      </button>

      {/* 从相册选择 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-green-50/50 active:scale-[0.98] text-[#1A2E1A] rounded-2xl py-3.5 px-6 text-sm font-medium transition-all border border-green-100 shadow-sm"
      >
        <ImagePlus className="w-4 h-4 text-[#6B7B6B]" />
        从相册选择
      </button>

      {/* 隐藏的 input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
