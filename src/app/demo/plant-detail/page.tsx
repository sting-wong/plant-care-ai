"use client";

import { PlantDetailView } from "@/components/plant-detail-view";
import type { MyPlant, GrowthRecord } from "@/lib/store";

const NOW = 1781222400000; // 2026-06-12 fixed timestamp — avoids hydration mismatch

const DEMO_PLANT: MyPlant = {
  id: "demo",
  name: "小绿（龟背竹）",
  species: "Monstera deliciosa",
  imageBase64:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNDOEU2QzkiLz48ZWxsaXBzZSBjeD0iMjAwIiBjeT0iMTkwIiByeD0iMTAwIiByeT0iMTEwIiBmaWxsPSIjMkQ3RDQ2IiBvcGFjaXR5PSIwLjgiLz48ZWxsaXBzZSBjeD0iMTQwIiBjeT0iMTYwIiByeD0iNzAiIHJ5PSI4MCIgZmlsbD0iIzJEOEQ0NiIgb3BhY2l0eT0iMC42IiB0cmFuc2Zvcm09InJvdGF0ZSgtMjUgMTQwIDE2MCkiLz48ZWxsaXBzZSBjeD0iMjYwIiBjeT0iMTUwIiByeD0iNzAiIHJ5PSI4MCIgZmlsbD0iIzFBNkQzNiIgb3BhY2l0eT0iMC43IiB0cmFuc2Zvcm09InJvdGF0ZSgyMCAyNjAgMTUwKSIvPjxyZWN0IHg9IjE4NSIgeT0iMjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iOTAiIHJ4PSIxMCIgZmlsbD0iIzVENDAzNyIvPjxlbGxpcHNlIGN4PSIyMDAiIGN5PSIzNzAiIHJ4PSI0MCIgcnk9IjEwIiBmaWxsPSIjNUQ0MDM3IiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=",
  location: "living_room",
  acquiredAt: NOW - 60 * 86400000,
  wateringIntervalDays: 7,
  fertilizingIntervalDays: 30,
  lastWateredAt: NOW - 9 * 86400000,   // 浇水超期 2 天
  lastFertilizedAt: NOW - 16 * 86400000, // 距下次施肥还有 14 天
  createdAt: NOW - 60 * 86400000,
  notes:
    "叶片宽大有光泽，喜散射光，避免直射。每次浇水前插手指到土里感受湿度。生长季每月施一次薄肥，冬季减少浇水。",
  health: "watch",
  lastDiagnosisAt: NOW - 3 * 86400000,
  lastDiagnosisSummary: "叶片轻微黄化，建议调整浇水频率",
};

const DEMO_RECORDS: GrowthRecord[] = [
  {
    id: "rec1",
    plantId: "demo",
    imageBase64:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0UyRjBFOCIvPjxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxNDAiIHJ4PSI5MCIgcnk9IjEwMCIgZmlsbD0iIzJENzQ0NiIgb3BhY2l0eT0iMC43Ii8+PHJlY3QgeD0iMTg4IiB5PSIyMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2MCIgcng9IjgiIGZpbGw9IiM1RDQwMzciLz48L3N2Zz4=",
    note: "新叶展开了，颜色很鲜绿",
    createdAt: NOW - 15 * 86400000,
  },
  {
    id: "rec2",
    plantId: "demo",
    imageBase64:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Q0RTNEOCIvPjxlbGxpcHNlIGN4PSIxODAiIGN5PSIxMzAiIHJ4PSI4MCIgcnk9IjkwIiBmaWxsPSIjMUE2RDM2IiBvcGFjaXR5PSIwLjgiLz48ZWxsaXBzZSBjeD0iMjQwIiBjeT0iMTUwIiByeD0iNjAiIHJ5PSI3MCIgZmlsbD0iIzJENzQ0NiIgb3BhY2l0eT0iMC43Ii8+PHJlY3QgeD0iMTg4IiB5PSIyMTAiIHdpZHRoPSIyNCIgaGVpZ2h0PSI3MCIgcng9IjgiIGZpbGw9IiM1RDQwMzciLz48L3N2Zz4=",
    note: "浇水后状态很好",
    createdAt: NOW - 30 * 86400000,
  },
];

export default function DemoPlantDetailPage() {
  return (
    <PlantDetailView
      plant={DEMO_PLANT}
      records={DEMO_RECORDS}
      onBack={() => {}}
      onWater={() => {}}
      onAddRecord={() => {}}
      onDeleteRecord={() => {}}
      onDelete={() => {}}
      readonly
    />
  );
}
