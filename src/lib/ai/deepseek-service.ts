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

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

// 存储对话历史
const conversations = new Map<string, ChatMessage[]>();

async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not configured");
  }

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status} ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "抱歉，我暂时无法回复。";
}

export class DeepSeekAIService implements AIService {
  async diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse> {
    const conversationId = nanoid(10);

    // DeepSeek 目前不支持图片输入，用文字描述代替
    // 如果用的是 deepseek-chat，只能做文字对话
    const imageNote = req.imageBase64 ? "（用户上传了一张植物照片）" : "";

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `${imageNote}请帮我看看这棵植物的状态。由于你暂时无法直接看到图片，请先问我几个问题来帮助判断：比如植物的种类、叶片颜色、是否有异常等。这样你就能给出准确的养护建议了。`,
      },
    ];

    const aiText = await callDeepSeek(messages);

    // 存储对话历史
    conversations.set(conversationId, [
      ...messages,
      { role: "assistant", content: aiText },
    ]);

    return {
      plantName: "植物",
      scientificName: "",
      confidence: 0,
      healthStatus: "needs_attention",
      issues: [],
      careTips: [],
      greeting: aiText,
      conversationId,
    };
  }

  async chat(req: ChatRequest): Promise<string> {
    const history = conversations.get(req.conversationId) || [
      { role: "system" as const, content: SYSTEM_PROMPT },
    ];

    history.push({ role: "user", content: req.message });

    const aiText = await callDeepSeek(history);

    history.push({ role: "assistant", content: aiText });
    conversations.set(req.conversationId, history);

    return aiText;
  }
}

export const deepseekAIService = new DeepSeekAIService();
