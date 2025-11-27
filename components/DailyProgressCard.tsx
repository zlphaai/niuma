import React, { useState, useRef } from 'react';
import { DailyProgress, WorkStatus } from '../types';

interface DailyProgressCardProps {
  progress: DailyProgress;
  endTime: string;
  isMoyuMode: boolean;
  onToggleMoyu: () => void;
}

interface Particle {
  id: number;
  emoji: string;
  left: number;
  size: number;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({ progress, endTime, isMoyuMode, onToggleMoyu }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);

  const triggerAnimation = () => {
    const emojis = ['🐟', '🎣', '🌊', '🛶', '🏝️', '💤', '🥤', '🤫'];
    const newParticles: Particle[] = [];
    
    // Create 15 random particles
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: particleIdCounter.current++,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 80 + 10, // 10% to 90%
        size: Math.random() * 1.5 + 1 // 1rem to 2.5rem
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Clean up particles after animation finishes
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1500);
  };

  const handleMoyuClick = () => {
    if (!isMoyuMode) {
        triggerAnimation();
    }
    onToggleMoyu();
  };

  let statusColor = 'text-slate-500';
  let barColor = 'bg-slate-300';
  let icon = '💤';
  let badgeBg = 'bg-slate-100';

  if (isMoyuMode) {
    statusColor = 'text-pink-500';
    barColor = 'bg-gradient-to-r from-pink-400 to-purple-400';
    icon = '🤫';
    badgeBg = 'bg-pink-50 text-pink-700';
  } else if (progress.status === WorkStatus.WORKING) {
    statusColor = 'text-blue-500';
    barColor = 'bg-gradient-to-r from-blue-400 to-cyan-400';
    icon = '🔥';
    badgeBg = 'bg-blue-50 text-blue-700';
  } else if (progress.status === WorkStatus.FINISHED) {
    statusColor = 'text-emerald-500';
    barColor = 'bg-emerald-400';
    icon = '🎉';
    badgeBg = 'bg-emerald-50 text-emerald-700';
  } else {
     icon = '☕';
     badgeBg = 'bg-amber-50 text-amber-700';
  }

  return (
    <div className={`bg-white border ${isMoyuMode ? 'border-pink-200' : 'border-slate-100'} rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.1)] transition-all duration-500`}>
      
      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {particles.map(p => (
            <div 
                key={p.id}
                className="absolute bottom-0 animate-float-up"
                style={{ 
                    left: `${p.left}%`, 
                    fontSize: `${p.size}rem`,
                    animationDelay: `${Math.random() * 0.5}s`
                }}
            >
                {p.emoji}
            </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            🔨 今日搬砖进度
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">下班时间: {endTime}</p>
        </div>
        
        <div className="flex items-center gap-3">
             <button
                onClick={handleMoyuClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm active:scale-95 z-30 ${isMoyuMode ? 'bg-pink-100 text-pink-600 hover:bg-pink-200 ring-2 ring-pink-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-blue-600'}`}
             >
                {isMoyuMode ? '🚫 结束摸鱼' : '🐟 一键摸鱼'}
             </button>
             <div className="text-4xl filter drop-shadow-sm">{icon}</div>
        </div>
      </div>

      <div className="relative pt-2 z-10">
        <div className="flex mb-3 items-center justify-between">
          <div>
            <span className={`text-xs font-bold inline-block py-1 px-3 rounded-full ${badgeBg}`}>
              {isMoyuMode ? '正在摸鱼' : progress.status === WorkStatus.WORKING ? '搬砖中' : progress.status === WorkStatus.FINISHED ? '已下班' : '未开始'}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-bold inline-block ${statusColor}`}>
              {progress.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100 shadow-inner">
          <div
            style={{ width: `${progress.percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor} transition-all duration-1000 ease-out`}
          ></div>
        </div>
      </div>

      <div className={`text-center mt-4 p-4 rounded-2xl border transition-colors ${isMoyuMode ? 'bg-pink-50/50 border-pink-100' : 'bg-slate-50 border-slate-100/50'} z-10 relative`}>
         {progress.status === WorkStatus.WORKING && !isMoyuMode ? (
             <div className="text-3xl md:text-5xl font-mono font-bold text-slate-700 tracking-wider tabular-nums">
                 {progress.timeLeftStr}
             </div>
         ) : (
             <div className={`text-xl font-bold ${isMoyuMode ? 'text-pink-500' : progress.status === WorkStatus.FINISHED ? 'text-emerald-500' : 'text-slate-400'}`}>
                 {progress.timeLeftStr}
             </div>
         )}
         {progress.status === WorkStatus.WORKING && !isMoyuMode && (
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">距离下班</p>
         )}
      </div>
    </div>
  );
};

export default DailyProgressCard;