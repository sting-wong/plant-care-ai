import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DiagnosisResponse, ChatMessage } from "./ai/types";

export interface DiagnosisSession {
  id: string;
  imageBase64: string;
  diagnosis: DiagnosisResponse | null;
  messages: ChatMessage[];
  createdAt: number;
}

export type PlantLocation = "balcony" | "living_room" | "bedroom" | "office" | "bathroom" | "kitchen" | "other";

export const LOCATION_LABELS: Record<PlantLocation, string> = {
  balcony: "阳台",
  living_room: "客厅",
  bedroom: "卧室",
  office: "办公桌",
  bathroom: "卫生间",
  kitchen: "厨房",
  other: "其他",
};

export interface MyPlant {
  id: string;
  name: string;
  species: string;
  imageBase64: string;
  location: PlantLocation;
  acquiredAt: number | null;
  wateringIntervalDays: number;
  fertilizingIntervalDays: number;
  lastWateredAt: number;
  lastFertilizedAt: number;
  createdAt: number;
  notes: string;
  health: "healthy" | "watch" | "urgent";
  lastDiagnosisAt: number | null;
  lastDiagnosisSummary: string;
}

export interface GrowthRecord {
  id: string;
  plantId: string;
  imageBase64: string;
  note: string;
  createdAt: number;
}

interface PlantStore {
  // 诊断相关
  sessions: Record<string, DiagnosisSession>;
  currentSessionId: string | null;
  createSession: (id: string, imageBase64: string) => void;
  setDiagnosis: (sessionId: string, diagnosis: DiagnosisResponse) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  setCurrentSession: (id: string | null) => void;
  getSession: (id: string) => DiagnosisSession | undefined;

  // 植物档案相关
  plants: Record<string, MyPlant>;
  addPlant: (plant: MyPlant) => void;
  updatePlant: (id: string, updates: Partial<MyPlant>) => void;
  updatePlantDiagnosis: (
    id: string,
    updates: {
      health: MyPlant["health"];
      lastDiagnosisAt: number;
      lastDiagnosisSummary: string;
      wateringIntervalDays?: number;
      fertilizingIntervalDays?: number;
    }
  ) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  fertilizePlant: (id: string) => void;

  // 成长记录
  growthRecords: Record<string, GrowthRecord[]>;
  addGrowthRecord: (record: GrowthRecord) => void;
  deleteGrowthRecord: (plantId: string, recordId: string) => void;
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      currentSessionId: null,

      createSession: (id, imageBase64) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [id]: {
              id,
              imageBase64,
              diagnosis: null,
              messages: [],
              createdAt: Date.now(),
            },
          },
          currentSessionId: id,
        })),

      setDiagnosis: (sessionId, diagnosis) =>
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: { ...session, diagnosis },
            },
          };
        }),

      addMessage: (sessionId, message) =>
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: [...session.messages, message],
              },
            },
          };
        }),

      setCurrentSession: (id) => set({ currentSessionId: id }),

      getSession: (id) => get().sessions[id],

      // 植物档案
      plants: {},

      addPlant: (plant) =>
        set((state) => ({
          plants: { ...state.plants, [plant.id]: plant },
        })),

      updatePlant: (id, updates) =>
        set((state) => {
          const plant = state.plants[id];
          if (!plant) return state;
          return {
            plants: { ...state.plants, [id]: { ...plant, ...updates } },
          };
        }),

      updatePlantDiagnosis: (id, updates) =>
        set((state) => {
          const plant = state.plants[id];
          if (!plant) return state;
          return {
            plants: {
              ...state.plants,
              [id]: {
                ...plant,
                health: updates.health,
                lastDiagnosisAt: updates.lastDiagnosisAt,
                lastDiagnosisSummary: updates.lastDiagnosisSummary,
                ...(updates.wateringIntervalDays !== undefined && {
                  wateringIntervalDays: updates.wateringIntervalDays,
                }),
                ...(updates.fertilizingIntervalDays !== undefined && {
                  fertilizingIntervalDays: updates.fertilizingIntervalDays,
                }),
              },
            },
          };
        }),

      deletePlant: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.plants;
          return { plants: rest };
        }),

      waterPlant: (id) =>
        set((state) => {
          const plant = state.plants[id];
          if (!plant) return state;
          return {
            plants: {
              ...state.plants,
              [id]: { ...plant, lastWateredAt: Date.now() },
            },
          };
        }),

      fertilizePlant: (id) =>
        set((state) => {
          const plant = state.plants[id];
          if (!plant) return state;
          return {
            plants: {
              ...state.plants,
              [id]: { ...plant, lastFertilizedAt: Date.now() },
            },
          };
        }),

      // 成长记录
      growthRecords: {},

      addGrowthRecord: (record) =>
        set((state) => {
          const existing = state.growthRecords[record.plantId] || [];
          return {
            growthRecords: {
              ...state.growthRecords,
              [record.plantId]: [...existing, record],
            },
          };
        }),

      deleteGrowthRecord: (plantId, recordId) =>
        set((state) => {
          const existing = state.growthRecords[plantId] || [];
          return {
            growthRecords: {
              ...state.growthRecords,
              [plantId]: existing.filter((r) => r.id !== recordId),
            },
          };
        }),
    }),
    {
      name: "plant-care-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Backfill new fields for plants saved before Task 1
        const migratedPlants: Record<string, MyPlant> = {};
        for (const [id, plant] of Object.entries(state.plants)) {
          const p = plant as Partial<MyPlant> & Omit<MyPlant, "health" | "lastDiagnosisAt" | "lastDiagnosisSummary">;
          migratedPlants[id] = {
            ...plant,
            health: p.health ?? "healthy",
            lastDiagnosisAt: p.lastDiagnosisAt !== undefined ? p.lastDiagnosisAt : null,
            lastDiagnosisSummary: p.lastDiagnosisSummary ?? "",
          };
        }
        state.plants = migratedPlants;
      },
    }
  )
);
