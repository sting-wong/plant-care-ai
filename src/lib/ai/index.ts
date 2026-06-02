import { zhipuAIService } from "./zhipu-service";
import type { AIService } from "./types";

// 使用智谱 GLM-4V（国内直连，支持图片识别）
export const aiService: AIService = zhipuAIService;

export type { DiagnosisRequest, DiagnosisResponse, ChatMessage, ChatRequest, AIService } from "./types";
