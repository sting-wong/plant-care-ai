import { nanoid } from "nanoid";
import type {
  AIService,
  DiagnosisRequest,
  DiagnosisResponse,
  ChatRequest,
} from "./types";

const ARK_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/responses";
const DEFAULT_MODEL = "doubao-seed-1-6-flash-250828";

const SYSTEM_PROMPT = `你是"小植"，一个温暖专业的植物养护顾问。像一个懂植物的好朋友跟用户聊天。

规则：
- 直接回答问题，不要写"我来分析一下""根据图片判断"等过程性文字
- 用自然口语，不用 Markdown 格式（不加粗、不用标题、不用星号列表）
- 每次回复 80-200 字，要有信息量，不要一句话敷衍
- 如果需要分点说，用"第一是...另外..."这种自然语言
- 可以在最后主动问一个跟养护相关的问题，引导用户继续聊`;

const DIAGNOSIS_PROMPT = `看看这张植物照片，告诉用户：

1）这是什么植物（不确定就说"看起来像是XX"）
2）目前状态怎么样（健康/有点问题/需要注意）
3）给 2-3 条具体养护建议（浇水频率、光照、注意事项）

用聊天的语气说，不要用列表格式，像朋友间的对话。最后可以问用户一个问题（比如"它放在什么位置？""多久浇一次水？"）。不要写任何分析过程。`;

type ArkInputItem =
  | { role: "user" | "assistant"; content: ArkContentPart[] };

type ArkContentPart =
  | { type: "input_image"; image_url: string }
  | { type: "input_text"; text: string }
  | { type: "output_text"; text: string };

async function callArk(
  input: ArkInputItem[],
  instructions?: string
): Promise<string> {
  const apiKey = process.env.ARK_API_KEY;
  const model = process.env.ARK_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("ARK_API_KEY not configured. 请在 .env.local 中配置火山方舟 API Key");
  }

  const body: Record<string, unknown> = { model, input };
  if (instructions) body.instructions = instructions;

  const response = await fetch(ARK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`火山方舟 API 错误 ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();

  // Responses API: output[0].content[0].text
  // Fallback to chat/completions shape just in case
  const text: string =
    data.output?.[0]?.content?.[0]?.text ??
    data.choices?.[0]?.message?.content ??
    "";

  return cleanReplyText(text) ||
    "看了照片但没能生成完整建议，可以直接告诉我叶片状态或盆土干湿情况，我来帮你分析。";
}

export class ArkAIService implements AIService {
  async diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse> {
    const conversationId = nanoid(10);

    let imageUrl = req.imageBase64;
    if (!imageUrl.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${imageUrl}`;
    }

    const input: ArkInputItem[] = [
      {
        role: "user",
        content: [
          { type: "input_image", image_url: imageUrl },
          { type: "input_text", text: DIAGNOSIS_PROMPT },
        ],
      },
    ];

    const aiText = await callArk(input, SYSTEM_PROMPT);

    const parsed = parseDiagnosisJson(aiText);
    const cleaned = cleanReplyText(aiText);

    if (parsed) {
      const greeting = parsed.summary || cleaned;
      const plantName = parsed.plantName || extractPlantName(cleaned);
      return {
        plantName: plantName || "暂未确认品种",
        scientificName: parsed.scientificName || "",
        confidence: parsed.confidence ?? 0.75,
        healthStatus: parsed.healthStatus || detectHealthStatus(greeting),
        summary: parsed.summary || greeting,
        issues: parsed.issues || [],
        careTips: parsed.careTips || [],
        nextQuestions: parsed.nextQuestions || [
          "怎么判断现在该不该浇水？",
          "它适合放在哪里？",
          "需要换盆或施肥吗？",
        ],
        greeting,
        conversationId,
      };
    }

    const plantName = extractPlantName(cleaned);
    const greeting =
      cleaned ||
      "我看完了这张照片，但刚才的回复格式有点乱。你可以直接问我叶片状态、浇水频率或者光照需求。";
    return {
      plantName: plantName || "暂未确认品种",
      scientificName: "",
      confidence: 0.6,
      healthStatus: detectHealthStatus(greeting),
      summary: greeting,
      issues: [],
      careTips: [],
      nextQuestions: [
        "怎么判断现在该不该浇水？",
        "它适合放在哪里？",
        "需要换盆或施肥吗？",
      ],
      greeting,
      conversationId,
    };
  }

  async chat(req: ChatRequest): Promise<string> {
    const input: ArkInputItem[] = [];

    if (req.history && req.history.length > 0) {
      const normalized = req.history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: [{ type: "input_text" as const, text: h.content }],
      }));
      if (normalized[0]?.role === "assistant") {
        normalized.unshift({
          role: "user",
          content: [{ type: "input_text", text: "请帮我看看这棵植物" }],
        });
      }
      input.push(...normalized);
    } else {
      input.push({
        role: "user",
        content: [{ type: "input_text", text: req.message }],
      });
    }

    const aiText = await callArk(input, SYSTEM_PROMPT);
    return cleanReplyText(aiText);
  }
}

// ── Parsing helpers (same logic as zhipu-service) ────────────────────────────

interface ParsedDiagnosis {
  plantName: string;
  scientificName: string;
  confidence: number;
  healthStatus: "healthy" | "needs_attention" | "critical";
  summary: string;
  issues: string[];
  careTips: string[];
  nextQuestions: string[];
}

function parseDiagnosisJson(text: string): ParsedDiagnosis | null {
  const jsonText = extractJsonText(text);
  if (!jsonText) return null;
  try {
    const raw = JSON.parse(jsonText) as Record<string, unknown>;
    return {
      plantName: toCleanString(raw.plant_name) || "植物",
      scientificName: toCleanString(raw.scientific_name),
      confidence: normalizeConfidence(raw.confidence),
      healthStatus: normalizeHealthStatus(raw.health_status),
      summary:
        toCleanString(raw.summary) ||
        "我看完了，这株植物需要按水分、光照和盆土状态来照顾。",
      issues: toStringList(raw.issues).slice(0, 3),
      careTips: toStringList(raw.care_tips).slice(0, 4),
      nextQuestions: toStringList(raw.next_questions).slice(0, 3),
    };
  } catch {
    return null;
  }
}

function extractJsonText(text: string): string | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

function normalizeHealthStatus(
  value: unknown
): "healthy" | "needs_attention" | "critical" {
  if (value === "healthy" || value === "needs_attention" || value === "critical")
    return value;
  return "needs_attention";
}

function normalizeConfidence(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0.75;
  if (value > 1) return Math.min(value / 100, 1);
  return Math.max(0, Math.min(value, 1));
}

function toCleanString(value: unknown): string {
  return typeof value === "string" ? cleanReplyText(value) : "";
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(toCleanString).filter(Boolean);
}

function cleanReplyText(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*\d+\.\s*/gm, "")
    .replace(/^\s*[-*]\s*/gm, "")
    .replace(
      /识别用户请求[:：]?[\s\S]*?(?=植物识别|健康状况|养护建议|$)/g,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractPlantName(text: string): string | null {
  const patterns = [
    /这是一[棵盆株颗](.{1,10}?)[，。！,!\s]/,
    /看起来像是(.{1,10}?)[呀啊哦～，。！,!\s]/,
    /看起来是(.{1,10}?)[，。！,!\s]/,
    /应该是(.{1,10}?)[，。！,!\s]/,
    /是一[棵盆株颗](.{1,10}?)[，。！,!\s]/,
    /可能是(.{1,10}?)[，。！,!\s]/,
    /这是(.{2,8}?)[，。！,!\s]/,
    /是(.{2,8}?)[植物花草]/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim().replace(/[呀啊哦～，。！,!\s]$/, "");
      if (name.length >= 2) return name;
    }
  }
  return null;
}

function detectHealthStatus(
  text: string
): "healthy" | "needs_attention" | "critical" {
  const criticalWords = ["严重", "枯死", "烂根", "紧急", "救", "死"];
  const healthyWords = [
    "状态不错",
    "状态良好",
    "长得很精神",
    "很健康",
    "不错",
  ];
  if (criticalWords.some((w) => text.includes(w))) return "critical";
  if (healthyWords.some((w) => text.includes(w))) return "healthy";
  return "needs_attention";
}

export const arkAIService = new ArkAIService();
