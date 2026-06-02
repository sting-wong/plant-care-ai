# V2.0 开发指令 - AI API 接入（国内直连方案）

## 问题

当前使用的中转 API 不稳定，所有请求都报 502。需要切换到国内模型官方 API，直连不走代理。

## 推荐方案：智谱 GLM-4V

### 为什么选智谱

- 支持图片识别（多模态），能看植物照片
- 国内直连，不需要代理，稳定
- API 格式兼容 OpenAI，改动最小
- 注册送免费额度，后续价格便宜（约 ¥0.05/次调用）
- 中文能力强，适合植物养护场景

### 注册步骤

1. 打开 https://open.bigmodel.cn/
2. 注册账号（手机号即可）
3. 进入控制台 → API Keys → 创建一个 key
4. 新用户有免费额度，够测试用

---

## 代码改动

### 1. 新建 `src/lib/ai/zhipu-service.ts`

```typescript
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

interface ZhipuMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

// 存储对话历史
const conversations = new Map<string, ZhipuMessage[]>();

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
      model: "glm-4v-flash",  // 免费的多模态模型
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
  return data.choices?.[0]?.message?.content || "抱歉，我暂时无法回复。";
}

export class ZhipuAIService implements AIService {
  async diagnose(req: DiagnosisRequest): Promise<DiagnosisResponse> {
    const conversationId = nanoid(10);

    // 处理 base64 图片
    // 智谱 API 接受 data URL 格式
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
          text: "请帮我看看这棵植物的状态，识别它的种类，判断健康情况，给出养护建议。",
        },
      ],
    };

    const messages: ZhipuMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      userMessage,
    ];

    const aiText = await callZhipu(messages);

    // 存储对话历史（图片消息简化为文字，节省 token）
    conversations.set(conversationId, [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "[用户发送了一张植物照片]" },
      { role: "assistant", content: aiText },
    ]);

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
    const history = conversations.get(req.conversationId) || [
      { role: "system" as const, content: SYSTEM_PROMPT },
    ];

    history.push({ role: "user", content: req.message });

    const aiText = await callZhipu(history);

    history.push({ role: "assistant", content: aiText });
    conversations.set(req.conversationId, history);

    return aiText;
  }
}

function extractPlantName(text: string): string | null {
  const patterns = [
    /这是一[棵盆株颗](.{1,8})[，。！,!]/,
    /看起来是(.{1,8})[，。！,!]/,
    /应该是(.{1,8})[，。！,!]/,
    /是一[棵盆株颗](.{1,8})[，。！,!]/,
    /这是(.{2,6})[，。！,!]/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function detectHealthStatus(text: string): "healthy" | "needs_attention" | "critical" {
  const criticalWords = ["严重", "枯死", "烂根", "紧急", "救", "死"];
  const attentionWords = ["发黄", "问题", "注意", "不太好", "需要", "建议", "可能是", "枯", "焦", "斑", "虫"];

  if (criticalWords.some((w) => text.includes(w))) return "critical";
  if (attentionWords.some((w) => text.includes(w))) return "needs_attention";
  return "healthy";
}

export const zhipuAIService = new ZhipuAIService();
```

### 2. 修改 `src/lib/ai/index.ts`

```typescript
import { zhipuAIService } from "./zhipu-service";
import type { AIService } from "./types";

// 使用智谱 GLM-4V（国内直连，支持图片识别）
export const aiService: AIService = zhipuAIService;

export type { DiagnosisRequest, DiagnosisResponse, ChatMessage, ChatRequest, AIService } from "./types";
```

### 3. 修改 `.env.local`

```env
# 智谱 AI API Key（从 https://open.bigmodel.cn/ 获取）
ZHIPU_API_KEY=你的智谱API密钥

# 以下旧配置可以注释掉
# ANTHROPIC_API_KEY=xxx
# OPENAI_API_KEY=xxx
# OPENAI_BASE_URL=xxx
```

---

## 模型选择说明

智谱有多个模型可选：

| 模型 | 图片支持 | 价格 | 说明 |
|------|---------|------|------|
| glm-4v-flash | ✅ | 免费 | 推荐先用这个测试，速度快 |
| glm-4v-plus | ✅ | ¥0.01/千token | 效果更好，正式使用推荐 |
| glm-4v | ✅ | ¥0.05/千token | 最强，但贵一些 |

**建议先用 `glm-4v-flash` 跑通流程，确认没问题后再考虑升级到 `glm-4v-plus`。**

---

## 图片大小注意

智谱 API 对图片有大小限制（一般 10MB 以内）。当前项目已经有 `compressImage` 函数做压缩，应该没问题。如果遇到图片太大的报错，可以在 `compressImage` 里把质量参数调低：

```typescript
// src/lib/utils.ts 中的 compressImage
// 如果图片太大，把 quality 从 0.8 降到 0.6
canvas.toBlob(resolve, 'image/jpeg', 0.6);
```

---

## 测试步骤

1. 去 https://open.bigmodel.cn/ 注册并获取 API Key
2. 在 `.env.local` 中配置 `ZHIPU_API_KEY`
3. 修改 `src/lib/ai/index.ts` 切换到智谱服务
4. 重启 dev server（`npm run dev`）
5. 拍照测试

---

## 备选方案：通义千问

如果智谱有问题，通义千问也是好选择：

- 注册地址：https://dashscope.console.aliyun.com/
- 模型：qwen-vl-plus（支持图片）
- API 格式也兼容 OpenAI

需要的话我可以再写一份通义千问的接入代码。

---

*文档版本：v1.0*
*创建日期：2026-06-01*
