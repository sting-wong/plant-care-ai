"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Droplets,
  Sparkles,
  Calendar,
  Trash2,
  Pencil,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { LOCATION_LABELS, type MyPlant, type GrowthRecord } from "@/lib/store";

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

// SVG data URI → use object-contain; real photos → object-cover
function isSvgImage(src: string): boolean {
  return src.startsWith("data:image/svg+xml");
}

// health enum → display score (UI-only, not persisted)
function healthToScore(health: MyPlant["health"]): number | null {
  if (health === "healthy") return 85;
  if (health === "watch") return 60;
  if (health === "urgent") return 35;
  return null;
}

function healthToTag(health: MyPlant["health"]): { label: string; color: string } {
  if (health === "urgent") return { label: "POOR", color: "#F87171" };
  if (health === "watch") return { label: "FAIR", color: "#FBBF24" };
  if (health === "healthy") return { label: "GOOD", color: "#4CAF7A" };
  return { label: "—", color: "rgba(255,255,255,0.4)" };
}

interface PlantDetailViewProps {
  plant: MyPlant;
  records: GrowthRecord[];
  onBack: () => void;
  onWater: () => void;
  onFertilize?: () => void;
  onCheckup?: (file: File) => void;
  onAddRecord: (imageBase64: string, note: string) => void;
  onDeleteRecord: (recordId: string) => void;
  onDelete: () => void;
  editHref?: string;
  readonly?: boolean;
}

export function PlantDetailView({
  plant,
  records,
  onBack,
  onWater,
  onFertilize,
  onCheckup,
  onAddRecord,
  onDeleteRecord,
  onDelete,
  editHref,
  readonly = false,
}: PlantDetailViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkupInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [justWatered, setJustWatered] = useState(false);
  const [justFertilized, setJustFertilized] = useState(false);

  const daysSinceWatered = Math.floor((Date.now() - plant.lastWateredAt) / 86400000);
  const daysUntilWater = plant.wateringIntervalDays - daysSinceWatered;
  const daysSinceFert = Math.floor((Date.now() - plant.lastFertilizedAt) / 86400000);
  const daysUntilFert = plant.fertilizingIntervalDays - daysSinceFert;
  const needsWater = daysUntilWater <= 0 && !justWatered;
  const needsFert = daysUntilFert <= 0 && !justFertilized;

  const handleWater = () => { onWater(); setJustWatered(true); };
  const handleFertilize = () => { if (!onFertilize) return; onFertilize(); setJustFertilized(true); };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { compressImage } = await import("@/lib/utils");
    const { base64 } = await compressImage(file);
    setNewImage(base64);
    setShowAddRecord(true);
  };

  const handleCheckupSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCheckup) return;
    onCheckup(file);
  };

  const handleAddRecord = () => {
    if (!newImage) return;
    onAddRecord(newImage, note);
    setNewImage(""); setNote(""); setShowAddRecord(false);
  };

  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt);

  const healthScore = healthToScore(plant.health);
  const healthTag = healthToTag(plant.health);

  // Water metric
  const waterTopClass = needsWater ? "metric-card-top-red"
    : justWatered ? "metric-card-top-green"
    : daysUntilWater <= 1 ? "metric-card-top-amber"
    : "metric-card-top-green";
  const waterColor = needsWater ? "#C53030"
    : justWatered ? "#15803D"
    : daysUntilWater <= 1 ? "#B45309"
    : "#15803D";
  const waterLabel = justWatered ? "已浇水 ✓"
    : needsWater ? `超期 ${Math.abs(daysUntilWater)}天`
    : daysUntilWater === 0 ? "今天浇水"
    : `${daysUntilWater}天后`;

  // Fert metric
  const fertTopClass = needsFert ? "metric-card-top-amber"
    : justFertilized ? "metric-card-top-green"
    : daysUntilFert <= 2 ? "metric-card-top-amber"
    : "metric-card-top-green";
  const fertColor = needsFert ? "#B45309"
    : justFertilized ? "#15803D"
    : daysUntilFert <= 2 ? "#B45309"
    : "#15803D";
  const fertLabel = justFertilized ? "已施肥 ✓"
    : needsFert ? `超期 ${Math.abs(daysUntilFert)}天`
    : daysUntilFert <= 0 ? "今天施肥"
    : `${daysUntilFert}天后`;

  // Checkup metric — days since last diagnosis
  const daysSinceCheckup = plant.lastDiagnosisAt
    ? Math.floor((Date.now() - plant.lastDiagnosisAt) / 86400000)
    : null;
  const checkupTopClass = daysSinceCheckup === null ? "metric-card-top-amber"
    : daysSinceCheckup > 30 ? "metric-card-top-red"
    : daysSinceCheckup > 14 ? "metric-card-top-amber"
    : "metric-card-top-green";
  const checkupColor = daysSinceCheckup === null ? "#B45309"
    : daysSinceCheckup > 30 ? "#C53030"
    : daysSinceCheckup > 14 ? "#B45309"
    : "#15803D";
  const checkupLabel = daysSinceCheckup === null ? "未诊断"
    : daysSinceCheckup === 0 ? "今天"
    : `${daysSinceCheckup}天前`;

  return (
    <main className="glass-bg min-h-dvh pb-8">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        {plant.imageBase64 ? (
          <img
            src={plant.imageBase64}
            alt={plant.name}
            className="w-full h-full"
            style={{
              objectFit: isSvgImage(plant.imageBase64) ? "contain" : "cover",
              objectPosition: "center",
              background: isSvgImage(plant.imageBase64)
                ? "linear-gradient(160deg, #0F2518 0%, #1A3A2A 50%, #2D5C3E 100%)"
                : undefined,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[120px] opacity-15"
            style={{ background: "linear-gradient(160deg, #0F2518 0%, #1A3A2A 50%, #2D5C3E 100%)" }}>
            🌿
          </div>
        )}
        <div className="hero-overlay absolute inset-0" />

        {/* 顶部操作栏 */}
        <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-14">
          <button
            aria-label="返回"
            onClick={onBack}
            className="detail-icon-btn w-9 h-9 flex items-center justify-center rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          {!readonly && (
            <div className="flex items-center gap-2">
              {editHref && (
                <Link href={editHref} aria-label="编辑植物"
                  className="detail-icon-btn w-9 h-9 flex items-center justify-center rounded-full">
                  <Pencil className="w-4 h-4 text-white" />
                </Link>
              )}
              <button aria-label="删除植物" onClick={onDelete}
                className="detail-icon-btn w-9 h-9 flex items-center justify-center rounded-full">
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </header>

        {/* 植物名 + 健康分气泡 */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-[32px] font-black text-white leading-none">{plant.name}</h1>
            {plant.species && (
              <p className="text-[12px] text-white/55 mt-1 italic">{plant.species}</p>
            )}
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mt-1.5">
              {formatRelativeDate(plant.createdAt)}收养
            </p>
          </div>

          {/* 健康分气泡 */}
          {healthScore !== null && (
            <div className="health-bubble shrink-0 text-center" style={{ minWidth: 72 }}>
              <p className="text-[26px] font-black text-white leading-none">{healthScore}</p>
              <div className="my-1.5 mx-auto overflow-hidden rounded-full"
                style={{ width: 48, height: 4, background: "rgba(255,255,255,0.15)" }}>
                <div className="h-full rounded-full"
                  style={{ width: `${healthScore}%`, background: healthTag.color }} />
              </div>
              <p className="text-[9px] font-black tracking-widest uppercase" style={{ color: healthTag.color }}>
                {healthTag.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── 奶油色主体区 ── */}
      <div className="px-4 pt-5 space-y-5 pb-10"
        style={{ background: "var(--cream, #F9F6EF)", borderRadius: "28px 28px 0 0", marginTop: -22 }}>

        {/* 三指标卡 */}
        <div className="flex gap-2">
          {/* 浇水 */}
          <div className={`metric-card ${waterTopClass} flex-1 text-center`}>
            <div className="text-[20px] mb-1.5">💧</div>
            <p className="text-[14px] font-black leading-snug" style={{ color: waterColor }}>{waterLabel}</p>
            <p className="text-[10px] font-bold tracking-wider uppercase mt-1" style={{ color: "#9AAA9A" }}>浇水</p>
            <div className="mt-1.5 mx-auto overflow-hidden rounded-full" style={{ width: 36, height: 3, background: "#E8EDE5" }}>
              <div className="h-full rounded-full" style={{
                background: waterColor,
                width: needsWater ? "18%" : justWatered ? "90%" : `${Math.max(10, Math.min(90, (1 - daysUntilWater / plant.wateringIntervalDays) * 100))}%`,
              }} />
            </div>
          </div>

          {/* 施肥 */}
          <div className={`metric-card ${fertTopClass} flex-1 text-center`}>
            <div className="text-[20px] mb-1.5">✨</div>
            <p className="text-[14px] font-black leading-snug" style={{ color: fertColor }}>{fertLabel}</p>
            <p className="text-[10px] font-bold tracking-wider uppercase mt-1" style={{ color: "#9AAA9A" }}>施肥</p>
            <div className="mt-1.5 mx-auto overflow-hidden rounded-full" style={{ width: 36, height: 3, background: "#E8EDE5" }}>
              <div className="h-full rounded-full" style={{
                background: fertColor,
                width: needsFert ? "18%" : justFertilized ? "90%" : `${Math.max(10, Math.min(90, (1 - daysUntilFert / plant.fertilizingIntervalDays) * 100))}%`,
              }} />
            </div>
          </div>

          {/* 复查 */}
          <div className={`metric-card ${checkupTopClass} flex-1 text-center`}>
            <div className="text-[20px] mb-1.5">🔍</div>
            <p className="text-[14px] font-black leading-snug" style={{ color: checkupColor }}>{checkupLabel}</p>
            <p className="text-[10px] font-bold tracking-wider uppercase mt-1" style={{ color: "#9AAA9A" }}>复查</p>
            <div className="mt-1.5 mx-auto overflow-hidden rounded-full" style={{ width: 36, height: 3, background: "#E8EDE5" }}>
              <div className="h-full rounded-full" style={{
                background: checkupColor,
                width: daysSinceCheckup === null ? "15%" : daysSinceCheckup > 30 ? "20%" : daysSinceCheckup > 14 ? "50%" : "80%",
              }} />
            </div>
          </div>
        </div>

        {/* 主 CTA：拍照复查 */}
        {!readonly && (
          <button
            aria-label="拍照复查"
            onClick={() => checkupInputRef.current?.click()}
            className="cta-primary-forest w-full py-4 flex items-center justify-center gap-2.5 text-[16px]"
          >
            <Camera className="w-5 h-5" />
            拍照复查
          </button>
        )}

        {/* 浇水 + 施肥 次级操作 */}
        {!readonly && (
          <div className="flex gap-3">
            <button
              aria-label="标记已浇水"
              onClick={justWatered ? undefined : handleWater}
              disabled={justWatered}
              className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold transition-colors"
              style={{
                border: "1.5px solid rgba(21,46,30,0.10)",
                background: justWatered ? "rgba(76,175,122,0.08)" : "#fff",
                color: justWatered ? "#15803D" : "#1A2E1A",
                boxShadow: "0 1px 3px rgba(21,46,30,0.06)",
              }}
            >
              <Droplets className={`w-4 h-4 ${justWatered ? "text-[#4CAF7A]" : "text-blue-400"}`} />
              {justWatered ? "今天已浇水 ✓" : "记录浇水"}
            </button>
            <button
              aria-label="标记已施肥"
              onClick={justFertilized || !onFertilize ? undefined : handleFertilize}
              disabled={justFertilized || !onFertilize}
              className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold transition-colors"
              style={{
                border: "1.5px solid rgba(21,46,30,0.10)",
                background: justFertilized ? "rgba(76,175,122,0.08)" : "#fff",
                color: justFertilized ? "#15803D" : !onFertilize ? "#9AAA9A" : "#1A2E1A",
                boxShadow: "0 1px 3px rgba(21,46,30,0.06)",
                opacity: !onFertilize ? 0.5 : 1,
              }}
            >
              <Sparkles className={`w-4 h-4 ${justFertilized ? "text-[#4CAF7A]" : "text-amber-400"}`} />
              {justFertilized ? "今天已施肥 ✓" : "记录施肥"}
            </button>
          </div>
        )}

        {/* 上次诊断报告 */}
        {plant.lastDiagnosisSummary && (
          <div className="report-card-accent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px]"
                  style={{ background: "#DCFCE7" }}>🌿</div>
                <span className="text-[12px] font-black text-[#15803D]">上次诊断报告</span>
              </div>
              {plant.lastDiagnosisAt && (
                <span className="text-[11px] font-semibold" style={{ color: "#9AAA9A" }}>
                  {formatRelativeDate(plant.lastDiagnosisAt)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-2">
              {healthScore !== null && (
                <span className="text-[36px] font-black leading-none" style={{ color: "#111C13" }}>
                  {healthScore}
                </span>
              )}
              <div className="flex-1">
                <p className="text-[13px] font-bold" style={{ color: healthTag.color }}>
                  {plant.health === "healthy" ? "状态良好" : plant.health === "watch" ? "需要关注" : plant.health === "urgent" ? "需紧急处理" : "待评估"}
                </p>
                {plant.species && (
                  <p className="text-[11px] italic mt-0.5" style={{ color: "#5A6B5A" }}>{plant.species}</p>
                )}
              </div>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "#5A6B5A" }}>
              {plant.lastDiagnosisSummary}
            </p>
            <button
              onClick={() => checkupInputRef.current?.click()}
              className="flex items-center gap-1 mt-3 text-[12px] font-bold"
              style={{ color: "#2D7D46" }}
            >
              重新检查 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* chips（辅助信息） */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {plant.location && (
            <div className="chip shrink-0 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6B7B6B]" />
              {LOCATION_LABELS[plant.location]}
            </div>
          )}
          <div className="chip shrink-0 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#6B7B6B]" />
            {formatRelativeDate(plant.createdAt)}收养
          </div>
          <div className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
            needsWater ? "bg-red-500/12 text-red-600 border-red-200/50"
            : justWatered ? "bg-green-500/12 text-[#2D7D46] border-green-200/50"
            : "chip"
          }`}>
            <Droplets className="w-3.5 h-3.5 text-[#4FC3F7] shrink-0" />
            {justWatered ? "今天已浇水" : needsWater ? `浇水超期 ${Math.abs(daysUntilWater)}天` : `${daysUntilWater}天后浇水`}
          </div>
        </div>

        {/* 养护备注 */}
        {plant.notes && (
          <div className="glass-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#2D7D46] font-semibold mb-2">养护备注</p>
            <p className="text-sm text-[#1A2E1A] leading-relaxed">{plant.notes}</p>
          </div>
        )}

        {/* 成长日志 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1A2E1A]">成长日志</h2>
            {!readonly && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 glass-green rounded-full text-xs font-semibold text-[#2D7D46]"
              >
                <Camera className="w-3.5 h-3.5" />
                拍照打卡
              </button>
            )}
          </div>

          {!readonly && (
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
              onChange={handleImageSelect} className="hidden" />
          )}

          {showAddRecord && newImage && (
            <div className="glass-card p-4 mb-4">
              <img src={newImage} alt="新记录" className="w-full h-40 object-cover rounded-xl mb-3" />
              <input
                type="text" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="记录一下这个瞬间（可选）"
                className="w-full bg-white/40 border border-white/50 rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7D46]/20 mb-3"
              />
              <div className="flex gap-2">
                <button onClick={handleAddRecord}
                  className="flex-1 bg-[#2D7D46] text-white rounded-2xl py-2 text-sm font-medium">保存</button>
                <button onClick={() => { setShowAddRecord(false); setNewImage(""); }}
                  className="px-4 text-[#6B7B6B] text-sm">取消</button>
              </div>
            </div>
          )}

          {sortedRecords.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm font-medium text-[#5A6B5A]">还没有成长记录</p>
              <p className="text-xs text-[#9AAA9A] mt-1">拍张照开始记录植物的成长吧</p>
            </div>
          ) : (
            <div className="space-y-0">
              {sortedRecords.map((record, index) => (
                <div key={record.id} className="flex gap-3">
                  {/* timeline 左侧 */}
                  <div className="flex flex-col items-center" style={{ width: 36 }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                      style={{ background: "#fff", border: "2px solid rgba(45,125,70,0.18)", boxShadow: "0 1px 3px rgba(21,46,30,0.06)" }}>
                      🌿
                    </div>
                    {index < sortedRecords.length - 1 && (
                      <div className="flex-1 w-px mt-1" style={{ background: "rgba(45,125,70,0.14)", minHeight: 16 }} />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0 pb-5">
                    <img src={record.imageBase64} alt="成长记录"
                      className="w-full rounded-2xl mb-2"
                      style={{
                        height: 148,
                        objectFit: isSvgImage(record.imageBase64) ? "contain" : "cover",
                        objectPosition: "center",
                        background: isSvgImage(record.imageBase64)
                          ? "linear-gradient(160deg, #E8F5E9 0%, #C8E6C9 100%)"
                          : undefined,
                      }} />
                    <p className="text-[11px] font-bold" style={{ color: "#9AAA9A" }}>
                      {formatDate(record.createdAt)}
                    </p>
                    {record.note && (
                      <p className="text-[13px] mt-1" style={{ color: "#111C13" }}>{record.note}</p>
                    )}
                    {!readonly && (
                      <button
                        onClick={() => { if (confirm("删除这条记录？")) onDeleteRecord(record.id); }}
                        className="text-xs mt-1.5 hover:text-red-500 transition-colors"
                        style={{ color: "#9AAA9A" }}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!readonly && (
        <input ref={checkupInputRef} type="file" accept="image/*" capture="environment"
          onChange={handleCheckupSelect} className="hidden" />
      )}
    </main>
  );
}
