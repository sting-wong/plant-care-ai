"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PlantIllustrationById } from "@/components/plant-illustrations";
import {
  PLANTS_DATA,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/data/plants-encyclopedia";

const CATEGORIES = [
  { key: "all", label: "全部" },
  { key: "foliage", label: "观叶" },
  { key: "succulent", label: "多肉" },
  { key: "flowering", label: "开花" },
  { key: "vine", label: "藤蔓" },
];

const DIFFICULTY_COLORS = {
  easy: "text-green-600 bg-green-50",
  medium: "text-amber-600 bg-amber-50",
  hard: "text-red-600 bg-red-50",
};

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = PLANTS_DATA.filter((plant) => {
    const matchSearch =
      !search ||
      plant.name.includes(search) ||
      plant.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      plant.tags.some((t) => t.includes(search));
    const matchCategory =
      category === "all" || plant.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-dvh px-5 pt-6 pb-4 page-slide-in">
      {/* 标题 */}
      <h1 className="text-xl font-bold text-[#1A2E1A] mb-4">发现</h1>

      {/* 搜索框 */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B6B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索植物名称、标签..."
          className="w-full bg-white border border-green-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D7D46]/20 focus:border-[#2D7D46]/30 shadow-sm"
        />
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar -mx-5 px-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat.key
                ? "bg-[#2D7D46] text-white"
                : "bg-white text-[#6B7B6B] border border-green-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 植物网格 */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((plant) => (
          <Link
            key={plant.id}
            href={`/discover/${plant.id}`}
            className="card-natural p-4 flex flex-col items-center text-center press-effect stagger-item"
          >
            <PlantIllustrationById id={plant.id} className="w-14 h-14 mb-2" />
            <h3 className="text-sm font-medium text-[#1A2E1A]">
              {plant.name}
            </h3>
            <p className="text-[10px] text-[#6B7B6B] mt-0.5">
              {plant.scientificName}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  DIFFICULTY_COLORS[plant.difficulty]
                }`}
              >
                {DIFFICULTY_LABELS[plant.difficulty]}
              </span>
              <span className="text-[10px] text-[#6B7B6B]">
                {CATEGORY_LABELS[plant.category]}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6B7B6B]">没有找到匹配的植物</p>
        </div>
      )}
    </main>
  );
}
