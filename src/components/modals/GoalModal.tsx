import React, { useState } from 'react';
import { X, Target, Flame } from 'lucide-react';
import { STANDARD_SUBJECTS } from '../../utils/storage';
import { playSuccessChime, playTap } from '../../utils/audio';

interface GoalModalProps {
  isOpen: boolean;
  savedSubjects: string[];
  onClose: () => void;
  onSave: (data: { type: 'daily' | 'habit'; text: string; subject?: string }) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  savedSubjects,
  onClose,
  onSave
}) => {
  const [type, setType] = useState<'daily' | 'habit'>('daily');
  const [text, setText] = useState('');
  const [subject, setSubject] = useState(savedSubjects[0] || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    playSuccessChime();
    onSave({
      type,
      text: text.trim(),
      subject: subject || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            New Target or Study Habit
          </h3>
          <button
            onClick={() => {
              playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Type */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setType('daily');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  type === 'daily'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Today's Target</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setType('habit');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  type === 'habit'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Habit Streak 🔥</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                type === 'daily'
                  ? 'e.g. Solve 5 Past Questions on Trigonometry'
                  : 'e.g. Read 20 mins of textbook before sleep'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Subject (Optional)
            </label>
            <input
              type="text"
              list="subjects-list"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Core Mathematics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
            <datalist id="subjects-list">
              {Array.from(new Set([...savedSubjects, ...STANDARD_SUBJECTS])).map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs cursor-pointer"
            >
              Save Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
