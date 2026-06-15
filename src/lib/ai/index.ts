import { arkAIService } from "./ark-service";
import type { AIService } from "./types";

// 使用豆包 doubao-seed-1-6-flash（火山方舟 Responses API）
// Fallback: src/lib/ai/zhipu-service.ts 保留备用，切换时改此行
export const aiService: AIService = arkAIService;

export type { DiagnosisRequest, DiagnosisResponse, ChatMessage, ChatRequest, AIService } from "./types";
