
// Simple pseudo-random number generator with seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const GOODS = [
  "带薪拉屎", "拒绝需求", "准点下班", "点外卖", 
  "摸鱼", "重启电脑", "写文档", "冥想", 
  "更新简历", "逛闲鱼", "喝奶茶", "私信吐槽"
];

const BADS = [
  "上线发布", "开会", "改Bug", "和老板对视", 
  "立Flag", "加班", "不仅限于", "回复邮件", 
  "借钱给同事", "相信画饼", "主动揽活"
];

export const getDailyAlmanac = () => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
  const seed = parseInt(dateStr, 10);

  // Use seed to pick items deterministically for the day
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 1);
  const r3 = seededRandom(seed + 2);
  const r4 = seededRandom(seed + 3);

  const good1 = GOODS[Math.floor(r1 * GOODS.length)];
  let good2 = GOODS[Math.floor(r2 * GOODS.length)];
  while (good2 === good1) {
    good2 = GOODS[Math.floor(seededRandom(seed + 4) * GOODS.length)];
  }

  const bad1 = BADS[Math.floor(r3 * BADS.length)];
  let bad2 = BADS[Math.floor(r4 * BADS.length)];
  while (bad2 === bad1) {
    bad2 = BADS[Math.floor(seededRandom(seed + 5) * BADS.length)];
  }

  return {
    date: today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
    goods: [good1, good2],
    bads: [bad1, bad2]
  };
};
