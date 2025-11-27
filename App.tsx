
import React, { useState, useEffect } from 'react';
import { UserSettings, TimeLeft, DailyProgress, WorkStatus } from './types';
import { calculateWeekendCountdown, calculateDailyProgress, getGreeting, getRandomQuote } from './utils/timeUtils';
import CountdownCard from './components/CountdownCard';
import DailyProgressCard from './components/DailyProgressCard';
import SalaryCard from './components/SalaryCard';
import OfficeAlmanacCard from './components/OfficeAlmanacCard';
import SettingsModal from './components/SettingsModal';

const DEFAULT_SETTINGS: UserSettings = {
  username: '打工人',
  startTime: '09:00',
  endTime: '18:00',
  monthlySalary: 10000,
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('niuma_settings');
    // Migration: if saved settings has retirementDate, we can ignore/clean it in next save
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [weekendData, setWeekendData] = useState<{ timeLeft: TimeLeft, isWeekend: boolean }>(
    calculateWeekendCountdown(settings.endTime)
  );
  
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(calculateDailyProgress(settings.startTime, settings.endTime));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quote, setQuote] = useState(getRandomQuote());
  const [greeting, setGreeting] = useState(getGreeting());
  const [isMoyuMode, setIsMoyuMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('niuma_settings', JSON.stringify(settings));
    // Update immediately on settings change
    setWeekendData(calculateWeekendCountdown(settings.endTime));
    if (!isMoyuMode) {
        setDailyProgress(calculateDailyProgress(settings.startTime, settings.endTime));
    }
  }, [settings, isMoyuMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWeekendData(calculateWeekendCountdown(settings.endTime));
      
      if (isMoyuMode) {
         setDailyProgress({
             status: WorkStatus.FINISHED,
             percentage: 100,
             timeLeftStr: '🐟 摸鱼模式开启中...'
         });
      } else {
         setDailyProgress(calculateDailyProgress(settings.startTime, settings.endTime));
      }
    }, 1000);

    // Update greeting and quote occasionally
    const quoteTimer = setInterval(() => {
        setGreeting(getGreeting());
    }, 60000);

    return () => {
        clearInterval(timer);
        clearInterval(quoteTimer);
    };
  }, [settings, isMoyuMode]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    // Refresh quote on save
    setQuote(getRandomQuote());
    setIsMoyuMode(false); // Reset moyu mode on settings change
  };

  const toggleMoyuMode = () => {
      setIsMoyuMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50 text-text-primary pb-12 transition-colors font-sans relative overflow-hidden">
      {/* Background decoration - Dynamic Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob opacity-70"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000 opacity-70"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000 opacity-70"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000 opacity-70"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              牛马时钟
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Work-Life Balance Calculator</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="group flex items-center gap-2 bg-white/80 backdrop-blur-md hover:bg-white border border-slate-200 px-4 py-2 rounded-full transition-all hover:shadow-md shadow-sm"
          >
            <span className="text-slate-600 group-hover:text-slate-800 text-sm font-medium">设置</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 group-hover:rotate-90 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </header>

        {/* Welcome Section */}
        <section className="mb-10">
           <h2 className="text-2xl font-bold text-slate-800 mb-3">{greeting} <span className="text-blue-500">{settings.username}</span></h2>
           <div className="bg-white/60 backdrop-blur-md border-l-4 border-blue-400 p-5 rounded-r-xl shadow-sm italic text-slate-600">
             "{quote}"
           </div>
        </section>

        {/* Main Grid */}
        <div className="grid gap-8">
          
          {/* Daily Grind */}
          <DailyProgressCard 
            progress={dailyProgress} 
            endTime={settings.endTime} 
            isMoyuMode={isMoyuMode} 
            onToggleMoyu={toggleMoyuMode} 
          />

          {/* Salary Tracker */}
          <SalaryCard 
            monthlySalary={Number(settings.monthlySalary)} 
            startTime={settings.startTime} 
            endTime={settings.endTime}
            isMoyuMode={isMoyuMode}
          />
          
          {/* Office Almanac & Wooden Fish */}
          <OfficeAlmanacCard />

          {/* Weekend Countdown */}
          <CountdownCard timeLeft={weekendData.timeLeft} isWeekend={weekendData.isWeekend} />
          
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} 牛马时钟. 愿你每个周末都快乐。</p>
          <p className="mt-1 text-xs opacity-60">数据仅保存在本地，请放心摸鱼。</p>
        </footer>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialSettings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;
