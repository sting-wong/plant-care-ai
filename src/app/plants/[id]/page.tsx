"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import {
  ArrowLeft,
  Camera,
  Droplets,
  Sparkles,
  Calendar,
  Trash2,
  Pencil,
  MapPin,
} from "lucide-react";
import { usePlantStore, LOCATION_LABELS } from "@/lib/store";
import { compressImage } from "@/lib/utils";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hours}:${minutes}`;
}

function formatRelativeDate(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}个月前`;
}

function WateringCard({ plant }: { plant: import("@/lib/store").MyPlant }) {
  const waterPlant = usePlantStore((s) => s.waterPlant);
  const daysSince = Math.floor(
    (Date.now() - plant.lastWateredAt) / (1000 * 60 * 60 * 24)
  );
  const daysUntil = plant.wateringIntervalDays - daysSince;
  const isOverdue = daysUntil <= 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isOverdue
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOverdue ? "bg-blue-100" : "bg-blue-50"}`}>
            <Droplets className={`w-5 h-5 ${isOverdue ? "text-blue-600" : "text-blue-400"}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isOverdue ? "text-blue-700" : "text-gray-900"}`}>
              {isOverdue
                ? daysUntil === 0
                  ? "今天需要浇水"
                  : `已超期 ${Math.abs(daysUntil)} 天`
                : `还有 ${daysUntil} 天需要浇水`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              上次浇水：{daysSince === 0 ? "今天" : `${daysSince}天前`}
            </p>
          </div>
        </div>
        <button
          onClick={() => waterPlant(plant.id)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          已浇水
        </button>
      </div>
    </div>
  );
}

function FertilizingCard({ plant }: { plant: import("@/lib/store").MyPlant }) {
  const fertilizePlant = usePlantStore((s) => s.fertilizePlant);
  const daysSince = Math.floor(
    (Date.now() - plant.lastFertilizedAt) / (1000 * 60 * 60 * 24)
  );
  const daysUntil = plant.fertilizingIntervalDays - daysSince;
  const isOverdue = daysUntil <= 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isOverdue
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOverdue ? "bg-amber-100" : "bg-amber-50"}`}>
            <Sparkles className={`w-5 h-5 ${isOverdue ? "text-amber-600" : "text-amber-400"}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isOverdue ? "text-amber-700" : "text-gray-900"}`}>
              {isOverdue
                ? daysUntil === 0
                  ? "今天需要施肥"
                  : `已超期 ${Math.abs(daysUntil)} 天`
                : `还有 ${daysUntil} 天需要施肥`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              上次施肥：{daysSince === 0 ? "今天" : `${daysSince}天前`}
            </p>
          </div>
        </div>
        <button
          onClick={() => fertilizePlant(plant.id)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          已施肥
        </button>
      </div>
    </div>
  );
}

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.id as string;

  const plant = usePlantStore((s) => s.plants[plantId]);
  const records = usePlantStore((s) => s.growthRecords[plantId] || []);
  const addGrowthRecord = usePlantStore((s) => s.addGrowthRecord);
  const deleteGrowthRecord = usePlantStore((s) => s.deleteGrowthRecord);
  const deletePlant = usePlantStore((s) => s.deletePlant);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newImage, setNewImage] = useState("");

  if (!plant) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">找不到这棵植物</p>
      </div>
    );
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { base64 } = await compressImage(file);
    setNewImage(base64);
    setShowAddRecord(true);
  };

  const handleAddRecord = () => {
    if (!newImage) return;
    addGrowthRecord({
      id: nanoid(8),
      plantId,
      imageBase64: newImage,
      note,
      createdAt: Date.now(),
    });
    setNewImage("");
    setNote("");
    setShowAddRecord(false);
  };

  const handleDelete = () => {
    if (confirm(`确定要删除「${plant.name}」吗？相关的成长记录也会一起删除。`)) {
      deletePlant(plantId);
      router.push("/plants");
    }
  };

  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* 顶部 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/plants")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-medium text-gray-900">{plant.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/plants/${plantId}/edit`}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 植物信息卡 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 ring-2 ring-green-100">
              <img
                src={plant.imageBase64}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{plant.species}</p>
              {plant.location && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {LOCATION_LABELS[plant.location]}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  每{plant.wateringIntervalDays}天浇水
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  每{plant.fertilizingIntervalDays}天施肥
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                添加于 {formatRelativeDate(plant.createdAt)}
              </p>
            </div>
          </div>
          {plant.notes && (
            <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-50">
              {plant.notes}
            </p>
          )}
        </div>
      </div>

      {/* 浇水/施肥倒计时卡片 */}
      <div className="px-4 pb-4 space-y-3">
        <WateringCard plant={plant} />
        <FertilizingCard plant={plant} />
      </div>

      {/* 成长记录 */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-gray-900">成长记录</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            拍照打卡
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* 添加记录表单 */}
        {showAddRecord && newImage && (
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 mb-4">
            <img
              src={newImage}
              alt="新记录"
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="记录一下这个瞬间（可选）"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300 mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddRecord}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setShowAddRecord(false);
                  setNewImage("");
                }}
                className="px-4 text-gray-500 text-sm hover:text-gray-700"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 时间线 */}
        {sortedRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">
              还没有成长记录，拍张照开始记录吧
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {sortedRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <img
                  src={record.imageBase64}
                  alt="成长记录"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex items-start justify-between">
                  <div>
                    {record.note && (
                      <p className="text-sm text-gray-700 mb-1">{record.note}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("删除这条记录？")) {
                        deleteGrowthRecord(plantId, record.id);
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
