import type { MyPlant } from "./store";

export interface CareReminder {
  plant: MyPlant;
  type: "water" | "fertilize";
  daysOverdue: number;
}

export function getDaysUntilWatering(plant: MyPlant): number {
  const daysSince = Math.floor((Date.now() - plant.lastWateredAt) / 86400000);
  return plant.wateringIntervalDays - daysSince;
}

export function getDaysUntilFertilizing(plant: MyPlant): number {
  const daysSince = Math.floor((Date.now() - plant.lastFertilizedAt) / 86400000);
  return plant.fertilizingIntervalDays - daysSince;
}

export function getTodayReminders(plants: Record<string, MyPlant>): CareReminder[] {
  const reminders: CareReminder[] = [];
  Object.values(plants).forEach((plant) => {
    const daysUntilWater = getDaysUntilWatering(plant);
    if (daysUntilWater <= 0) {
      reminders.push({ plant, type: "water", daysOverdue: -daysUntilWater });
    }
    const daysUntilFert = getDaysUntilFertilizing(plant);
    if (daysUntilFert <= 0) {
      reminders.push({ plant, type: "fertilize", daysOverdue: -daysUntilFert });
    }
  });
  return reminders.sort((a, b) => b.daysOverdue - a.daysOverdue);
}
