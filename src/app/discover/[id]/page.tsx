"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { PLANTS_DATA, CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/data/plants-encyclopedia";
import { PlantIllustrationById } from "@/components/plant-illustrations";

const LIGHT_LABELS = { low: "弱光", medium: "散射光", bright: "明亮", direct: "直射" };
const HUMIDITY_LABELS = { low: "低", medium: "中等", high: "高" };

export default function PlantEncyclopediaDetail() {
  const params = useParams();
  const router = useRouter();
  const plant = PLANTS_DATA.find((p) => p.id === params.id);

  if (!plant) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#6B7B6B]">找不到这个植物</p>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-[#FAFDF7]">
      {/* 顶部 */}
      <header className="sticky top-0 z-10 glass border-b border-green-100/30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-50"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A2E1A]" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">{plant.name}</h1>
        <button
          onClick={() => router.push(`/plants/add?species=${encodeURIComponent(plant.name)}`)}
          className="px-3 py-1.5 bg-[#2D7D46] text-white text-xs rounded-lg font-medium"
        >
          添加
        </button>
        <div className="w-8" />
      </header>

      {/* 植物头部 */}
      <div className="text-center py-8 px-5">
        <PlantIllustrationById id={plant.id} className="w-28 h-28" />
        <h2 className="text-xl font-bold text-[#1A2E1A] mt-4">{plant.name}</h2>
        <p className="text-sm text-[#6B7B6B] mt-1">{plant.scientificName}</p>
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {plant.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-green-50 text-[#2D7D46] text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-[#6B7B6B] mt-4 max-w-xs mx-auto">
          {plant.description}
        </p>
      </div>

      {/* 养护概览四宫格 */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-2">
          <div className="card-natural p-3 text-center">
            <Droplets className="w-5 h-5 text-[#4FC3F7] mx-auto mb-1" />
            <p className="text-[10px] text-[#6B7B6B]">浇水</p>
            <p className="text-xs font-medium text-[#1A2E1A] mt-0.5">
              {plant.care.water.frequency}
            </p>
          </div>
          <div className="card-natural p-3 text-center">
            <Sun className="w-5 h-5 text-[#F5A623] mx-auto mb-1" />
            <p className="text-[10px] text-[#6B7B6B]">光照</p>
            <p className="text-xs font-medium text-[#1A2E1A] mt-0.5">
              {LIGHT_LABELS[plant.care.light.level]}
            </p>
          </div>
          <div className="card-natural p-3 text-center">
            <Thermometer className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-[10px] text-[#6B7B6B]">温度</p>
            <p className="text-xs font-medium text-[#1A2E1A] mt-0.5">
              {plant.care.temperature.min}-{plant.care.temperature.max}°C
            </p>
          </div>
          <div className="card-natural p-3 text-center">
            <Wind className="w-5 h-5 text-[#8BC34A] mx-auto mb-1" />
            <p className="text-[10px] text-[#6B7B6B]">湿度</p>
            <p className="text-xs font-medium text-[#1A2E1A] mt-0.5">
              {HUMIDITY_LABELS[plant.care.humidity.level]}
            </p>
          </div>
        </div>
      </div>

      {/* 养护指南 */}
      <div className="px-5 mb-6">
        <h3 className="text-base font-bold text-[#1A2E1A] mb-3">养护指南</h3>
        <div className="space-y-4">
          <CareSection icon="💧" title="浇水" tips={plant.care.water.tips} extra={plant.care.water.season} />
          <CareSection icon="☀️" title="光照" tips={plant.care.light.tips} />
          <CareSection icon="🌡" title="温度" tips={plant.care.temperature.tips} />
          <CareSection icon="💨" title="湿度" tips={plant.care.humidity.tips} />
          <CareSection icon="🌱" title="施肥" tips={`${plant.care.fertilizer.frequency}，${plant.care.fertilizer.type}`} />
          <CareSection icon="🪴" title="土壤" tips={plant.care.soil} />
        </div>
      </div>

      {/* 常见问题 */}
      {plant.commonIssues.length > 0 && (
        <div className="px-5 pb-8">
          <h3 className="text-base font-bold text-[#1A2E1A] mb-3">常见问题</h3>
          <div className="space-y-3">
            {plant.commonIssues.map((issue, i) => (
              <div key={i} className="card-natural p-4">
                <p className="text-sm font-medium text-[#1A2E1A] mb-1">
                  {issue.symptom}
                </p>
                <p className="text-xs text-[#6B7B6B]">
                  <span className="text-[#F5A623]">原因：</span>
                  {issue.cause}
                </p>
                <p className="text-xs text-[#6B7B6B] mt-1">
                  <span className="text-[#2D7D46]">解决：</span>
                  {issue.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function CareSection({
  icon,
  title,
  tips,
  extra,
}: {
  icon: string;
  title: string;
  tips: string;
  extra?: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-lg shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-medium text-[#1A2E1A]">{title}</p>
        <p className="text-xs text-[#6B7B6B] mt-0.5">{tips}</p>
        {extra && (
          <p className="text-xs text-[#6B7B6B] mt-0.5 italic">{extra}</p>
        )}
      </div>
    </div>
  );
}
