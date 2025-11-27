import React, { useState, useEffect } from 'react';

interface SalaryCardProps {
  monthlySalary: number;
  startTime: string;
  endTime: string;
  isMoyuMode: boolean;
}

const SalaryCard: React.FC<SalaryCardProps> = ({ monthlySalary, startTime, endTime, isMoyuMode }) => {
  const [earnedToday, setEarnedToday] = useState(0);

  useEffect(() => {
    // Standard working days per month in China is roughly 21.75
    const dailySalary = monthlySalary / 21.75;
    
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const now = new Date();
    const startDate = new Date();
    startDate.setHours(startH, startM, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(endH, endM, 0, 0);

    // Handle night shift
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const totalWorkMs = endDate.getTime() - startDate.getTime();
    
    // Per ms salary
    const salaryPerMs = dailySalary / totalWorkMs;

    const updateSalary = () => {
      const currentTime = new Date();
      
      if (currentTime < startDate) {
        setEarnedToday(0);
      } else if (currentTime >= endDate) {
        setEarnedToday(dailySalary);
      } else {
        const elapsedMs = currentTime.getTime() - startDate.getTime();
        setEarnedToday(elapsedMs * salaryPerMs);
      }
    };

    // Update immediately
    updateSalary();

    // Update frequently for smooth visual effect
    const timer = setInterval(updateSalary, 100);

    return () => clearInterval(timer);
  }, [monthlySalary, startTime, endTime]);

  // Format to 4 decimal places for the "ticking" effect
  const displayAmount = earnedToday.toFixed(4);
  const [integerPart, decimalPart] = displayAmount.split('.');

  return (
    <div className="bg-white border border-amber-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.2)] transition-all duration-500">
      
      {/* Background Icon Decoration */}
      <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 rotate-12 pointer-events-none text-amber-500">
        💰
      </div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            💴 今日搞钱进度
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
             {isMoyuMode ? '摸鱼也能赚钱，赚翻了！' : '您的时间非常值钱'}
          </p>
        </div>
        <div className="bg-amber-50 p-3 rounded-2xl text-amber-500 font-bold">
           ¥
        </div>
      </div>

      <div className="relative z-10 text-center py-4">
        <div className={`text-4xl md:text-6xl font-mono font-bold tracking-tight text-slate-800 tabular-nums transition-colors duration-300 ${isMoyuMode ? 'text-amber-500 scale-105' : ''}`}>
           <span className="text-2xl md:text-4xl align-top mr-1 text-slate-400">¥</span>
           {integerPart}
           <span className="text-xl md:text-3xl text-slate-400">.{decimalPart}</span>
        </div>
        
        <div className="mt-4 flex justify-center gap-2">
            <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-xs text-slate-400">
               月薪: ¥{monthlySalary}
            </div>
            <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-xs text-slate-400">
               日薪: ¥{(monthlySalary / 21.75).toFixed(0)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCard;