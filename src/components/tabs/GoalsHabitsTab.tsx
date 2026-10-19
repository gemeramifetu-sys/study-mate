import React from 'react';
import { Plus, Flame, CheckCircle, Trash2, Target, Trophy } from 'lucide-react';
import { DailyGoal, Habit } from '../../types';
import { GoalsIllustration } from '../illustrations/GoalsIllustration';
import { playSuccessChime, playTap } from '../../utils/audio';

interface GoalsHabitsTabProps {
  dailyGoals: DailyGoal[];
  habits: Habit[];
  onToggleGoal: (id: string) => void;
  onIncrementHabit: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddModal: () => void;
}

export const GoalsHabitsTab: React.FC<GoalsHabitsTabProps> = ({
  dailyGoals,
  habits,
  onToggleGoal,
  onIncrementHabit,
  onDeleteGoal,
  onDeleteHabit,
  onOpenAddModal
}) => {
  const hasGoals = dailyGoals.length > 0;
  const hasHabits = habits.length > 0;
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
            <GoalsIllustration className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Daily Goals & Study Habits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Maintain active study streaks, daily syllabus goals, and consistency
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playTap();
            onOpenAddModal();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Target / Habit</span>
        </button>
      </div>

      {!hasGoals && !hasHabits ? (
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-10 shadow-sm text-center flex flex-col items-center">
          <div className="w-28 h-28 mb-3">
            <GoalsIllustration className="w-full h-full" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No study targets or habits recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Build unshakeable momentum! Create daily targets like "Solve 5 past questions" or daily streaks like "Evening Prep".
          </p>
          <button
            onClick={() => {
              playTap();
              onOpenAddModal();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add First Study Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Today's Targets */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Targets</h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {dailyGoals.filter((g) => g.completed).length} / {dailyGoals.length} done
              </span>
            </div>

            {dailyGoals.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <p>No daily targets set for today.</p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-2 text-blue-600 font-bold hover:underline"
                >
                  + Add daily target
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {dailyGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => {
                          playSuccessChime();
                          onToggleGoal(goal.id);
                        }}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition cursor-pointer ${
                          goal.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {goal.completed && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold text-slate-900 ${
                            goal.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {goal.text}
                        </div>
                        {goal.subject && (
                          <div className="text-[11px] text-slate-500">{goal.subject}</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTap();
                        onDeleteGoal(goal.id);
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Habit Streaks */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Habit Streaks</h3>
              </div>
              <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Consistency</span>
              </span>
            </div>

            {habits.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <p>No study habits tracking yet.</p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-2 text-blue-600 font-bold hover:underline"
                >
                  + Add study habit
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {habits.map((habit) => {
                  const loggedToday = habit.lastLoggedDate === todayStr;
                  return (
                    <div
                      key={habit.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {habit.name}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-amber-800 ml-5 mt-0.5">
                          {habit.streak} {habit.streak === 1 ? 'day' : 'days'} streak 🔥
                          {habit.subject ? ` • ${habit.subject}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onIncrementHabit(habit.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer ${
                            loggedToday
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {loggedToday ? '✓ Logged Today' : '+ Log Today'}
                        </button>
                        <button
                          onClick={() => {
                            playTap();
                            onDeleteHabit(habit.id);
                          }}
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
