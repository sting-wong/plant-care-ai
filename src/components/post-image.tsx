"use client";

import { PlantIllustrationById } from "./plant-illustrations";

const BG_GRADIENTS = [
  "from-green-50 to-emerald-50",
  "from-amber-50 to-yellow-50",
  "from-blue-50 to-cyan-50",
  "from-pink-50 to-rose-50",
  "from-purple-50 to-indigo-50",
];

const PLANT_TAG_TO_ID: Record<string, string> = {
  "龟背竹": "monstera",
  "绿萝": "pothos",
  "多肉": "echeveria",
  "琴叶榕": "ficus-lyrata",
  "虎皮兰": "sansevieria",
  "吊兰": "chlorophytum",
  "发财树": "pachira",
  "仙人掌": "cactus",
  "芦荟": "aloe",
  "文竹": "asparagus-fern",
  "铜钱草": "pilea",
  "富贵竹": "lucky-bamboo",
  "春羽": "monstera",
  "常春藤": "ivy",
};

export function PostImage({ plantTag, seed }: { plantTag?: string; seed: number }) {
  const bg = BG_GRADIENTS[seed % BG_GRADIENTS.length];
  const plantId = plantTag ? PLANT_TAG_TO_ID[plantTag] || "monstera" : "monstera";

  return (
    <div className={`w-full aspect-[16/9] rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`}>
      <PlantIllustrationById id={plantId} className="w-20 h-20 opacity-80" />
    </div>
  );
}
