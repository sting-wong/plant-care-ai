"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Droplets, Sparkles, Search, MapPin } from "lucide-react";
import { EmptyPlantIllustration } from "@/components/illustrations";
import { usePlantStore, LOCATION_LABELS, type MyPlant } from "@/lib/store";
import { getDaysUntilWatering } from "@/lib/care-tasks";

function HealthBadge({ daysUntil }: { daysUntil: number }) {
  if (daysUntil < 0) return <span className="status-pill-urgent">需要浇水</span>;
  if (daysUntil === 0) return <span className="status-pill-watch">今天浇水</span>;
  if (daysUntil <= 2) return <span className="status-pill-watch">{daysUntil}天后浇水</span>;
  return <span className="status-pill-healthy">状态良好</span>;
}

function PlantCard({ plant }: { plant: MyPlant }) {
  const daysUntilWater = getDaysUntilWatering(plant);
  const { waterPlant, fertilizePlant } = usePlantStore();
  const isOverdue = daysUntilWater <= 0;

  return (
    <div className="glass-dark overflow-hidden press-effect">
      <Link href={`/plants/${plant.id}`} className="flex gap-3 p-4">
        <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ${isOverdue ? "ring-blue-300" : "ring-white/60"}`}>
          <img src={plant.imageBase64} alt={plant.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[#1A2E1A] truncate">{plant.name}</h3>
            <HealthBadge daysUntil={daysUntilWater} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-[#6B7B6B] truncate">{plant.species}</p>
            {plant.location && (
              <span className="text-xs text-[#6B7B6B] flex items-center gap-0.5 shrink-0">
                <MapPin className="w-2.5 h-2.5" />
                {LOCATION_LABELS[plant.location]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-blue-600 font-medium" : "text-[#6B7B6B]"}`}>
              <Droplets className="w-3 h-3" />
              {isOverdue
                ? daysUntilWater === 0 ? "今天该浇水" : `已超期 ${Math.abs(daysUntilWater)} 天`
                : `${daysUntilWater}天后浇水`}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex border-t border-white/30">
        <button
          aria-label={`给${plant.name}浇水`}
          onClick={() => waterPlant(plant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-blue-500 hover:bg-blue-50/40 active:bg-blue-100/40 transition-colors"
        >
          <Droplets className="w-3.5 h-3.5" />
          已浇水
        </button>
        <div className="w-px bg-white/30" />
        <button
          aria-label={`给${plant.name}施肥`}
          onClick={() => fertilizePlant(plant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-amber-500 hover:bg-amber-50/40 active:bg-amber-100/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          已施肥
        </button>
      </div>
    </div>
  );
}

export default function PlantsPage() {
  const { plants } = usePlantStore();
  const [search, setSearch] = useState("");

  const plantList = Object.values(plants)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.species ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => getDaysUntilWatering(a) - getDaysUntilWatering(b));

  const plantCount = Object.keys(plants).length;

  return (
    <main className="glass-bg min-h-dvh px-4 pt-6 pb-28 page-slide-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#1A2E1A]">我的植物</h1>
          {plantCount > 0 && (
            <p className="text-xs text-[#6B7B6B] mt-0.5">共 {plantCount} 棵</p>
          )}
        </div>
        <Link
          href="/plants/add"
          aria-label="添加植物"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2D7D46] text-white shadow-lg shadow-green-700/20 hover:bg-[#246838] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </Link>
      </div>

      {plantCount > 3 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索植物名称或品种"
            className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D7D46]/20 focus:border-[#2D7D46]/30 placeholder:text-[#6B7B6B]/60"
          />
        </div>
      )}

      {plantList.length === 0 && !search ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
          <EmptyPlantIllustration className="w-32 h-32 mb-4 animate-float" />
          <p className="text-base font-semibold text-[#1A2E1A] mb-1">还没有添加植物</p>
          <p className="text-xs text-[#6B7B6B] mb-6 max-w-[220px] leading-relaxed">
            拍照让 AI 识别品种，或手动添加，它会帮你记录浇水和养护周期。
          </p>
          <div className="flex gap-3 w-full max-w-[260px]">
            <Link
              href="/scan"
              className="flex-1 bg-[#2D7D46] text-white text-sm font-medium rounded-2xl py-3 text-center shadow-lg shadow-green-700/20"
            >
              拍照识别
            </Link>
            <Link
              href="/plants/add"
              className="flex-1 glass-card text-sm font-medium text-[#1A2E1A] rounded-2xl py-3 text-center"
            >
              手动添加
            </Link>
          </div>
        </div>
      ) : plantList.length === 0 && search ? (
        <div className="text-center py-12">
          <p className="text-sm text-[#6B7B6B]">没有找到匹配的植物</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plantList.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </main>
  );
}
