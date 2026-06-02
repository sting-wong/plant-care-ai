import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type {
  AIService,
  DiagnosisRequest,
  DiagnosisResponse,
  ChatRequest,
} from "./types";

const SYSTEM_PROMPT = `你是一个专业且友好的植物养护顾问，名叫"小植"。你的任务是帮助用户照顾好他们的植物。

你的性格特点：
- 温暖友好，像一个懂植物的好朋友
- 说话简洁明了，不啰嗦
- 给出具体可操作的建议，而不是泛泛而谈
- 适当使用轻松的语气，但不过度卖萌

当用户发送植物照片时，你需要：
1. 首先识别植物种类（如果能识别的话）
2. 观察植物的健康状态
3. 如果发现问题，说明可能的原因
4. 给出具体的养护建议（浇水频率、光照需求、施肥建议等）
5. 如果照片不够清晰或需要更多信息，主动询问

回复格式要求：
- 不要使用 markdown 标题或列表符号
- 用自然的对话语气
- 每次回复控制在 200 字以内
- 如果信息量大，分点说但用自然语言（"第一个可能是...另外..."）

示例回复风格：
"这是一棵绿萝，整体状态还不错！不过我注意到叶尖有点发黄，这通常是浇水过多的信号。建议你摸一下土壤，如果表面 2-3 厘米还是湿的，就先别浇了。绿萝喜欢土壤微干再浇透，大概每周一次就够了。另外它放的位置光线怎么样？"`;

// 存储对话历史（服务端内存，重启会丢失）
const conversations = new Map<
  string,
  Anthropic.MessageParam[]
>();

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here") {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  const baseURL = process.env.ANTHROPIC_BASE_URL || undefined;
  return new Anthropic({ apiKey, baseURL });
}

export class ClaudeAIService implements AIService {
  async diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse> {
    const client = getClient();
    const conversationId = nanoid(10);

    // 构建带图片的消息
    const imageData = req.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mediaType = req.mimeType === "image/png" ? "image/png" : "image/jpeg";

    const userMessage: Anthropic.MessageParam = {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: imageData,
          },
        },
        {
          type: "text",
          text: "请帮我看看这棵植物的状态，识别它的种类，判断健康情况，给出养护建议。",
        },
      ],
    };

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [userMessage],
    });

    const aiText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 存储对话历史
    conversations.set(conversationId, [
      userMessage,
      { role: "assistant", content: aiText },
    ]);

    // 从回复中尝试提取植物名称（简单启发式）
    const plantName = extractPlantName(aiText);

    return {
      plantName: plantName || "植物",
      scientificName: "",
      confidence: 0.9,
      healthStatus: detectHealthStatus(aiText),
      issues: [],
      careTips: [],
      greeting: aiText,
      conversationId,
    };
  }

  async chat(req: ChatRequest): Promise<string> {
    const client = getClient();
    const history = conversations.get(req.conversationId) || [];

    // 追加用户消息
    history.push({ role: "user", content: req.message });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const aiText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 更新对话历史
    history.push({ role: "assistant", content: aiText });
    conversations.set(req.conversationId, history);

    return aiText;
  }
}

// 从 AI 回复中提取植物名称
function extractPlantName(text: string): string | null {
  const patterns = [
    /这是一[棵盆株颗](.{1,6})[，。！]/,
    /看起来是(.{1,6})[，。！]/,
    /应该是(.{1,6})[，。！]/,
    /是一[棵盆株颗](.{1,6})[，。！]/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

// 从 AI 回复中判断健康状态
function detectHealthStatus(
  text: string
): "healthy" | "needs_attention" | "critical" {
  const criticalWords = ["严重", "枯死", "烂根", "紧急", "救"];
  const attentionWords = ["发黄", "问题", "注意", "不太好", "需要", "建议", "可能是"];

  if (criticalWords.some((w) => text.includes(w))) return "critical";
  if (attentionWords.some((w) => text.includes(w))) return "needs_attention";
  return "healthy";
}

export const claudeAIService = new ClaudeAIService();
