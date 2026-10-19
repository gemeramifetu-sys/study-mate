import React, { useState } from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';
import { BrainInsightMascot } from './illustrations/BrainInsightMascot';
import { playBellChime } from '../utils/audio';

interface MascotWidgetProps {
  studentName: string;
}

const STUDY_BUDDY_TIPS = [
  "“Momentum is everything! Even a 25-minute laser focus session beats 3 hours of distracted multitasking.”",
  "“Active Recall test: Close your books and jot down core concepts from memory before opening them again.”",
  "“Hydration check! Grab some water to keep your brain firing on all cylinders during evening prep.”",
  "“Past questions are gold. Solving 2-3 WASSCE or exam questions daily builds unbreakable confidence.”",
  "“Tackle your toughest subject first while your willpower and mental energy are at 100%.”",
  "“The Feynman technique: Try explaining what you just learned out loud in simple everyday words.”",
  "“Consistency beats cramming every single time. 1 hour every day outlasts an all-nighter.”",
  "“Study sprints work: 25 minutes of deep focus followed by 5 minutes of rest keeps burnout away.”",
  "“Spaced Repetition: Review today's notes tomorrow, then in 3 days, then next week for permanent recall.”",
  "“Mistakes in prep are free lessons. Keep a special notebook just for tricky syllabus problems!”"
];

const STATUS_TAGS = [
  'Deep Focus 🧠',
  'Active Recall 💡',
  'Momentum High 🚀',
  'Brain Insight ⚡',
  'Exam Ready 🎯',
  'Sharp & Focused 🔥'
];

export const MascotWidget: React.FC<MascotWidgetProps> = ({ studentName }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleNextTip = () => {
    playBellChime();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);
    setTipIndex((prev) => (prev + 1) % STUDY_BUDDY_TIPS.length);
    setStatusIndex((prev) => (prev + 1) % STATUS_TAGS.length);
  };

  return (
    <div className="bg-gradient-to-br from-white/95 to-slate-50/90 rounded-2xl border border-white/80 p-5 sm:p-6 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Mascot Avatar Trigger */}
        <button
          onClick={handleNextTip}
          className={`relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200/90 p-2 shadow-sm transition-all duration-300 shrink-0 cursor-pointer ${
            isBouncing ? 'scale-105' : 'hover:scale-102 hover:-translate-y-0.5'
          }`}
          title="Tap for study insight & active recall tip!"
        >
          <div className="w-full h-full flex items-center justify-center">
            <BrainInsightMascot className="w-full h-full" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white text-blue-700 border border-blue-200 shadow-2xs">
            Tap for tip! ⚡
          </span>
        </button>

        {/* Mascot Dialogue */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              <span>StudyPulse Companion</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {STATUS_TAGS[statusIndex]}
            </span>
          </div>

          <div
            onClick={handleNextTip}
            className="cursor-pointer bg-white/90 border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed italic">
              {STUDY_BUDDY_TIPS[tipIndex]}
            </p>
          </div>

          <p className="mt-2 text-[11px] text-slate-500 font-medium">
            Tip for {studentName || 'Student'} • Tap avatar or speech card anytime for a boost
          </p>
        </div>
      </div>
    </div>
  );
};
