export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    plantCount: number;
  };
  content: string;
  images: string[];
  plantTag?: string;
  topic?: string;
  likes: number;
  comments: Comment[];
  createdAt: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: number;
}

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: { name: "小花花", avatar: "🌸", plantCount: 12 },
    content: "我的龟背竹终于开背了！等了三个月，今天早上发现新叶展开的时候简直太开心了。分享一下这个激动的时刻！",
    images: [],
    plantTag: "龟背竹",
    topic: "晒植物",
    likes: 23,
    comments: [
      { id: "c1", author: { name: "绿植达人", avatar: "🌿" }, content: "恭喜！开背的感觉太棒了", createdAt: NOW - 1 * HOUR },
      { id: "c2", author: { name: "养花新手", avatar: "🌱" }, content: "好羡慕，我的还没动静", createdAt: NOW - 30 * 60000 },
    ],
    createdAt: NOW - 2 * HOUR,
    liked: false,
  },
  {
    id: "post-2",
    author: { name: "绿植新手", avatar: "🌱", plantCount: 3 },
    content: "求助！我的绿萝叶子全黄了，是不是浇水太多了？买回来才两周，之前每天都浇水来着...",
    images: [],
    plantTag: "绿萝",
    topic: "新手求助",
    likes: 8,
    comments: [
      { id: "c3", author: { name: "老园丁", avatar: "👨‍🌾" }, content: "每天浇水太多了！绿萝喜欢土壤微干再浇，一周一次就够了", createdAt: NOW - 4 * HOUR },
      { id: "c4", author: { name: "小花花", avatar: "🌸" }, content: "先停水几天，把黄叶摘掉，应该能救回来", createdAt: NOW - 3 * HOUR },
      { id: "c5", author: { name: "植物医生", avatar: "💊" }, content: "检查一下根部有没有烂，如果根还是白色的就没问题", createdAt: NOW - 2 * HOUR },
    ],
    createdAt: NOW - 5 * HOUR,
    liked: false,
  },
  {
    id: "post-3",
    author: { name: "多肉控", avatar: "🌵", plantCount: 28 },
    content: "入坑多肉一年了，从3盆变成了28盆...阳台已经放不下了，但是看到好看的还是忍不住买。这是我最近的多肉角落，大家觉得怎么样？",
    images: [],
    plantTag: "多肉",
    topic: "晒植物",
    likes: 45,
    comments: [
      { id: "c6", author: { name: "同道中人", avatar: "🪴" }, content: "太美了！请问最右边那个是什么品种？", createdAt: NOW - 8 * HOUR },
      { id: "c7", author: { name: "多肉控", avatar: "🌵" }, content: "那个是桃蛋，养了半年终于上色了", createdAt: NOW - 7 * HOUR },
    ],
    createdAt: NOW - 10 * HOUR,
    liked: true,
  },
  {
    id: "post-4",
    author: { name: "老园丁", avatar: "👨‍🌾", plantCount: 35 },
    content: "分享一个夏季防烂根的小技巧：在盆底垫一层陶粒，大概2-3cm厚，这样即使浇水多了也不容易积水。另外夏天浇水最好在早晚，避免正午高温时浇水。",
    images: [],
    topic: "养护心得",
    likes: 67,
    comments: [
      { id: "c8", author: { name: "学习中", avatar: "📚" }, content: "学到了！马上去买陶粒", createdAt: NOW - 1 * DAY },
      { id: "c9", author: { name: "绿植新手", avatar: "🌱" }, content: "请问陶粒在哪里买比较好？", createdAt: NOW - 20 * HOUR },
      { id: "c10", author: { name: "老园丁", avatar: "👨‍🌾" }, content: "网上搜园艺陶粒就行，很便宜的", createdAt: NOW - 18 * HOUR },
    ],
    createdAt: NOW - 1 * DAY,
    liked: false,
  },
  {
    id: "post-5",
    author: { name: "琴叶榕妈妈", avatar: "🌳", plantCount: 8 },
    content: "我的琴叶榕又掉叶子了...这已经是这个月第三片了。是不是我家光线不够？它放在客厅离窗户大概2米的位置。",
    images: [],
    plantTag: "琴叶榕",
    topic: "新手求助",
    likes: 12,
    comments: [
      { id: "c11", author: { name: "老园丁", avatar: "👨‍🌾" }, content: "2米有点远了，琴叶榕需要明亮的散射光，建议移到窗边", createdAt: NOW - 2 * DAY },
      { id: "c12", author: { name: "小花花", avatar: "🌸" }, content: "还有可能是浇水不规律，琴叶榕最怕忽干忽湿", createdAt: NOW - 2 * DAY + 3 * HOUR },
    ],
    createdAt: NOW - 2 * DAY,
    liked: false,
  },
  {
    id: "post-6",
    author: { name: "阳台花园", avatar: "🌺", plantCount: 20 },
    content: "今天给所有植物做了一次大扫除：擦叶片、修剪枯叶、检查有没有虫。花了一个下午但是看着干干净净的植物们心情超好！建议大家每个月至少做一次。",
    images: [],
    topic: "养护心得",
    likes: 34,
    comments: [
      { id: "c13", author: { name: "懒人养花", avatar: "😴" }, content: "一个下午...我做不到哈哈", createdAt: NOW - 3 * DAY },
    ],
    createdAt: NOW - 3 * DAY,
    liked: true,
  },
  {
    id: "post-7",
    author: { name: "水培爱好者", avatar: "💧", plantCount: 15 },
    content: "分享我的水培角落！富贵竹、铜钱草、绿萝都可以水培，干净又好看。水培的好处是不用担心浇水问题，换水就行。新手强烈推荐从水培开始！",
    images: [],
    plantTag: "富贵竹",
    topic: "养护心得",
    likes: 29,
    comments: [
      { id: "c14", author: { name: "绿植新手", avatar: "🌱" }, content: "水培多久换一次水？", createdAt: NOW - 4 * DAY },
      { id: "c15", author: { name: "水培爱好者", avatar: "💧" }, content: "夏天3-5天，冬天一周一次就行", createdAt: NOW - 4 * DAY + 2 * HOUR },
    ],
    createdAt: NOW - 4 * DAY,
    liked: false,
  },
  {
    id: "post-8",
    author: { name: "植物医生", avatar: "💊", plantCount: 18 },
    content: "科普一下：叶片发黄不一定是浇水问题！常见原因有：1.自然老化（底部老叶）2.光照不足 3.缺肥 4.浇水过多 5.温度过低。要根据具体情况判断，不要一黄就停水。",
    images: [],
    topic: "养护心得",
    likes: 89,
    comments: [
      { id: "c16", author: { name: "学习中", avatar: "📚" }, content: "太有用了，收藏！", createdAt: NOW - 5 * DAY },
      { id: "c17", author: { name: "绿植新手", avatar: "🌱" }, content: "原来不一定是浇水问题啊", createdAt: NOW - 5 * DAY + 1 * HOUR },
    ],
    createdAt: NOW - 5 * DAY,
    liked: true,
  },
  {
    id: "post-9",
    author: { name: "新手入坑", avatar: "🆕", plantCount: 2 },
    content: "第一次养植物！买了一盆虎皮兰和一盆绿萝，听说这两个最好养。请问有什么需要注意的吗？",
    images: [],
    topic: "新手求助",
    likes: 15,
    comments: [
      { id: "c18", author: { name: "老园丁", avatar: "👨‍🌾" }, content: "选得好！这两个确实最适合新手。记住一个原则：宁干勿湿，不确定要不要浇的时候就别浇", createdAt: NOW - 6 * DAY },
      { id: "c19", author: { name: "小花花", avatar: "🌸" }, content: "虎皮兰真的超级好养，我一个月忘记浇水它都没事", createdAt: NOW - 6 * DAY + 2 * HOUR },
    ],
    createdAt: NOW - 6 * DAY,
    liked: false,
  },
  {
    id: "post-10",
    author: { name: "春羽大户", avatar: "🌴", plantCount: 6 },
    content: "我的春羽又长新叶了！这棵是去年买的小苗，现在已经长到快一米高了。春羽真的是生长速度冠军，夏天几乎每周都能看到变化。",
    images: [],
    plantTag: "春羽",
    topic: "晒植物",
    likes: 31,
    comments: [
      { id: "c20", author: { name: "多肉控", avatar: "🌵" }, content: "春羽长得也太快了吧！", createdAt: NOW - 7 * DAY },
    ],
    createdAt: NOW - 7 * DAY,
    liked: false,
  },
];

export const TOPICS = ["推荐", "晒植物", "新手求助", "养护心得"];
