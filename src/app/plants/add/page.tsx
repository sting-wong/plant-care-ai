"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, Camera, ImagePlus, Sparkles, Loader2 } from "lucide-react";
import { usePlantStore, LOCATION_LABELS, type PlantLocation } from "@/lib/store";
import { compressImage } from "@/lib/utils";

const COMMON_PLANTS = [
  { name: "龟背竹", species: "Monstera deliciosa", waterDays: 7, fertDays: 30 },
  { name: "绿萝", species: "Epipremnum aureum", waterDays: 5, fertDays: 21 },
  { name: "多肉", species: "Echeveria sp.", waterDays: 12, fertDays: 30 },
  { name: "琴叶榕", species: "Ficus lyrata", waterDays: 7, fertDays: 14 },
  { name: "虎皮兰", species: "Sansevieria", waterDays: 14, fertDays: 30 },
  { name: "吊兰", species: "Chlorophytum comosum", waterDays: 5, fertDays: 21 },
  { name: "发财树", species: "Pachira aquatica", waterDays: 10, fertDays: 30 },
  { name: "仙人掌", species: "Cactaceae", waterDays: 21, fertDays: 45 },
];

// Mock AI 识别（后续替换为真实 API）
async function mockIdentifyPlant(): Promise<(typeof COMMON_PLANTS)[number]> {
  await new Promise((r) => setTimeout(r, 1500));
  return COMMON_PLANTS[Math.floor(Math.random() * COMMON_PLANTS.length)];
}

export default function AddPlantPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center"><div className="skeleton w-32 h-8" /></div>}>
      <AddPlantForm />
    </Suspense>
  );
}

function AddPlantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addPlant = usePlantStore((s) => s.addPlant);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [location, setLocation] = useState<PlantLocation>("living_room");
  const [acquiredAt, setAcquiredAt] = useState("");
  const [wateringDays, setWateringDays] = useState(7);
  const [fertilizingDays, setFertilizingDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);

  // 从 URL 参数自动填充品种名
  useEffect(() => {
    const speciesParam = searchParams.get("species");
    if (speciesParam) {
      setSpecies(speciesParam);
      // 根据品种名设置推荐浇水周期
      const plantInfo = COMMON_PLANTS.find((p) => p.name === speciesParam);
      if (plantInfo) {
        setWateringDays(plantInfo.waterDays);
        setFertilizingDays(plantInfo.fertDays);
      }
    }
  }, [searchParams]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { base64 } = await compressImage(file);
    setImageBase64(base64);

    // 自动 AI 识别
    setIsIdentifying(true);
    try {
      const result = await mockIdentifyPlant();
      if (!species) setSpecies(result.species);
      if (!name) setName(result.name);
      setWateringDays(result.waterDays);
      setFertilizingDays(result.fertDays);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleQuickSelect = (plant: (typeof COMMON_PLANTS)[number]) => {
    setSpecies(plant.species);
    if (!name) setName(plant.name);
    setWateringDays(plant.waterDays);
    setFertilizingDays(plant.fertDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageBase64) return;

    addPlant({
      id: nanoid(10),
      name,
      species,
      imageBase64,
      location,
      acquiredAt: acquiredAt ? new Date(acquiredAt).getTime() : null,
      wateringIntervalDays: wateringDays,
      fertilizingIntervalDays: fertilizingDays,
      lastWateredAt: Date.now(),
      lastFertilizedAt: Date.now(),
      createdAt: Date.now(),
      notes,
    });

    router.push("/plants");
  };

  return (
    <main className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-medium text-gray-900">添加植物</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* 照片 + AI 识别 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            植物照片 *
          </label>
          <div className="flex items-end gap-4">
            {imageBase64 ? (
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer border-2 border-green-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={imageBase64}
                  alt="植物"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-green-300 hover:text-green-500 transition-colors"
              >
                <ImagePlus className="w-6 h-6" />
                <span className="text-[10px]">添加照片</span>
              </button>
            )}
            {isIdentifying && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI 识别中...</span>
              </div>
            )}
            {imageBase64 && !isIdentifying && species && (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <Sparkles className="w-4 h-4" />
                <span>已识别为 {COMMON_PLANTS.find(p => p.species === species)?.name || species}</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* 名称 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            给它起个名字 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="比如：小绿、胖胖、客厅龟背竹"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>

        {/* 品种 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            品种
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COMMON_PLANTS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleQuickSelect(p)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  species === p.species
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-200"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="或手动输入品种名"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>

        {/* 摆放位置 */}
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

        {/* 入手日期 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            入手日期（可选）
          </label>
          <input
            type="date"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300"
          />
        </div>

        {/* 浇水周期 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            浇水周期
            <span className="text-xs text-gray-400 font-normal ml-2">
              AI 已根据品种推荐
            </span>
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

        {/* 施肥周期 */}
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

        {/* 备注 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            备注
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="其他想记录的信息..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300 resize-none"
          />
        </div>

        {/* 提交 */}
        <button
          type="submit"
          disabled={!name || !imageBase64}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl py-3.5 font-medium transition-colors"
        >
          添加植物
        </button>
      </form>
    </main>
  );
}
