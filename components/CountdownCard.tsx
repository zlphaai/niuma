import React from 'react';
import { TimeLeft } from '../types';

interface CountdownCardProps {
  timeLeft: TimeLeft;
  isWeekend: boolean;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ timeLeft, isWeekend }) => {
  
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.1)] transition-all duration-500">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            🏖️ 距离周末狂欢
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">目标: 周五下班</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
             <span className="text-2xl">📅</span>
        </div>
      </div>

      {isWeekend ? (
        <div className="text-center py-8">
          <h3 className="text-4xl font-extrabold text-purple-500 animate-bounce">周末愉快！</h3>
          <p className="text-slate-500 mt-2 text-lg">好好休息，下周继续当牛马。</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 md:gap-4 text-center">
          <TimeUnit value={timeLeft.days} label="天" color="text-blue-500" />
          <TimeUnit value={timeLeft.hours} label="小时" color="text-slate-600" />
          <TimeUnit value={timeLeft.minutes} label="分钟" color="text-slate-600" />
          <TimeUnit value={timeLeft.seconds} label="秒" color="text-rose-500" isPulse />
        </div>
      )}
      
      {!isWeekend && (
          <div className="mt-8 text-center">
             <span className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 text-xs font-mono border border-slate-100">
              再坚持 {timeLeft.totalSeconds.toLocaleString()} 秒
             </span>
          </div>
      )}
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string; color: string; isPulse?: boolean }> = ({ value, label, color, isPulse }) => (
  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center">
    <div className={`text-2xl md:text-3xl font-bold ${color} ${isPulse ? 'animate-pulse' : ''} tabular-nums`}>
      {value}
    </div>
    <div className="text-xs text-slate-400 font-medium mt-1">{label}</div>
  </div>
);

export default CountdownCard;