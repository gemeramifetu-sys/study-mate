import React from 'react';
import { Sparkles, Calendar, CheckSquare, Target, Clock, Info } from 'lucide-react';
import { TabType } from '../types';
import { playTap } from '../utils/audio';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  urgentCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  urgentCount
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'assistant', label: 'Assistant', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4" /> },
    {
      id: 'assignments',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: urgentCount > 0 ? urgentCount : undefined
    },
    { id: 'goals', label: 'Goals & Habits', icon: <Target className="w-4 h-4" /> },
    { id: 'focus', label: 'Prep Timer', icon: <Clock className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 max-w-[96vw] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playTap();
                onChangeTab(tab.id);
              }}
              className={`relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-amber-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
