"use client";

import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { PlantDetailView } from "@/components/plant-detail-view";
import { usePlantStore } from "@/lib/store";
import { compressImage } from "@/lib/utils";

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const plantId = params.id as string;

  const { plants, growthRecords, addGrowthRecord, deleteGrowthRecord, deletePlant, waterPlant, fertilizePlant, createSession } = usePlantStore();
  const plant = plants[plantId];
  const rawRecords = growthRecords[plantId];
  const records = rawRecords ?? [];

  if (!plant) {
    return (
      <div className="glass-bg min-h-dvh flex items-center justify-center">
        <p className="text-[#6B7B6B]">找不到这棵植物</p>
      </div>
    );
  }

  const handleCheckup = async (file: File) => {
    const { base64 } = await compressImage(file);
    const sessionId = nanoid(10);
    createSession(sessionId, base64);
    router.push(`/diagnosis/${sessionId}?plantId=${plantId}`);
  };

  return (
    <PlantDetailView
      plant={plant}
      records={records}
      onBack={() => router.push("/plants")}
      onWater={() => waterPlant(plantId)}
      onFertilize={() => fertilizePlant(plantId)}
      onCheckup={handleCheckup}
      onAddRecord={(imageBase64, note) =>
        addGrowthRecord({ id: nanoid(8), plantId, imageBase64, note, createdAt: Date.now() })
      }
      onDeleteRecord={(recordId) => deleteGrowthRecord(plantId, recordId)}
      onDelete={() => {
        if (confirm(`确定要删除「${plant.name}」吗？相关的成长记录也会一起删除。`)) {
          deletePlant(plantId);
          router.push("/plants");
        }
      }}
      editHref={`/plants/${plantId}/edit`}
    />
  );
}
