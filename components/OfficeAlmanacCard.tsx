
import React, { useState, useEffect } from 'react';
import { getDailyAlmanac } from '../utils/almanacUtils';

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

const OfficeAlmanacCard: React.FC = () => {
  const [almanac] = useState(getDailyAlmanac());
  const [merit, setMerit] = useState(0);
  const [clicks, setClicks] = useState<FloatingText[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const savedMerit = localStorage.getItem('niuma_merit');
    if (savedMerit) {
      setMerit(parseInt(savedMerit, 10));
    }
  }, []);

  const handleKnock = (e: React.MouseEvent) => {
    // Increment merit
    const newMerit = merit + 1;
    setMerit(newMerit);
    localStorage.setItem('niuma_merit', newMerit.toString());

    // Trigger visual animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 120);

    // Add floating text
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newClick = {
      id: Date.now(),
      text: '功德 +1',
      x,
      y,
    };
    
    setClicks(prev => [...prev, newClick]);

    // Cleanup floating text
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-2 gap-8 group hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)] transition-all duration-500">
      
      {/* Left: Almanac */}
      <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📅</span>
          <h2 className="text-xl font-bold text-slate-800">打工老黄历</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6 font-mono">{almanac.date}</p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
              宜
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {almanac.goods.map((item, i) => (
                <span key={i} className="text-slate-700 font-medium">{item}</span>
              ))}
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
              忌
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {almanac.bads.map((item, i) => (
                <span key={i} className="text-slate-700 font-medium">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Wooden Fish */}
      <div className="flex flex-col items-center justify-center relative select-none">
        <div className="absolute top-0 right-0 bg-slate-50 px-3 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-100">
          赛博功德: {merit}
        </div>
        
        <div 
          className="mt-6 relative w-32 h-32 cursor-pointer group/fish tap-highlight-transparent"
          onMouseDown={handleKnock}
        >
           {/* Floating Texts */}
           {clicks.map(click => (
            <div
              key={click.id}
              className="absolute z-50 pointer-events-none text-amber-600 font-bold text-lg animate-fade-out-up whitespace-nowrap drop-shadow-sm"
              style={{ left: click.x, top: click.y - 40 }}
            >
              {click.text}
            </div>
          ))}

          {/* Mallet (Stick) - Positioned for top-down strike */}
          <div 
            className={`absolute top-[-20px] right-[-10px] w-24 h-24 z-30 pointer-events-none origin-bottom-right transition-transform duration-75 ease-in-out ${isAnimating ? 'rotate-[-30deg] translate-y-4 translate-x-[-10px]' : 'rotate-0'}`}
          >
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter brightness-90 contrast-125">
                <defs>
                   <linearGradient id="malletGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#5c1c1c" />
                      <stop offset="100%" stopColor="#2a0a0a" />
                   </linearGradient>
                </defs>
                {/* Stick handle */}
                <path d="M90 60 L45 35" stroke="url(#malletGradient)" strokeWidth="6" strokeLinecap="round" />
                {/* Head */}
                <ellipse cx="45" cy="35" rx="12" ry="10" fill="#2a0a0a" />
                <ellipse cx="45" cy="35" rx="5" ry="3" fill="#8B5E3C" opacity="0.3" transform="rotate(-30 45 35)" />
             </svg>
          </div>

          {/* Fish Body & Cushion */}
          <div className={`w-full h-full transition-transform duration-75 ${isAnimating ? 'scale-[0.96] translate-y-1' : 'scale-100 group-hover/fish:scale-[1.02]'} ease-out origin-bottom`}>
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
               <defs>
                 {/* Body Gradient: Rosewood - Top Down feel needs radial offset */}
                 <radialGradient id="woodBodyGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 80) rotate(90) scale(90)">
                   <stop offset="0" stopColor="#802020" /> {/* Highlight center */}
                   <stop offset="0.5" stopColor="#450a0a" /> {/* Red 950 */}
                   <stop offset="1" stopColor="#1a0000" /> {/* Almost Black */}
                 </radialGradient>
                 
                 {/* Cushion Gradient */}
                 <radialGradient id="cushionGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 160) scale(80 30)">
                    <stop offset="0.7" stopColor="#fbbf24" /> 
                    <stop offset="1" stopColor="#b45309" /> 
                 </radialGradient>
               </defs>

               {/* 1. Cushion (Perspective Ellipse) */}
               <ellipse cx="100" cy="175" rx="75" ry="20" fill="url(#cushionGradient)" />
               <ellipse cx="100" cy="175" rx="70" ry="16" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.3"/>

               {/* 2. Main Body (Perspective Sphere) */}
               <ellipse cx="100" cy="120" rx="80" ry="65" fill="#2a0a0a" /> {/* Shadow layer */}
               <path 
                 d="M 25 120 
                    C 25 70, 60 40, 100 40 
                    C 140 40, 175 70, 175 120 
                    C 175 155, 140 175, 100 175 
                    C 60 175, 25 155, 25 120 Z" 
                 fill="url(#woodBodyGradient)" 
               />

               {/* 3. The "Scale" Carvings (Traditional Temple Style - stylized circles) */}
               {/* Left Scale */}
               <ellipse cx="55" cy="115" rx="15" ry="12" fill="#1a0000" opacity="0.4" />
               <ellipse cx="55" cy="115" rx="10" ry="8" stroke="#3a0505" strokeWidth="2" opacity="0.6" />
               
               {/* Right Scale */}
               <ellipse cx="145" cy="115" rx="15" ry="12" fill="#1a0000" opacity="0.4" />
               <ellipse cx="145" cy="115" rx="10" ry="8" stroke="#3a0505" strokeWidth="2" opacity="0.6" />

               {/* 4. Top Ridge Detail (Spine) */}
               <path d="M 100 45 C 95 45, 95 60, 92 80 C 108 80, 105 45, 100 45" fill="#5c1c1c" opacity="0.5" />

               {/* 5. The Slit/Mouth (Top-down view of the opening) */}
               {/* Wide crescent showing depth */}
               <path 
                 d="M 60 135 
                    Q 100 160, 140 135 
                    Q 140 142, 135 145 
                    Q 100 168, 65 145 
                    Q 60 142, 60 135 Z" 
                 fill="#000" opacity="0.8" 
               />
               <path 
                 d="M 60 135 
                    Q 100 160, 140 135"
                 stroke="#4a0404" strokeWidth="1" fill="none" opacity="0.5"
               />
               
               {/* 6. Top Highlight (Glossy Finish) */}
               <ellipse cx="100" cy="70" rx="40" ry="20" fill="#fff" opacity="0.08" filter="blur(4px)" />
               <ellipse cx="90" cy="65" rx="10" ry="5" fill="#fff" opacity="0.2" transform="rotate(-15 90 65)" filter="blur(1px)" />

            </svg>
          </div>
        </div>
        
        <p className="mt-2 text-slate-400 text-xs text-center scale-90">
            点击积功德 · <span className="text-amber-700/80 font-serif">紫檀供奉</span>
        </p>
      </div>
    </div>
  );
};

export default OfficeAlmanacCard;
