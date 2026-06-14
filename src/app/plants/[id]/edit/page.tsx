"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { usePlantStore, LOCATION_LABELS, type PlantLocation } from "@/lib/store";

export default function EditPlantPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.id as string;

  const { plants, updatePlant } = usePlantStore();
  const plant = plants[plantId];

  const [name, setName] = useState(plant?.name || "");
  const [species, setSpecies] = useState(plant?.species || "");
  const [location, setLocation] = useState<PlantLocation>(
    plant?.location || "living_room"
  );
  const [wateringDays, setWateringDays] = useState(
    plant?.wateringIntervalDays || 7
  );
  const [fertilizingDays, setFertilizingDays] = useState(
    plant?.fertilizingIntervalDays || 30
  );
  const [notes, setNotes] = useState(plant?.notes || "");

  if (!plant) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">找不到这棵植物</p>
      </div>
    );
  }

  const handleSave = () => {
    updatePlant(plantId, {
      name,
      species,
      location,
      wateringIntervalDays: wateringDays,
      fertilizingIntervalDays: fertilizingDays,
      notes,
    });
    router.back();
  };

  return (
    <main className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-medium text-gray-900">编辑植物</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          保存
        </button>
      </header>

      <div className="px-4 py-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            品种
          </label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            摆放位置
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(LOCATION_LABELS) as [PlantLocation, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLocation(key)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    location === key
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-200"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            浇水周期
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">每</span>
            <input
              type="number"
              min={1}
              max={60}
              value={wateringDays}
              onChange={(e) => setWateringDays(Number(e.target.value))}
              className="w-16 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
            />
            <span className="text-sm text-gray-500">天浇一次水</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            施肥周期
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">每</span>
            <input
              type="number"
              min={1}
              max={120}
              value={fertilizingDays}
              onChange={(e) => setFertilizingDays(Number(e.target.value))}
              className="w-16 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
            />
            <span className="text-sm text-gray-500">天施一次肥</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            备注
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="放在哪里、什么时候买的..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300 resize-none"
          />
        </div>
      </div>
    </main>
  );
}
