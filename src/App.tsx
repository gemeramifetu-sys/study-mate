/**
 * StudyPulse - 100% Offline Student Assistant & Planner
 * Built by Desmond & #Brother
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  TimetableSlot,
  Assignment,
  DailyGoal,
  Habit,
  TimerPreset,
  StudyStats,
  TabType
} from './types';
import {
  AppState,
  loadSavedState,
  saveState,
  getDefaultState,
  getSeedData,
  getTaskDueStatus
} from './utils/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OnboardingView } from './components/OnboardingView';
import { AssistantTab } from './components/tabs/AssistantTab';
import { TimetableTab } from './components/tabs/TimetableTab';
import { AssignmentsTab } from './components/tabs/AssignmentsTab';
import { GoalsHabitsTab } from './components/tabs/GoalsHabitsTab';
import { FocusTimerTab } from './components/tabs/FocusTimerTab';
import { AboutTab } from './components/tabs/AboutTab';
import { AssignmentModal } from './components/modals/AssignmentModal';
import { TimetableModal } from './components/modals/TimetableModal';
import { GoalModal } from './components/modals/GoalModal';
import { CustomTimerModal } from './components/modals/CustomTimerModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { CelebrationModal } from './components/modals/CelebrationModal';
import { ApkGuideModal } from './components/modals/ApkGuideModal';
import { playSuccessChime } from './utils/audio';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadSavedState());
  const [activeTab, setActiveTab] = useState<TabType>('assistant');

  // Modals state
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Assignment | null>(null);

  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetableDefaultDay, setTimetableDefaultDay] = useState(new Date().getDay());

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCustomTimerModalOpen, setIsCustomTimerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApkGuideModalOpen, setIsApkGuideModalOpen] = useState(false);

  // Celebration overlay
  const [celebrationTaskTitle, setCelebrationTaskTitle] = useState('');
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Save changes to localStorage
  const updateState = (updater: (prev: AppState) => AppState) => {
    setAppState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  };

  // Onboarding completion
  const handleOnboardingComplete = (user: UserProfile, includeDemo = true) => {
    updateState((prev) => {
      const nextState: AppState = {
        ...prev,
        user
      };
      if (includeDemo) {
        const demo = getSeedData(user.name);
        nextState.timetable = demo.timetable || [];
        nextState.assignments = demo.assignments || [];
        nextState.dailyGoals = demo.dailyGoals || [];
        nextState.habits = demo.habits || [];
      }
      return nextState;
    });
  };

  // Tasks actions
  const handleToggleTask = (id: string) => {
    updateState((prev) => {
      let completedTaskTitle = '';
      let newlyCompleted = false;

      const updated = prev.assignments.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            completedTaskTitle = task.title;
            newlyCompleted = true;
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return task;
      });

      if (newlyCompleted && completedTaskTitle) {
        playSuccessChime();
        setCelebrationTaskTitle(completedTaskTitle);
        setIsCelebrationOpen(true);
      }

      return {
        ...prev,
        assignments: updated
      };
    });
  };

  const handleSaveTask = (taskData: Omit<Assignment, 'id' | 'completed'>, editId?: string) => {
    updateState((prev) => {
      // Register custom subject if new
      const subjects = prev.user.subjects.includes(taskData.subject)
        ? prev.user.subjects
        : [...prev.user.subjects, taskData.subject];

      if (editId) {
        return {
          ...prev,
          user: { ...prev.user, subjects },
          assignments: prev.assignments.map((a) =>
            a.id === editId ? { ...a, ...taskData } : a
          )
        };
      }

      const newTask: Assignment = {
        ...taskData,
        id: 'task-' + Date.now(),
        completed: false
      };

      return {
        ...prev,
        user: { ...prev.user, subjects },
        assignments: [newTask, ...prev.assignments]
      };
    });
  };

  const handleDeleteTask = (id: string) => {
    updateState((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id)
    }));
  };

  // Timetable actions
  const handleSaveTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    updateState((prev) => {
      const subjects = prev.user.subjects.includes(slotData.subject)
        ? prev.user.subjects
        : [...prev.user.subjects, slotData.subject];

      const newSlot: TimetableSlot = {
        ...slotData,
        id: 'tt-' + Date.now()
      };

      return {
        ...prev,
        user: { ...prev.user, subjects },
        timetable: [...prev.timetable, newSlot]
      };
    });
  };

  const handleDeleteTimetableSlot = (id: string) => {
    updateState((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((s) => s.id !== id)
    }));
  };

  // Goals & Habits
  const handleToggleGoal = (id: string) => {
    updateState((prev) => ({
      ...prev,
      dailyGoals: prev.dailyGoals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    }));
  };

  const handleIncrementHabit = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateState((prev) => {
      let milestoneStreak = 0;
      let habitName = '';

      const updated = prev.habits.map((h) => {
        if (h.id === id) {
          const nextStreak = h.streak + 1;
          if (nextStreak % 7 === 0) {
            milestoneStreak = nextStreak;
            habitName = h.name;
          }
          return {
            ...h,
            streak: nextStreak,
            lastLoggedDate: todayStr
          };
        }
        return h;
      });

      if (milestoneStreak > 0) {
        playSuccessChime();
        setCelebrationTaskTitle(`${milestoneStreak}-Day Streak on "${habitName}"! Outstanding consistency!`);
        setIsCelebrationOpen(true);
      }

      return {
        ...prev,
        habits: updated
      };
    });
  };

  const handleDeleteGoal = (id: string) => {
    updateState((prev) => ({
      ...prev,
      dailyGoals: prev.dailyGoals.filter((g) => g.id !== id)
    }));
  };

  const handleDeleteHabit = (id: string) => {
    updateState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id)
    }));
  };

  const handleSaveGoalOrHabit = (data: { type: 'daily' | 'habit'; text: string; subject?: string }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateState((prev) => {
      if (data.type === 'daily') {
        const newGoal: DailyGoal = {
          id: 'dg-' + Date.now(),
          text: data.text,
          subject: data.subject,
          completed: false,
          createdAt: todayStr
        };
        return {
          ...prev,
          dailyGoals: [newGoal, ...prev.dailyGoals]
        };
      } else {
        const newHabit: Habit = {
          id: 'hb-' + Date.now(),
          name: data.text,
          subject: data.subject,
          streak: 1,
          lastLoggedDate: todayStr
        };
        return {
          ...prev,
          habits: [newHabit, ...prev.habits]
        };
      }
    });
  };

  // Focus Timer actions
  const handleUpdateTimerStats = (minutes: number) => {
    updateState((prev) => ({
      ...prev,
      studyStats: {
        ...prev.studyStats,
        todayMinutes: prev.studyStats.todayMinutes + minutes,
        totalSessions: prev.studyStats.totalSessions + 1
      }
    }));
  };

  const handleSaveCustomPreset = (preset: TimerPreset) => {
    updateState((prev) => ({
      ...prev,
      customTimerPresets: [...prev.customTimerPresets, preset]
    }));
  };

  const handleDeleteCustomPreset = (id: string) => {
    updateState((prev) => ({
      ...prev,
      customTimerPresets: prev.customTimerPresets.filter((p) => p.id !== id)
    }));
  };

  // Restore and Clear
  const handleRestoreBackup = (restored: AppState) => {
    setAppState(restored);
    saveState(restored);
  };

  const handleClearAll = () => {
    const empty = getDefaultState();
    setAppState(empty);
    saveState(empty);
  };

  // Urgent pending count for badges
  const pendingUrgentCount = appState.assignments.filter(
    (a) => !a.completed && getTaskDueStatus(a) !== null
  ).length;

  // If user hasn't finished onboarding yet, show setup view
  if (!appState.user.isSetupComplete) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-28">
      {/* Top Header */}
      <Header
        studentName={appState.user.name}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenApkGuide={() => setIsApkGuideModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'assistant' && (
          <AssistantTab
            user={appState.user}
            assignments={appState.assignments}
            timetable={appState.timetable}
            habits={appState.habits}
            onToggleTask={handleToggleTask}
            onOpenNewTask={() => {
              setEditingTask(null);
              setIsAssignmentModalOpen(true);
            }}
            onOpenNewTimetable={() => {
              setTimetableDefaultDay(new Date().getDay());
              setIsTimetableModalOpen(true);
            }}
            onGoToTimer={() => setActiveTab('focus')}
            onGoToAssignments={() => setActiveTab('assignments')}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableTab
            timetable={appState.timetable}
            onOpenAddModal={(day) => {
              setTimetableDefaultDay(day);
              setIsTimetableModalOpen(true);
            }}
            onDeleteSlot={handleDeleteTimetableSlot}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsTab
            assignments={appState.assignments}
            onToggleTask={handleToggleTask}
            onOpenNewTask={() => {
              setEditingTask(null);
              setIsAssignmentModalOpen(true);
            }}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsAssignmentModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsHabitsTab
            dailyGoals={appState.dailyGoals}
            habits={appState.habits}
            onToggleGoal={handleToggleGoal}
            onIncrementHabit={handleIncrementHabit}
            onDeleteGoal={handleDeleteGoal}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddModal={() => setIsGoalModalOpen(true)}
          />
        )}

        {activeTab === 'focus' && (
          <FocusTimerTab
            customPresets={appState.customTimerPresets}
            studyStats={appState.studyStats}
            onUpdateStats={handleUpdateTimerStats}
            onOpenCustomPresetModal={() => setIsCustomTimerModalOpen(true)}
            onDeleteCustomPreset={handleDeleteCustomPreset}
            prepGoal={appState.user.prepGoal}
          />
        )}

        {activeTab === 'about' && (
          <AboutTab
            appState={appState}
            onRestoreBackup={handleRestoreBackup}
            onClearAll={handleClearAll}
            onOpenApkGuide={() => setIsApkGuideModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        urgentCount={pendingUrgentCount}
      />

      {/* Modals */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        editingTask={editingTask}
        savedSubjects={appState.user.subjects}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <TimetableModal
        isOpen={isTimetableModalOpen}
        defaultDay={timetableDefaultDay}
        savedSubjects={appState.user.subjects}
        onClose={() => setIsTimetableModalOpen(false)}
        onSave={handleSaveTimetableSlot}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        savedSubjects={appState.user.subjects}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoalOrHabit}
      />

      <CustomTimerModal
        isOpen={isCustomTimerModalOpen}
        onClose={() => setIsCustomTimerModalOpen(false)}
        onSave={handleSaveCustomPreset}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        user={appState.user}
        onClose={() => setIsProfileModalOpen(false)}
        onEditSetup={() => {
          setIsProfileModalOpen(false);
          updateState((prev) => ({
            ...prev,
            user: { ...prev.user, isSetupComplete: false }
          }));
        }}
        onResetAll={() => {
          setIsProfileModalOpen(false);
          handleClearAll();
        }}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        taskTitle={celebrationTaskTitle}
        onClose={() => setIsCelebrationOpen(false)}
      />

      <ApkGuideModal
        isOpen={isApkGuideModalOpen}
        onClose={() => setIsApkGuideModalOpen(false)}
      />
    </div>
  );
}
