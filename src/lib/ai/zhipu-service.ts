import { nanoid } from "nanoid";
import type {
  AIService,
  DiagnosisRequest,
  DiagnosisResponse,
  ChatRequest,
} from "./types";

const SYSTEM_PROMPT = `你是”小植”，一个温暖专业的植物养护顾问。像一个懂植物的好朋友跟用户聊天。

规则：
- 直接回答问题，不要写”我来分析一下””根据图片判断”等过程性文字
- 用自然口语，不用 Markdown 格式（不加粗、不用标题、不用星号列表）
- 每次回复 80-200 字，要有信息量，不要一句话敷衍
- 如果需要分点说，用”第一是...另外...”这种自然语言
- 可以在最后主动问一个跟养护相关的问题，引导用户继续聊`;

const DIAGNOSIS_PROMPT = `看看这张植物照片，告诉用户：

1）这是什么植物（不确定就说”看起来像是XX”）
2）目前状态怎么样（健康/有点问题/需要注意）
3）给 2-3 条具体养护建议（浇水频率、光照、注意事项）

用聊天的语气说，不要用列表格式，像朋友间的对话。最后可以问用户一个问题（比如”它放在什么位置？””多久浇一次水？”）。不要写任何分析过程。`;

interface ZhipuMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

async function callZhipu(messages: ZhipuMessage[]): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY not configured. 请在 .env.local 中配置智谱 API Key");
  }

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4.6v",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`智谱 API 错误 ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;

  let content = message?.content || "";

  // 过滤掉任何可能的思考标记
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  content = cleanReplyText(content);

  return content || "看了照片但没能生成完整建议，可以直接告诉我叶片状态或盆土干湿情况，我来帮你分析。";
}

export class ZhipuAIService implements AIService {
  async diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse> {
    const conversationId = nanoid(10);

    let imageUrl = req.imageBase64;
    if (!imageUrl.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${imageUrl}`;
    }

    const userMessage: ZhipuMessage = {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: imageUrl },
        },
        {
          type: "text",
          text: DIAGNOSIS_PROMPT,
        },
      ],
    };

    const messages: ZhipuMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      userMessage,
    ];

    const aiText = await callZhipu(messages);

    // 先尝试 JSON 解析
    const parsed = parseDiagnosisJson(aiText);
    const cleaned = cleanReplyText(aiText);

    if (parsed) {
      // JSON 解析成功，用结构化数据
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

    // JSON 解析失败：用自然语言结果
    const plantName = extractPlantName(cleaned);
    const greeting = cleaned || "我看完了这张照片，但刚才的回复格式有点乱。你可以直接问我叶片状态、浇水频率或者光照需求。";
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
    let messages: ZhipuMessage[] = [];

    if (req.history && req.history.length > 0) {
      // 确保 history 以 user 开头（符合 API 规范）
      const normalized = req.history.map(h => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      }));
      // 如果第一条是 assistant，补一条 user 消息
      if (normalized[0]?.role === "assistant") {
        normalized.unshift({ role: "user", content: "请帮我看看这棵植物" });
      }
      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...normalized,
      ];
    } else {
      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: req.message },
      ];
    }

    const aiText = await callZhipu(messages);
    return cleanReplyText(aiText);
  }
}

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
    const healthStatus = normalizeHealthStatus(raw.health_status);
    const summary = toCleanString(raw.summary);

    return {
      plantName: toCleanString(raw.plant_name) || "植物",
      scientificName: toCleanString(raw.scientific_name),
      confidence: normalizeConfidence(raw.confidence),
      healthStatus,
      summary: summary || "我看完了，这株植物需要按水分、光照和盆土状态来照顾。",
      issues: toStringList(raw.issues).slice(0, 3),
      careTips: toStringList(raw.care_tips).slice(0, 4),
      nextQuestions: toStringList(raw.next_questions).slice(0, 3),
    };
  } catch {
    return null;
  }
}

function extractJsonText(text: string): string | null {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

function normalizeHealthStatus(value: unknown): "healthy" | "needs_attention" | "critical" {
  if (value === "healthy" || value === "needs_attention" || value === "critical") {
    return value;
  }
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
  return value
    .map(toCleanString)
    .filter(Boolean);
}

function cleanReplyText(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*\d+\.\s*/gm, "")
    .replace(/^\s*[-*]\s*/gm, "")
    .replace(/识别用户请求[:：]?[\s\S]*?(?=植物识别|健康状况|养护建议|$)/g, "")
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

function detectHealthStatus(text: string): "healthy" | "needs_attention" | "critical" {
  const criticalWords = ["严重", "枯死", "烂根", "紧急", "救", "死"];
  const attentionWords = ["发黄", "问题", "注意", "不太好", "需要", "建议", "可能是", "枯", "焦", "斑", "虫"];
  const healthyWords = ["状态不错", "状态良好", "长得很精神", "很健康", "不错"];

  if (criticalWords.some((w) => text.includes(w))) return "critical";
  if (healthyWords.some((w) => text.includes(w))) return "healthy";
  // 默认返回 needs_attention，不擅自说"状态良好"
  return "needs_attention";
}

export const zhipuAIService = new ZhipuAIService();
