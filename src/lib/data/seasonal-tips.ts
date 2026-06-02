export interface SeasonalTip {
  id: string;
  month: number;
  title: string;
  content: string;
  plants: string[];
}

export const SEASONAL_TIPS: SeasonalTip[] = [
  {
    id: "jan-1",
    month: 1,
    title: "冬季保暖要点",
    content: "大多数热带植物怕冷，室温低于15°C时要注意保暖。远离窗户冷风口，减少浇水频率，停止施肥让植物休眠。",
    plants: ["龟背竹", "绿萝", "发财树"],
  },
  {
    id: "feb-1",
    month: 2,
    title: "早春准备",
    content: "气温回升前做好准备：检查根系是否需要换盆，修剪枯叶枯枝，为即将到来的生长季做准备。",
    plants: ["琴叶榕", "橡皮树", "散尾葵"],
  },
  {
    id: "mar-1",
    month: 3,
    title: "春季换盆黄金期",
    content: "春天是换盆的最佳时机。如果根系已经长满盆，选大一号的盆，换上新鲜营养土，植物会迎来爆发式生长。",
    plants: ["龟背竹", "琴叶榕", "散尾葵"],
  },
  {
    id: "apr-1",
    month: 4,
    title: "开始恢复施肥",
    content: "植物进入生长旺季，可以恢复正常施肥了。从稀薄浓度开始，每2-3周一次，观察植物反应再调整。",
    plants: ["绿萝", "吊兰", "龟背竹"],
  },
  {
    id: "may-1",
    month: 5,
    title: "防虫季来了",
    content: "气温升高，蚜虫、红蜘蛛开始活跃。定期检查叶片背面，发现虫害及时用肥皂水或专用药剂处理。",
    plants: ["常春藤", "文竹", "白掌"],
  },
  {
    id: "jun-1",
    month: 6,
    title: "夏季浇水要点",
    content: "高温天气蒸发快，但不要盲目增加浇水频率。早晚浇水最佳，避免正午浇水导致根部蒸煮。观叶植物可以增加叶面喷雾。",
    plants: ["龟背竹", "绿萝", "琴叶榕"],
  },
  {
    id: "jun-2",
    month: 6,
    title: "通风防闷根",
    content: "夏季闷热潮湿，是烂根高发期。确保盆底排水通畅，适当增加通风。多肉植物进入休眠期，大幅减少浇水。",
    plants: ["多肉", "仙人掌", "芦荟"],
  },
  {
    id: "jul-1",
    month: 7,
    title: "遮阳防晒",
    content: "盛夏阳光强烈，即使喜光植物也要避免正午暴晒。可以用纱帘过滤阳光，或将植物移到散射光位置。",
    plants: ["琴叶榕", "文竹", "白掌"],
  },
  {
    id: "aug-1",
    month: 8,
    title: "高温期养护",
    content: "持续高温下植物生长放缓是正常的。保持通风，避免闷热积水。可以在花盆周围放水盘增加局部湿度。",
    plants: ["散尾葵", "龟背竹", "鹤望兰"],
  },
  {
    id: "sep-1",
    month: 9,
    title: "秋季施肥末班车",
    content: "入秋后抓紧最后的施肥窗口，帮植物储备过冬养分。10月后逐渐停肥，让植物准备进入休眠。",
    plants: ["龟背竹", "琴叶榕", "橡皮树"],
  },
  {
    id: "oct-1",
    month: 10,
    title: "入冬准备",
    content: "气温下降，开始减少浇水频率。把怕冷的植物从阳台移到室内，检查窗户密封性，避免冷风直吹。",
    plants: ["发财树", "绿萝", "白掌"],
  },
  {
    id: "nov-1",
    month: 11,
    title: "冬季减水",
    content: "大部分植物进入休眠或半休眠状态，新陈代谢减慢。浇水频率减半，宁干勿湿，避免低温积水烂根。",
    plants: ["虎皮兰", "仙人掌", "芦荟"],
  },
  {
    id: "dec-1",
    month: 12,
    title: "暖气房加湿",
    content: "北方暖气房空气极度干燥，对植物伤害很大。使用加湿器，或在植物周围放水盘，定期给叶片喷雾。",
    plants: ["散尾葵", "文竹", "龟背竹"],
  },
];

export function getCurrentSeasonalTips(): SeasonalTip[] {
  const currentMonth = new Date().getMonth() + 1;
  return SEASONAL_TIPS.filter((tip) => tip.month === currentMonth);
}
