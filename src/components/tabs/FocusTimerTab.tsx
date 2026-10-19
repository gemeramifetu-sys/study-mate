import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Coffee, Sparkles, CheckCircle2, Flame, Award } from 'lucide-react';
import { TimerPreset, StudyStats } from '../../types';
import { DEFAULT_TIMER_PRESETS } from '../../utils/storage';
import { SkaterMascot } from '../illustrations/SkaterMascot';
import { playBellChime, playSuccessChime, playTap } from '../../utils/audio';

interface FocusTimerTabProps {
  customPresets: TimerPreset[];
  studyStats: StudyStats;
  onUpdateStats: (minutes: number) => void;
  onOpenCustomPresetModal: () => void;
  onDeleteCustomPreset: (id: string) => void;
  prepGoal: number;
}

export const FocusTimerTab: React.FC<FocusTimerTabProps> = ({
  customPresets,
  studyStats,
  onUpdateStats,
  onOpenCustomPresetModal,
  onDeleteCustomPreset,
  prepGoal
}) => {
  const allPresets = [...DEFAULT_TIMER_PRESETS, ...customPresets];
  const [currentPreset, setCurrentPreset] = useState<TimerPreset>(allPresets[1] || DEFAULT_TIMER_PRESETS[1]);
  const [timerMode, setTimerMode] = useState<'focus' | 'rest'>('focus');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(currentPreset.focus * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(currentPreset.focus * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showRestCard, setShowRestCard] = useState<boolean>(false);
  const [lastFinishedMins, setLastFinishedMins] = useState<number>(currentPreset.focus);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);

            if (timerMode === 'focus') {
              playBellChime();
              const mins = Math.round(totalSeconds / 60);
              setLastFinishedMins(mins);
              onUpdateStats(mins);
              setShowRestCard(true);
            } else {
              playSuccessChime();
              setShowRestCard(false);
              setTimerMode('focus');
              setTotalSeconds(currentPreset.focus * 60);
              return currentPreset.focus * 60;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerMode, totalSeconds, currentPreset, onUpdateStats]);

  const selectPreset = (preset: TimerPreset) => {
    playTap();
    setIsRunning(false);
    setShowRestCard(false);
    setTimerMode('focus');
    setCurrentPreset(preset);
    const secs = preset.focus * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
  };

  const toggleTimer = () => {
    playTap();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playTap();
    setIsRunning(false);
    setShowRestCard(false);
    setTimerMode('focus');
    const secs = currentPreset.focus * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
  };

  const startRest = () => {
    playTap();
    setShowRestCard(false);
    setTimerMode('rest');
    const restSecs = currentPreset.rest * 60;
    setTotalSeconds(restSecs);
    setRemainingSeconds(restSecs);
    setIsRunning(true);
  };

  const skipRest = () => {
    playTap();
    setShowRestCard(false);
    setTimerMode('focus');
    const focusSecs = currentPreset.focus * 60;
    setTotalSeconds(focusSecs);
    setRemainingSeconds(focusSecs);
    setIsRunning(false);
  };

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Timer Container Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-center flex flex-col items-center">
        {/* Mascot Focus Stage */}
        <div className="mb-4">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <SkaterMascot isRunning={isRunning} className="w-32 h-32 sm:w-40 sm:h-40" />
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                  isRunning
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isRunning
                  ? timerMode === 'focus'
                    ? 'Cruising in Focus 🛹'
                    : 'Recharging ☕'
                  : 'Focus Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Label */}
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          {timerMode === 'focus' ? 'Deep Study Session' : '☕ Recharge Break'}
        </div>

        {/* Big Digit Display */}
        <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-slate-900 font-mono my-2 select-none">
          {formattedTime}
        </div>

        <div className="text-xs font-semibold text-slate-500 mb-6">
          {timerMode === 'focus'
            ? `${currentPreset.label} • ${currentPreset.rest}m rest break scheduled`
            : `Consolidating memory • ${mins}m left`}
        </div>

        {/* Rest Break Offer Card */}
        {showRestCard && (
          <div className="w-full max-w-md p-5 rounded-2xl bg-amber-50 border border-amber-200 text-left mb-6 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shrink-0">
                ☕
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  Focus Session Complete ({lastFinishedMins}m)!
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Outstanding concentration! Taking a {currentPreset.rest}-minute break allows your brain to consolidate the neural connections made during study.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={startRest}
                    className="px-4 py-2 rounded-full text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition shadow-2xs cursor-pointer"
                  >
                    Start Rest ({currentPreset.rest}m)
                  </button>
                  <button
                    onClick={skipRest}
                    className="px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Skip Break
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mb-6">
          {allPresets.map((preset) => {
            const isSelected = currentPreset.id === preset.id;
            const isCustom = preset.id.startsWith('cust-');
            return (
              <div key={preset.id} className="relative group inline-flex items-center">
                <button
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTap();
                      onDeleteCustomPreset(preset.id);
                    }}
                    className="ml-1 text-slate-400 hover:text-red-500 text-xs px-1"
                    title="Delete custom preset"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Custom Button */}
          <button
            type="button"
            onClick={() => {
              playTap();
              onOpenCustomPresetModal();
            }}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Custom</span>
          </button>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-full text-sm font-bold text-white transition shadow-md flex items-center gap-2 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{timerMode === 'focus' ? 'Start Focus' : 'Resume Rest'}</span>
              </>
            )}
          </button>
        </div>

        {/* Daily Stats Summary Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 w-full max-w-sm flex items-center justify-around text-center">
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {studyStats.todayMinutes}m
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Today's Focus</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {prepGoal}m
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Daily Goal</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-0.5">
              <span>{Math.min(100, Math.round((studyStats.todayMinutes / prepGoal) * 100))}%</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Target Hit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
