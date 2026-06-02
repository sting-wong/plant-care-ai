"use client";

import { Camera, Plus, Leaf, BookText, X } from "lucide-react";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCamera: () => void;
  onAddPlant: () => void;
}

export function ActionSheet({ isOpen, onClose, onCamera, onAddPlant }: ActionSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* 底部弹窗 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up safe-bottom">
        <div className="bg-white rounded-t-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-[#1A2E1A]">快捷操作</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-[#6B7B6B]" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                onCamera();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors press-effect"
            >
              <div className="w-12 h-12 rounded-full bg-[#2D7D46]/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#2D7D46]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1A2E1A]">拍照问诊</p>
                <p className="text-xs text-[#6B7B6B]">AI 帮你诊断植物问题</p>
              </div>
            </button>

            <button
              onClick={() => {
                onAddPlant();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors press-effect"
            >
              <div className="w-12 h-12 rounded-full bg-[#8BC34A]/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#8BC34A]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1A2E1A]">添加植物</p>
                <p className="text-xs text-[#6B7B6B]">记录新植物到档案</p>
              </div>
            </button>

            <button
              onClick={onClose}
              className="w-full mt-3 py-3 text-sm text-[#6B7B6B] hover:bg-gray-50 rounded-xl transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
