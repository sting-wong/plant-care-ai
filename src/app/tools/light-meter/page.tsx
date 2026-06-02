"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Sun } from "lucide-react";

const LIGHT_LEVELS = [
  { min: 0, max: 100, level: "very_low", label: "极弱光", desc: "阴暗角落", plants: ["绿萝", "虎皮兰"], color: "#6B7B6B" },
  { min: 100, max: 500, level: "low", label: "弱光", desc: "北面窗户", plants: ["绿萝", "吊兰", "文竹", "富贵竹"], color: "#8BC34A" },
  { min: 500, max: 1500, level: "medium", label: "散射光", desc: "东/西面窗户", plants: ["龟背竹", "琴叶榕", "白掌", "铜钱草"], color: "#F5A623" },
  { min: 1500, max: 5000, level: "bright", label: "明亮散射光", desc: "南面窗户（有遮挡）", plants: ["大多数观叶植物", "鹤望兰"], color: "#FF9800" },
  { min: 5000, max: 100000, level: "very_bright", label: "直射阳光", desc: "阳台/户外", plants: ["多肉", "仙人掌", "芦荟"], color: "#F44336" },
];

function getLightLevel(brightness: number) {
  // brightness 0-255 映射到 lux 估算值
  const lux = Math.round((brightness / 255) * 5000);
  const level = LIGHT_LEVELS.find((l) => lux >= l.min && lux < l.max) || LIGHT_LEVELS[LIGHT_LEVELS.length - 1];
  return { lux, ...level };
}

export default function LightMeterPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [error, setError] = useState("");
  const animFrameRef = useRef<number>(0);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch {
      setError("无法访问摄像头，请检查权限设置");
    }
  };

  const analyzeBrightness = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 64;
    canvas.height = 64;
    ctx.drawImage(video, 0, 0, 64, 64);

    const imageData = ctx.getImageData(0, 0, 64, 64);
    const data = imageData.data;
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
      // 计算感知亮度
      totalBrightness += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    }

    const avgBrightness = totalBrightness / (64 * 64);
    setBrightness(avgBrightness);

    animFrameRef.current = requestAnimationFrame(analyzeBrightness);
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      animFrameRef.current = requestAnimationFrame(analyzeBrightness);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, analyzeBrightness]);

  useEffect(() => {
    return () => {
      // 清理摄像头
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const lightInfo = getLightLevel(brightness);
  const barPosition = Math.min(100, (lightInfo.lux / 5000) * 100);

  return (
    <main className="min-h-dvh bg-[#FAFDF7]">
      <header className="sticky top-0 z-10 glass border-b border-green-100/30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-50"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A2E1A]" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">光照检测</h1>
      </header>

      <div className="px-5 py-6">
        {/* 摄像头预览 */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-6">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A2E1A]/80">
              <button
                onClick={startCamera}
                className="w-16 h-16 rounded-full bg-[#2D7D46] text-white flex items-center justify-center mb-3 active:scale-95 transition-transform"
              >
                <Camera className="w-7 h-7" />
              </button>
              <p className="text-white/80 text-sm">点击开始检测光照</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* 光照数值 */}
        {isActive && (
          <>
            <div className="card-natural p-6 text-center mb-6">
              <Sun className="w-8 h-8 mx-auto mb-2" style={{ color: lightInfo.color }} />
              <p className="text-3xl font-bold text-[#1A2E1A]">
                {lightInfo.lux} <span className="text-base font-normal text-[#6B7B6B]">lux</span>
              </p>
              <p className="text-base font-medium mt-1" style={{ color: lightInfo.color }}>
                {lightInfo.label}
              </p>
              <p className="text-xs text-[#6B7B6B] mt-1">{lightInfo.desc}</p>
            </div>

            {/* 光照等级条 */}
            <div className="mb-6">
              <div className="relative h-3 bg-gradient-to-r from-gray-300 via-yellow-300 to-orange-500 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 w-3 h-3 bg-white border-2 border-[#1A2E1A] rounded-full -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${barPosition}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-[#6B7B6B]">
                <span>暗</span>
                <span>低</span>
                <span>中</span>
                <span>亮</span>
                <span>强</span>
              </div>
            </div>

            {/* 适合的植物 */}
            <div className="card-natural p-4">
              <p className="text-sm font-medium text-[#1A2E1A] mb-2">
                适合摆放的植物
              </p>
              <div className="flex flex-wrap gap-2">
                {lightInfo.plants.map((plant) => (
                  <span
                    key={plant}
                    className="px-2.5 py-1 bg-green-50 text-[#2D7D46] text-xs rounded-full"
                  >
                    {plant}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#6B7B6B] mt-3">
                💡 建议：将手机放在你想摆放植物的位置，保持几秒钟获取稳定读数。
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
