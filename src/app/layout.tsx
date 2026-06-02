import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { RemindChecker } from "@/components/remind-checker";
import { BackgroundPattern } from "@/components/background-pattern";
import "./globals.css";

export const metadata: Metadata = {
  title: "植物管家 - 你的私人植物 AI 助手",
  description: "拍照问诊、智能提醒、成长记录，让每一棵植物都被好好照顾",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "植物管家",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2D7D46",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-dvh bg-[#FAFDF7] text-[#1A2E1A] antialiased">
        <BackgroundPattern />
        <RemindChecker />
        <div className="relative z-10 pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
