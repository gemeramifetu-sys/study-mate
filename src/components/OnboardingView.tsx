import React, { useState } from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { UserProfile, SchoolLevel, ProgramTrack } from '../types';
import { TRACK_SUBJECTS, getSeedData } from '../utils/storage';
import { BrainInsightMascot } from './illustrations/BrainInsightMascot';
import { playSuccessChime, playTap } from '../utils/audio';

interface OnboardingViewProps {
  onComplete: (user: UserProfile, initialSeed?: boolean) => void;
}

const SCHOOL_LEVELS: SchoolLevel[] = [
  'Senior High School (SHS)',
  'Junior High School (JHS)',
  'University / Tertiary',
  'Independent Prep'
];

const PROGRAM_TRACKS: ProgramTrack[] = [
  'General Science',
  'General Arts',
  'Business',
  'Visual Arts',
  'Home Economics',
  'Custom'
];

const PREP_GOALS = [
  { value: 45, label: '45 Mins' },
  { value: 60, label: '1 Hour (Recommended)' },
  { value: 90, label: '1.5 Hours' },
  { value: 120, label: '2 Hours' }
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SchoolLevel>('Senior High School (SHS)');
  const [track, setTrack] = useState<ProgramTrack>('General Science');
  const [subjectsText, setSubjectsText] = useState(TRACK_SUBJECTS['General Science'].join(', '));
  const [prepGoal, setPrepGoal] = useState<number>(60);
  const [includeDemoData, setIncludeDemoData] = useState<boolean>(true);

  const handleTrackChange = (selectedTrack: ProgramTrack) => {
    playTap();
    setTrack(selectedTrack);
    if (TRACK_SUBJECTS[selectedTrack]) {
      setSubjectsText(TRACK_SUBJECTS[selectedTrack].join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSuccessChime();
    const subjects = subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const user: UserProfile = {
      name: name.trim(),
      level,
      track,
      subjects: subjects.length > 0 ? subjects : TRACK_SUBJECTS['General Science'],
      prepGoal,
      isSetupComplete: true
    };

    onComplete(user, includeDemoData);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-900/5">
        {/* Mascot Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-200 p-2 shadow-sm mb-3">
            <BrainInsightMascot className="w-full h-full" />
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
            Personal Setup • 100% Offline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Welcome to StudyPulse
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
            Your personal student study assistant and timetable. All data stays 100% offline on your device with zero data usage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              What is your name? *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Desmond"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 text-sm focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
            />
          </div>

          {/* School Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              School Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SCHOOL_LEVELS.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => {
                    playTap();
                    setLevel(lvl);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${
                    level === lvl
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Program Track */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Program or Track
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROGRAM_TRACKS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTrackChange(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${
                    track === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Main Subjects (Comma Separated)
            </label>
            <textarea
              rows={2}
              value={subjectsText}
              onChange={(e) => setSubjectsText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 text-xs focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Pre-loaded for {track}. You can customize or add subjects anytime.
            </p>
          </div>

          {/* Daily Prep Target */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Target Daily Study / Prep Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PREP_GOALS.map((g) => (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => {
                    playTap();
                    setPrepGoal(g.value);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${
                    prepGoal === g.value
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Starter Schedule Checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="includeDemo"
              checked={includeDemoData}
              onChange={(e) => setIncludeDemoData(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeDemo" className="text-xs text-slate-700 cursor-pointer">
              <strong>Load starter schedule & syllabus tasks</strong> (classes, homework, and habit streak to get going immediately)
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.99] transition"
          >
            <span>Enter Study Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
