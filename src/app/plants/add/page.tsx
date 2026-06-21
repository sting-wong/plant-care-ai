"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { ArrowLeft, Camera, ImagePlus, Sparkles, Loader2 } from "lucide-react";
import { usePlantStore, LOCATION_LABELS, type PlantLocation } from "@/lib/store";
import { compressImage } from "@/lib/utils";

const COMMON_PLANTS = [
  { name: "热带观叶", species: "Tropical Foliage", waterDays: 7, fertDays: 30 },
  { name: "花叶观赏", species: "Ornamental Foliage", waterDays: 5, fertDays: 21 },
  { name: "多肉/仙人掌", species: "Succulent & Cactus", waterDays: 14, fertDays: 45 },
  { name: "蕨类", species: "Fern", waterDays: 3, fertDays: 21 },
  { name: "兰科", species: "Orchidaceae", waterDays: 7, fertDays: 14 },
  { name: "块根/球根", species: "Geophyte", waterDays: 10, fertDays: 30 },
  { name: "大型绿植", species: "Large Foliage Plant", waterDays: 7, fertDays: 21 },
];

async function mockIdentifyPlant(): Promise<(typeof COMMON_PLANTS)[number]> {
  await new Promise((r) => setTimeout(r, 1500));
  return COMMON_PLANTS[Math.floor(Math.random() * COMMON_PLANTS.length)];
}

export default function AddPlantPage() {
  return (
    <Suspense fallback={<div className="glass-bg min-h-dvh flex items-center justify-center"><Loader2 className="w-6 h-6 text-[#2D7D46] animate-spin" /></div>}>
      <AddPlantForm />
    </Suspense>
  );
}

function AddPlantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addPlant, sessions } = usePlantStore();

  // Carry over diagnosis result when navigating from /diagnosis?sessionId=
  const diagSessionId = searchParams.get("sessionId");
  const diagSession = diagSessionId ? sessions[diagSessionId] : null;
  const diagConfidence = diagSession?.diagnosis?.confidence ?? null;
  const initialHealth: "healthy" | "watch" | "urgent" =
    diagSession?.diagnosis?.healthStatus === "healthy" ? "healthy"
    : diagSession?.diagnosis?.healthStatus === "critical" ? "urgent"
    : diagSession?.diagnosis?.healthStatus === "needs_attention" ? "watch"
    : diagConfidence === null ? "healthy"
    : diagConfidence >= 0.8 ? "healthy"
    : diagConfidence >= 0.5 ? "watch"
    : "urgent";
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const speciesParam = searchParams.get("species");
    if (speciesParam) {
      setSpecies(speciesParam);
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
      health: initialHealth,
      lastDiagnosisAt: diagSession?.diagnosis ? Date.now() : null,
      lastDiagnosisSummary: diagSession?.diagnosis?.greeting?.slice(0, 60) || "",
    });
    router.push("/plants");
  };

  const inputClass = "w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D7D46]/20 focus:border-[#2D7D46]/40 placeholder:text-[#6B7B6B]/60 text-[#1A2E1A]";

  return (
    <main className="glass-bg min-h-dvh">
      <header className="sticky top-0 z-10 glass-panel border-b border-white/30 px-4 py-3 flex items-center gap-3">
        <button
          aria-label="返回"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A2E1A]" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">添加植物</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5 pb-10">
        {/* 照片上传 */}
        <div className="flex flex-col items-center gap-3 pt-2">
          {imageBase64 ? (
            <button
              type="button"
              aria-label="更换植物照片"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/60 shadow-lg"
            >
              <img src={imageBase64} alt="植物" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="glass-dark w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1.5 text-[#2D7D46]"
              aria-label="添加植物照片"
            >
              <ImagePlus className="w-7 h-7" />
              <span className="text-[10px] font-medium">添加照片</span>
            </button>
          )}
          {isIdentifying && (
            <div className="flex items-center gap-2 text-sm text-[#2D7D46]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI 识别中...</span>
            </div>
          )}
          {imageBase64 && !isIdentifying && species && (
            <div className="flex items-center gap-1.5 text-sm text-[#2D7D46]">
              <Sparkles className="w-4 h-4" />
              <span>已识别为 {COMMON_PLANTS.find((p) => p.species === species)?.name || species}</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* 核心字段 */}
        <div className="glass-card px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6B7B6B] mb-1.5 block">给它起个名字 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="比如：小绿、胖胖、客厅龟背竹"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7B6B] mb-1.5 block">品种</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_PLANTS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleQuickSelect(p)}
                  className={`chip ${species === p.species ? "chip-active" : ""}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="选择品类后可填写具体品种，如花烛、白锦龟背竹等"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7B6B] mb-1.5 block">摆放位置</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LOCATION_LABELS) as [PlantLocation, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLocation(key)}
                  className={`chip ${location === key ? "chip-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7B6B] mb-1 block">
              浇水周期
              <span className="text-[#6B7B6B]/60 font-normal ml-1">AI 已推荐</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7B6B]">每</span>
              <input
                type="number"
                min={1}
                max={60}
                value={wateringDays}
                onChange={(e) => setWateringDays(Number(e.target.value))}
                className="w-16 bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-[#2D7D46]/20"
              />
              <span className="text-sm text-[#6B7B6B]">天浇一次水</span>
            </div>
          </div>
        </div>

        {/* 高级设置折叠 */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full text-xs text-[#6B7B6B] flex items-center justify-center gap-1 py-1"
        >
          {showAdvanced ? "收起" : "高级设置（施肥、入手日期、备注）"}
        </button>

        {showAdvanced && (
          <div className="glass-card px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-[#6B7B6B] mb-1 block">施肥周期</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7B6B]">每</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={fertilizingDays}
                  onChange={(e) => setFertilizingDays(Number(e.target.value))}
                  className="w-16 bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-[#2D7D46]/20"
                />
                <span className="text-sm text-[#6B7B6B]">天施一次肥</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6B7B6B] mb-1.5 block">入手日期（可选）</label>
              <input
                type="date"
                value={acquiredAt}
                onChange={(e) => setAcquiredAt(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#6B7B6B] mb-1.5 block">备注</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="其他想记录的信息..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!name || !imageBase64}
          className="w-full bg-[#2D7D46] hover:bg-[#246838] disabled:bg-gray-300 disabled:shadow-none text-white rounded-3xl py-4 font-medium transition-colors shadow-lg shadow-green-700/20 press-effect"
        >
          添加植物
        </button>
      </form>
    </main>
  );
}
