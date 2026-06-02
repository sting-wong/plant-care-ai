import { nanoid } from "nanoid";
import type {
  AIService,
  DiagnosisRequest,
  DiagnosisResponse,
  ChatRequest,
} from "./types";

const PLANTS = [
  {
    plantName: "龟背竹",
    scientificName: "Monstera deliciosa",
    healthVariants: [
      {
        status: "healthy" as const,
        greeting:
          "这是一棵龟背竹，整体状态很不错！叶片油绿有光泽，开背也很漂亮。继续保持现在的养护方式就好，它很喜欢你现在给它的环境。对了，它放的位置光线怎么样？散射光对它来说是最舒服的。",
        issues: [],
        careTips: [
          "继续保持现在的养护方式就好",
          "每周浇水 1-2 次，保持土壤微湿",
          "避免阳光直射，散射光最适合它",
        ],
      },
      {
        status: "needs_attention" as const,
        greeting:
          "这是一棵龟背竹。整体还行，不过我注意到叶尖有点发黄，这通常是浇水过多的信号。建议你摸一下土壤，如果表面 2-3 厘米还是湿的，就先别浇了。另外检查一下盆底排水孔是否通畅，积水是龟背竹最怕的。",
        issues: ["叶尖有些发黄", "可能浇水频率偏高"],
        careTips: [
          "减少浇水频率，等土壤表面 2-3cm 干了再浇",
          "检查一下盆底排水孔是否通畅",
          "可以剪掉已经发黄的叶尖，不影响整体健康",
        ],
      },
    ],
    followUps: {
      water:
        "龟背竹喜欢湿润但不积水的环境。春夏季大概每 5-7 天浇一次，秋冬季可以延长到 10-14 天。最简单的判断方法：把手指插进土里 2-3cm，如果感觉干了就可以浇了。浇就浇透，看到盆底有水流出就行。",
      light:
        "龟背竹最喜欢明亮的散射光，比如靠近东面或北面窗户的位置。千万别放在阳光直射的地方，叶子会晒伤发黄。如果你家光线不太好，它也能适应，只是生长会慢一些，开背也会少一些。",
      fertilizer:
        "生长季（春夏）每月施一次稀释的通用液肥就够了，浓度按说明书减半。秋冬季不需要施肥，植物在休眠期消化不了那么多营养。",
      repot:
        "如果你发现根从盆底钻出来了，或者浇水后水很快就流出来（说明根太多土太少），就该换盆了。一般 1-2 年换一次，选比现在大一号的盆就行。春天换盆最好，恢复快。",
    },
  },
  {
    plantName: "绿萝",
    scientificName: "Epipremnum aureum",
    healthVariants: [
      {
        status: "healthy" as const,
        greeting:
          "这是一盆绿萝，长得很精神！藤蔓垂下来的样子很好看，叶片也很饱满。绿萝是出了名的好养，你可以偶尔给叶片喷喷水，它会更绿。想让它更茂密的话，可以把长的藤剪下来水培生根后再插回去。",
        issues: [],
        careTips: [
          "绿萝很好养，保持现在的状态就行",
          "可以偶尔给叶片喷喷水，它会更绿",
          "如果想让它更茂密，可以把长的藤剪下来水培生根后再插回去",
        ],
      },
      {
        status: "needs_attention" as const,
        greeting:
          "这是一盆绿萝。我注意到有些叶子发黄了，这个问题不大但需要关注一下。黄叶通常是浇水不当导致的，你摸摸土壤——如果一直湿湿的就是浇多了，先停几天。把已经黄透的叶子摘掉就行，让它集中精力长新叶。",
        issues: ["部分叶片发黄", "叶片有些耷拉"],
        careTips: [
          "黄叶可能是浇水不当——检查一下是浇多了还是浇少了",
          "如果土壤一直湿湿的，就是浇多了，先停几天",
          "把已经黄透的叶子摘掉，让植物集中精力长新叶",
        ],
      },
    ],
    followUps: {
      water:
        "绿萝对水分不太挑剔，但最怕积水烂根。一般等盆土表面干了再浇，大概一周一次。冬天可以更少。一个小技巧：如果叶子开始微微卷曲，就是在告诉你它渴了。",
      light:
        "绿萝是出了名的耐阴植物，卫生间、办公桌这种光线不好的地方都能活。但如果想让它长得快、叶子大，还是给它一些散射光比较好。注意别晒太阳，会晒伤。",
      fertilizer:
        "绿萝不太需要施肥，春夏季每 2-3 周给一点稀释的液肥就够了。如果你经常忘记也没关系，它很皮实。",
      repot:
        "绿萝根系不算特别发达，一般 1-2 年换一次盆就行。用普通的营养土就可以，加点珍珠岩增加透气性更好。",
    },
  },
  // PLACEHOLDER_MORE_PLANTS
  {
    plantName: "多肉（景天科）",
    scientificName: "Echeveria sp.",
    healthVariants: [
      {
        status: "healthy" as const,
        greeting:
          "哇，这是一棵多肉！看起来很饱满紧凑，颜色也很正，养得很好呀。",
        issues: [],
        careTips: [
          "多肉最重要的就是少浇水、多晒太阳",
          "保持通风，避免闷湿环境",
          "现在的状态很好，继续保持就行",
        ],
      },
      {
        status: "needs_attention" as const,
        greeting:
          "这是一棵多肉植物。我看到它有些徒长的迹象，可能需要调整一下养护方式。",
        issues: ["株型有些松散（徒长）", "颜色偏绿，缺少光照"],
        careTips: [
          "需要增加光照时间，每天至少 4-6 小时散射光",
          "减少浇水频率，多肉宁干勿湿",
          "已经徒长的部分可以砍头重新扦插",
        ],
      },
    ],
    followUps: {
      water:
        "多肉最怕浇水多！一般等土完全干透了再浇，春秋季大概 10-14 天一次，夏天休眠期和冬天可以一个月一次甚至更少。记住一个原则：不确定要不要浇的时候，就别浇。",
      light:
        "多肉是真的需要阳光！每天至少 4-6 小时的光照，南面窗台是最好的位置。光照充足它才会上色变漂亮，光照不够就会徒长变丑。夏天正午的暴晒要避免，会晒伤。",
      fertilizer:
        "多肉对肥料需求很低，生长季每月一次稀薄的多肉专用肥就够了。冬夏休眠期完全不需要施肥。",
      repot:
        "多肉换盆用颗粒土为主（70%颗粒+30%泥炭），透气排水是关键。换盆后不要马上浇水，等 3-5 天伤口愈合了再浇。",
    },
  },
  {
    plantName: "琴叶榕",
    scientificName: "Ficus lyrata",
    healthVariants: [
      {
        status: "healthy" as const,
        greeting:
          "这是一棵琴叶榕！大叶子很有气势，叶片颜色深绿有光泽，看起来很健康。",
        issues: [],
        careTips: [
          "琴叶榕喜欢稳定的环境，尽量别经常挪动它",
          "定期用湿布擦拭叶片，保持光合作用效率",
          "保持环境温暖，它怕冷",
        ],
      },
      {
        status: "needs_attention" as const,
        greeting:
          "这是一棵琴叶榕。我注意到叶片边缘有些问题，琴叶榕确实是比较娇气的植物，不过别担心，我来帮你分析。",
        issues: ["叶片边缘有褐色斑点", "下部叶片有脱落迹象"],
        careTips: [
          "褐斑通常是浇水不规律导致的，试着建立固定的浇水节奏",
          "检查是否有冷风直吹，琴叶榕很怕温度骤变",
          "底部老叶偶尔脱落是正常的，但如果大量掉叶就要注意了",
        ],
      },
    ],
    followUps: {
      water:
        "琴叶榕喜欢规律的浇水——每次等土壤上面 3-5cm 干了再浇透。它最怕的是忽干忽湿，所以尽量保持一个稳定的节奏。大概一周一次，但要根据你家的温度湿度调整。",
      light:
        "琴叶榕需要充足的散射光，靠近大窗户的位置最好。它能接受一些早晨的直射阳光，但中午的强光会晒伤叶片。光线不够的话它会长得歪歪扭扭去找光。",
      fertilizer:
        "生长季每两周施一次稀释的液肥，它是大叶植物，对氮肥需求比较高。秋冬停肥。",
      repot:
        "琴叶榕不喜欢被打扰，除非根真的长满了盆，否则不要轻易换盆。换盆后可能会掉几片叶子，这是正常的应激反应，别慌。",
    },
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function matchTopic(message: string): string | null {
  const keywords: Record<string, string[]> = {
    water: ["浇水", "水", "多久浇", "浇多少", "干", "湿", "积水"],
    light: ["光", "晒", "阳光", "光照", "太阳", "阴", "位置", "放哪"],
    fertilizer: ["肥", "施肥", "营养", "肥料"],
    repot: ["换盆", "盆", "土", "移栽", "根"],
  };

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some((w) => message.includes(w))) {
      return topic;
    }
  }
  return null;
}

export class MockAIService implements AIService {
  private conversations: Map<string, (typeof PLANTS)[number]> = new Map();

  async diagnose(_req: DiagnosisRequest): Promise<DiagnosisResponse> {
    await delay(randomBetween(1500, 2500));

    const plant = PLANTS[randomBetween(0, PLANTS.length - 1)];
    const variant =
      plant.healthVariants[randomBetween(0, plant.healthVariants.length - 1)];
    const conversationId = nanoid(10);

    this.conversations.set(conversationId, plant);

    return {
      plantName: variant.greeting.includes(plant.plantName)
        ? plant.plantName
        : plant.plantName,
      scientificName: plant.scientificName,
      confidence: randomBetween(85, 98) / 100,
      healthStatus: variant.status,
      issues: variant.issues,
      careTips: variant.careTips,
      greeting: variant.greeting,
      conversationId,
    };
  }

  async chat(req: ChatRequest): Promise<string> {
    await delay(randomBetween(800, 1500));

    const plant = this.conversations.get(req.conversationId);
    if (!plant) {
      return "抱歉，我找不到这次对话的上下文了。要不你重新拍一张照片，我再帮你看看？";
    }

    const topic = matchTopic(req.message);
    if (topic && plant.followUps[topic as keyof typeof plant.followUps]) {
      return plant.followUps[topic as keyof typeof plant.followUps];
    }

    const genericResponses = [
      `关于你的${plant.plantName}，还有什么想了解的吗？你可以问我浇水频率、光照需求、施肥方法或者换盆时机，我都能帮你解答。`,
      `好问题！不过我需要更多信息才能给你准确的建议。你能具体描述一下你观察到的情况吗？比如叶片颜色变化、土壤状态、或者最近的养护习惯。`,
      `你的${plant.plantName}整体来说是一种比较好养的植物。如果你有具体的养护问题，比如浇水、光照、施肥这些，随时问我！`,
    ];

    return genericResponses[randomBetween(0, genericResponses.length - 1)];
  }
}

// 单例
export const mockAIService = new MockAIService();
