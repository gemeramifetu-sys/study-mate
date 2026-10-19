import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { TimerPreset } from '../../types';
import { playSuccessChime, playTap } from '../../utils/audio';

interface CustomTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: TimerPreset) => void;
}

export const CustomTimerModal: React.FC<CustomTimerModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [focusMins, setFocusMins] = useState<number>(50);
  const [restMins, setRestMins] = useState<number>(10);
  const [label, setLabel] = useState<string>('');

  if (!isOpen) return null;

  const handleFocusChange = (val: number) => {
    setFocusMins(val);
    setRestMins(Math.max(1, Math.round(val * 0.2)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (focusMins < 1) return;

    playSuccessChime();
    const presetLabel = label.trim() || `${focusMins}m (${restMins}m rest)`;
    onSave({
      id: 'cust-' + Date.now(),
      focus: focusMins,
      rest: restMins,
      label: presetLabel
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Create Custom Focus & Rest Time
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
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Focus / Study Duration (Minutes) *
            </label>
            <input
              type="number"
              min={1}
              max={240}
              required
              value={focusMins}
              onChange={(e) => handleFocusChange(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Rest / Break Duration (Minutes) *
            </label>
            <input
              type="number"
              min={1}
              max={60}
              required
              value={restMins}
              onChange={(e) => setRestMins(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Auto-suggested at ~20% of study time for optimal cognitive recovery.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Custom Label (Optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. 50m Deep Exam Sprint"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

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
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
