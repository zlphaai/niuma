import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialSettings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>(initialSettings);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">⚙️ 配置你的牛马人生</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">牛马代号 (昵称)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder-slate-300"
              placeholder="请输入你的昵称"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">月薪 (税前/税后随你)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">¥</span>
              <input
                type="number"
                name="monthlySalary"
                value={formData.monthlySalary}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-8 text-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                placeholder="请输入月薪"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">用于计算你每秒钟摸鱼赚了多少钱 (按21.75天/月计算)。</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">上班时间</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">下班时间</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
            >
              保存设定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;