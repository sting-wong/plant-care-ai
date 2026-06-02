export interface DiagnosisRequest {
  imageBase64: string;
  mimeType: string;
}

export interface DiagnosisResponse {
  plantName: string;
  scientificName: string;
  confidence: number;
  healthStatus: "healthy" | "needs_attention" | "critical";
  summary?: string;
  issues: string[];
  careTips: string[];
  nextQuestions?: string[];
  greeting: string;
  conversationId: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  conversationId: string;
  message: string;
  history?: { role: string; content: string }[];
}

export interface AIService {
  diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse>;
  chat(req: ChatRequest): Promise<string>;
}
