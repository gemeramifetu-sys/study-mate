import React from 'react';
import { Plus, Bell, Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { UserProfile, Assignment, TimetableSlot, Habit } from '../../types';
import { getTaskDueStatus } from '../../utils/storage';
import { MascotWidget } from '../MascotWidget';
import { LottiePlayer } from '../common/LottiePlayer';
import { notificationLottieData } from '../../data/lottieAnimations';
import { playTap } from '../../utils/audio';

interface AssistantTabProps {
  user: UserProfile;
  assignments: Assignment[];
  timetable: TimetableSlot[];
  habits: Habit[];
  onToggleTask: (id: string) => void;
  onOpenNewTask: () => void;
  onOpenNewTimetable: () => void;
  onGoToTimer: () => void;
  onGoToAssignments: () => void;
}

export const AssistantTab: React.FC<AssistantTabProps> = ({
  user,
  assignments,
  timetable,
  habits,
  onToggleTask,
  onOpenNewTask,
  onOpenNewTimetable,
  onGoToTimer,
  onGoToAssignments
}) => {
  const pendingTasks = assignments.filter((a) => !a.completed);
  const urgentTasks = pendingTasks.filter((a) => getTaskDueStatus(a) !== null);
  const completedToday = assignments.filter((a) => a.completed).length;

  // Today's classes
  const todayDay = new Date().getDay();
  const todayClasses = timetable
    .filter((s) => s.day === todayDay)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="space-y-6">
      {/* Top Greeting Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user.name || 'Student'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {user.level} • {user.track}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Workspace</span>
            </span>
          </div>
        </div>

        {/* Mascot Companion Insight Widget */}
        <div className="mt-4">
          <MascotWidget studentName={user.name} />
        </div>

        {/* Urgent / Almost-Due Callout Banner */}
        {urgentTasks.length > 0 ? (
          <div
            onClick={() => {
              playTap();
              onGoToAssignments();
            }}
            className="cursor-pointer mt-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3.5 hover:bg-amber-100/70 transition shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <div className="w-7 h-7">
                <LottiePlayer animationData={notificationLottieData} loop={true} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Attention: {urgentTasks.length} task{urgentTasks.length > 1 ? 's' : ''} almost due!
                </h4>
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  View Tasks <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 line-clamp-1">
                Next up: <strong>{urgentTasks[0].title}</strong> ({urgentTasks[0].subject}) •{' '}
                {getTaskDueStatus(urgentTasks[0])?.label}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">You're all caught up on urgent deadlines!</h4>
                <p className="text-xs text-slate-500">Ready to knock out a {user.prepGoal}m focus session or prepare for tomorrow.</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Strip */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          <button
            onClick={() => {
              playTap();
              onOpenNewTask();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Assignment</span>
          </button>
          <button
            onClick={() => {
              playTap();
              onOpenNewTimetable();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Add Class Slot</span>
          </button>
          <button
            onClick={() => {
              playTap();
              onGoToTimer();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Start Prep Timer</span>
          </button>
        </div>
      </div>

      {/* Two Column Dashboard Grid: Today's Schedule & Pending Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Today's Schedule Preview */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Schedule</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {todayClasses.length} {todayClasses.length === 1 ? 'period' : 'periods'}
              </span>
            </div>

            {todayClasses.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <p>No classes or prep scheduled for today.</p>
                <button
                  onClick={onOpenNewTimetable}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  + Add schedule period
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayClasses.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{slot.subject}</div>
                      <div className="text-[11px] text-slate-500">
                        {slot.start} – {slot.end} {slot.room ? `• ${slot.room}` : ''}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        slot.type === 'prep'
                          ? 'bg-amber-100 text-amber-800'
                          : slot.type === 'lab'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {slot.type === 'prep' ? '🌙 Prep' : slot.type === 'lab' ? '🔬 Lab' : 'Class'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Tasks / Assignments Preview */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Homework & Tasks</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {pendingTasks.length} pending
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <p>No pending assignments recorded.</p>
                <button
                  onClick={onOpenNewTask}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  + Add assignment
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 4).map((task) => {
                  const dueStatus = getTaskDueStatus(task);
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        dueStatus
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-slate-50/80 border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="w-5 h-5 rounded-md border border-slate-300 bg-white flex items-center justify-center shrink-0 hover:border-slate-400 transition"
                        >
                          {task.completed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {task.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {task.subject} • Due {task.due}
                            {task.type === 'group' && task.members ? ` • 👥 ${task.members}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {dueStatus ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {dueStatus.label}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Completed today: <strong>{completedToday}</strong></span>
            <button
              onClick={onGoToAssignments}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
