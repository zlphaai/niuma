import { TimeLeft, WorkStatus, DailyProgress } from '../types';

export const calculateWeekendCountdown = (endTime: string): { timeLeft: TimeLeft; isWeekend: boolean } => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
  const [endH, endM] = endTime.split(':').map(Number);

  // Check if currently weekend
  // Friday (5) after endTime, Saturday (6), Sunday (0)
  let isWeekend = false;

  if (currentDay === 6 || currentDay === 0) {
    isWeekend = true;
  } else if (currentDay === 5) {
    const todayEnd = new Date();
    todayEnd.setHours(endH, endM, 0, 0);
    if (now >= todayEnd) {
      isWeekend = true;
    }
  }

  if (isWeekend) {
    return {
      isWeekend: true,
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 }
    };
  }

  // Calculate target date (Next Friday at endTime)
  const targetDate = new Date();
  // If today is Friday (before endTime), target is today.
  // If Mon-Thu, target is this Friday.
  // diff = 5 - currentDay.
  // Mon(1) -> 4 days later. Tue(2) -> 3 days later.
  const dayDiff = 5 - currentDay; 
  
  targetDate.setDate(now.getDate() + dayDiff);
  targetDate.setHours(endH, endM, 0, 0);

  const difference = targetDate.getTime() - now.getTime();

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    isWeekend: false,
    timeLeft: { days, hours, minutes, seconds, totalSeconds: Math.floor(difference / 1000) }
  };
};

export const calculateDailyProgress = (startTime: string, endTime: string): DailyProgress => {
  const now = new Date();
  
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startDate = new Date();
  startDate.setHours(startH, startM, 0, 0);

  const endDate = new Date();
  endDate.setHours(endH, endM, 0, 0);
  
  // Handle night shift (e.g. start 22:00, end 06:00)
  if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
  }

  const totalWorkMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = now.getTime() - startDate.getTime();

  if (now < startDate) {
    // Before work
    const diff = startDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      status: WorkStatus.NOT_STARTED,
      percentage: 0,
      timeLeftStr: `距离上班还有 ${hours}小时 ${minutes}分`
    };
  } else if (now >= endDate) {
    // After work
    return {
      status: WorkStatus.FINISHED,
      percentage: 100,
      timeLeftStr: '今日牛马任务已完成'
    };
  } else {
    // Working
    const percentage = Math.min(100, Math.max(0, (elapsedMs / totalWorkMs) * 100));
    const remainingMs = endDate.getTime() - now.getTime();
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return {
      status: WorkStatus.WORKING,
      percentage,
      timeLeftStr: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  }
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 5) return "夜深了，牛马还在加班吗？";
  if (hour < 9) return "该去打卡了，牛马！";
  if (hour < 12) return "上午好，记得摸鱼。";
  if (hour < 14) return "午饭吃饱好干活。";
  if (hour < 18) return "坚持住，胜利在望。";
  return "下班不积极，思想有问题。";
};

export const getRandomQuote = (): string => {
  const quotes = [
    "虽然我上班，但我精神是自由的（大概）。",
    "不要大声责骂年轻人，他们会立刻辞职。但是你可以往死里骂中年人，他们有房贷车贷。",
    "公司是老板的，身体是自己的。",
    "摸鱼是工作的一部分，不摸鱼怎么对得起那点工资。",
    "只要我够废，老板就利用不了我。",
    "我爱工作，工作使我快乐（且贫穷）。",
    "世上无难事，只要肯放弃。",
    "周五不喝酒，人生路白走。",
    "所有的苦难都会过去的，除了周一。"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};