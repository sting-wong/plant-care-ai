"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Droplets, Sparkles, Search, MapPin } from "lucide-react";
import { EmptyPlantIllustration } from "@/components/illustrations";
import { usePlantStore, LOCATION_LABELS, type MyPlant } from "@/lib/store";

function getDaysUntilWatering(plant: MyPlant): number {
  const daysSinceWatered = Math.floor(
    (Date.now() - plant.lastWateredAt) / (1000 * 60 * 60 * 24)
  );
  return plant.wateringIntervalDays - daysSinceWatered;
}

function PlantCard({ plant }: { plant: MyPlant }) {
  const daysUntilWater = getDaysUntilWatering(plant);
  const waterPlant = usePlantStore((s) => s.waterPlant);
  const fertilizePlant = usePlantStore((s) => s.fertilizePlant);
  const isOverdue = daysUntilWater <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden press-effect">
      <Link href={`/plants/${plant.id}`} className="flex gap-3 p-3">
        {/* 圆形植物头像 */}
        <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ${isOverdue ? "ring-blue-300" : "ring-green-100"}`}>
          <img
            src={plant.imageBase64}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{plant.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400">{plant.species}</p>
            {plant.location && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                {LOCATION_LABELS[plant.location]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span
              className={`text-xs flex items-center gap-1 ${
                isOverdue
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              <Droplets className="w-3 h-3" />
              {isOverdue
                ? daysUntilWater === 0
                  ? "今天该浇水"
                  : `已超期 ${Math.abs(daysUntilWater)} 天`
                : `${daysUntilWater}天后浇水`}
            </span>
          </div>
        </div>
      </Link>

      {/* 快捷操作 */}
      <div className="flex border-t border-gray-50">
        <button
          onClick={() => waterPlant(plant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
        >
          <Droplets className="w-3.5 h-3.5" />
          已浇水
        </button>
        <div className="w-px bg-gray-50" />
        <button
          onClick={() => fertilizePlant(plant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-amber-600 hover:bg-amber-50 active:bg-amber-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          已施肥
        </button>
      </div>
    </div>
  );
}

export default function PlantsPage() {
  const plants = usePlantStore((s) => s.plants);
  const [search, setSearch] = useState("");

  // 按浇水紧急度排序（最需要浇水的排前面）
  const plantList = Object.values(plants)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.species.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => getDaysUntilWatering(a) - getDaysUntilWatering(b));

  const plantCount = Object.keys(plants).length;

  return (
    <main className="min-h-dvh px-4 pt-6 page-slide-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">我的植物</h1>
          {plantCount > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">共 {plantCount} 棵</p>
          )}
        </div>
        <Link
          href="/plants/add"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white shadow-sm hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </Link>
      </div>

      {/* 搜索框（植物数量 > 3 时显示） */}
      {plantCount > 3 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索植物名称或品种"
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>
      )}

      {/* 植物列表 */}
      {plantList.length === 0 && !search ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <EmptyPlantIllustration className="w-36 h-36 mb-2 animate-float" />
          <p className="text-sm font-medium text-[#1A2E1A] mb-1">还没有添加植物</p>
          <p className="text-xs text-[#6B7B6B] mb-6">
            添加你的第一棵植物，开始记录它的成长
          </p>
          <Link
            href="/plants/add"
            className="px-5 py-2.5 btn-primary text-sm"
          >
            添加植物
          </Link>
        </div>
      ) : plantList.length === 0 && search ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400">没有找到匹配的植物</p>
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
