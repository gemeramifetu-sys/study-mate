import React, { useState } from 'react';
import { Plus, CheckSquare, Edit3, Trash2, Users, AlertCircle, FileText } from 'lucide-react';
import { Assignment } from '../../types';
import { getTaskDueStatus } from '../../utils/storage';
import { LottiePlayer } from '../common/LottiePlayer';
import { notificationLottieData } from '../../data/lottieAnimations';
import { playTap } from '../../utils/audio';

interface AssignmentsTabProps {
  assignments: Assignment[];
  onToggleTask: (id: string) => void;
  onOpenNewTask: () => void;
  onEditTask: (task: Assignment) => void;
  onDeleteTask: (id: string) => void;
}

type FilterType = 'all' | 'pending' | 'group' | 'completed';

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  onToggleTask,
  onOpenNewTask,
  onEditTask,
  onDeleteTask
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const pendingList = assignments.filter((a) => !a.completed);
  const urgentTasks = pendingList.filter((a) => getTaskDueStatus(a) !== null);

  const filteredTasks = assignments.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'group') return task.type === 'group';
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Assignments & Group Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track homework deadlines, project submissions, and study group team members
          </p>
        </div>

        <button
          onClick={() => {
            playTap();
            onOpenNewTask();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Task</span>
        </button>
      </div>

      {/* Almost Due Notification Alert Banner */}
      {urgentTasks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-center gap-4 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <div className="w-7 h-7">
              <LottiePlayer animationData={notificationLottieData} loop={true} />
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-amber-900">
              🔔 Attention: {urgentTasks.length} assignment{urgentTasks.length > 1 ? 's' : ''} due soon!
            </div>
            <div className="text-xs text-amber-800 mt-0.5">
              Top Priority: <strong>{urgentTasks[0].title}</strong> ({urgentTasks[0].subject}) •{' '}
              <span className="font-bold underline">{getTaskDueStatus(urgentTasks[0])?.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Tasks', count: assignments.length },
          { id: 'pending', label: 'To-Do', count: pendingList.length },
          { id: 'group', label: 'Group Projects', count: assignments.filter((a) => a.type === 'group').length },
          { id: 'completed', label: 'Completed', count: assignments.filter((a) => a.completed).length }
        ].map((f) => {
          const isSelected = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                playTap();
                setFilter(f.id as FilterType);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List or Clean Empty State */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {filteredTasks.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-3">
              📝
            </div>
            <h3 className="text-base font-bold text-slate-900">No assignments found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Add individual homework, lab experiments, or group coursework to track deadlines effortlessly.
            </p>
            <button
              onClick={() => {
                playTap();
                onOpenNewTask();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Assignment</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const dueStatus = getTaskDueStatus(task);
              const isUrgent = dueStatus !== null;
              return (
                <div
                  key={task.id}
                  className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                    isUrgent ? 'bg-amber-50/30 -mx-4 px-4 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {task.completed && <CheckSquare className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold text-slate-900 ${
                            task.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.type === 'group' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            <Users className="w-3 h-3" />
                            <span>Group</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{task.subject}</span>
                        <span>•</span>
                        <span>Due: {task.due}</span>
                        {task.type === 'group' && task.members && (
                          <>
                            <span>•</span>
                            <span className="text-purple-700 font-medium">👥 {task.members}</span>
                          </>
                        )}
                      </div>

                      {task.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-200/60 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Tags */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {dueStatus ? (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          dueStatus.isOverdue
                            ? 'bg-red-100 text-red-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {dueStatus.label}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {task.priority} Priority
                      </span>
                    )}

                    <button
                      onClick={() => {
                        playTap();
                        onEditTask(task);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                      title="Edit Assignment"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        playTap();
                        onDeleteTask(task.id);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                      title="Delete Assignment"
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
  );
};
