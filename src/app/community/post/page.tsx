"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Camera, Image as ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/utils";

const PLANT_TAGS = [
  "龟背竹", "绿萝", "多肉", "琴叶榕", "虎皮兰",
  "吊兰", "发财树", "仙人掌", "芦荟", "文竹",
];

const TOPIC_TAGS = ["晒植物", "新手求助", "养护心得", "入坑记录"];

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [plantTag, setPlantTag] = useState("");
  const [topic, setTopic] = useState("");

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { base64 } = await compressImage(file);
    setImages([...images, base64]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!content.trim()) return;
    // Mock: 实际应该发送到后端
    alert("发布成功！（Mock 模式，数据未持久化）");
    router.push("/community");
  };

  return (
    <main className="min-h-dvh bg-[#FAFDF7] flex flex-col">
      {/* 顶部 */}
      <header className="sticky top-0 z-10 glass border-b border-green-100/30 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => router.back()}
          className="text-sm text-[#6B7B6B]"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">发布帖子</h1>
        <button
          onClick={handlePublish}
          disabled={!content.trim()}
          className="px-4 py-1.5 bg-[#2D7D46] text-white rounded-lg text-sm font-medium disabled:opacity-30 transition-opacity"
        >
          发布
        </button>
      </header>

      <div className="flex-1 px-5 py-4 space-y-5">
        {/* 文字输入 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的植物故事、养护心得、或者提个问题..."
          rows={6}
          className="w-full bg-transparent text-sm text-[#1A2E1A] placeholder-[#6B7B6B]/50 outline-none resize-none leading-relaxed"
          autoFocus
        />

        {/* 已选图片 */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 添加图片 */}
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-green-100 rounded-xl text-xs text-[#6B7B6B]"
          >
            <Camera className="w-4 h-4" />
            拍照
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-green-100 rounded-xl text-xs text-[#6B7B6B]"
          >
            <ImageIcon className="w-4 h-4" />
            相册
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* 关联植物 */}
        <div>
          <p className="text-xs font-medium text-[#1A2E1A] mb-2">关联植物</p>
          <div className="flex flex-wrap gap-2">
            {PLANT_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setPlantTag(plantTag === tag ? "" : tag)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  plantTag === tag
                    ? "bg-[#2D7D46] text-white"
                    : "bg-white border border-green-100 text-[#6B7B6B]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 话题 */}
        <div>
          <p className="text-xs font-medium text-[#1A2E1A] mb-2">话题</p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(topic === t ? "" : t)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  topic === t
                    ? "bg-[#2D7D46] text-white"
                    : "bg-white border border-green-100 text-[#6B7B6B]"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
