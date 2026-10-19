import {
  UserProfile,
  TimetableSlot,
  Assignment,
  DailyGoal,
  Habit,
  TimerPreset,
  StudyStats,
  DueStatus
} from '../types';

export const STORAGE_KEY = 'studypulse_liquid_v2';

export const TRACK_SUBJECTS: Record<string, string[]> = {
  'General Science': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies',
    'Elective Mathematics',
    'Physics',
    'Chemistry',
    'Biology'
  ],
  'General Arts': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies',
    'Government',
    'Literature in English',
    'Economics',
    'History'
  ],
  'Business': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies',
    'Financial Accounting',
    'Business Management',
    'Cost Accounting',
    'Economics'
  ],
  'Visual Arts': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies',
    'Graphic Design',
    'Picture Making',
    'Textiles',
    'General Knowledge in Art'
  ],
  'Home Economics': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies',
    'Food & Nutrition',
    'Clothing & Textiles',
    'Management in Living'
  ],
  'Custom': [
    'Core Mathematics',
    'Integrated Science',
    'English Language',
    'Social Studies'
  ]
};

export const STANDARD_SUBJECTS = [
  'Core Mathematics',
  'Integrated Science',
  'English Language',
  'Social Studies',
  'Elective Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government',
  'History',
  'Literature in English',
  'Business Management',
  'Financial Accounting',
  'Cost Accounting',
  'Graphic Design',
  'Picture Making',
  'Textiles',
  'Food & Nutrition',
  'Clothing & Textiles',
  'Management in Living',
  'ICT / Computing',
  'French Language',
  'General Knowledge in Art'
];

export const DEFAULT_TIMER_PRESETS: TimerPreset[] = [
  { id: 'p-15', focus: 15, rest: 3, label: '15m (3m rest)' },
  { id: 'p-25', focus: 25, rest: 5, label: '25m (5m rest)' },
  { id: 'p-45', focus: 45, rest: 10, label: '45m (10m rest)' },
  { id: 'p-60', focus: 60, rest: 15, label: '60m (15m rest)' },
  { id: 'p-90', focus: 90, rest: 20, label: '90m (20m rest)' }
];

export interface AppState {
  user: UserProfile;
  timetable: TimetableSlot[];
  assignments: Assignment[];
  dailyGoals: DailyGoal[];
  habits: Habit[];
  customTimerPresets: TimerPreset[];
  studyStats: StudyStats;
}

export function getDefaultState(): AppState {
  const todayStr = new Date().toISOString().split('T')[0];
  return {
    user: {
      name: '',
      level: 'Senior High School (SHS)',
      track: 'General Science',
      subjects: TRACK_SUBJECTS['General Science'],
      prepGoal: 60,
      isSetupComplete: false
    },
    timetable: [],
    assignments: [],
    dailyGoals: [],
    habits: [],
    customTimerPresets: [],
    studyStats: {
      todayMinutes: 0,
      lastDate: todayStr,
      totalSessions: 0
    }
  };
}

export function loadSavedState(): AppState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed: AppState = JSON.parse(raw);
    
    // Check daily stats rollover
    const todayStr = new Date().toISOString().split('T')[0];
    if (parsed.studyStats && parsed.studyStats.lastDate !== todayStr) {
      parsed.studyStats.todayMinutes = 0;
      parsed.studyStats.lastDate = todayStr;
    }
    if (!parsed.customTimerPresets) parsed.customTimerPresets = [];
    if (!parsed.dailyGoals) parsed.dailyGoals = [];
    if (!parsed.habits) parsed.habits = [];
    if (!parsed.assignments) parsed.assignments = [];
    if (!parsed.timetable) parsed.timetable = [];
    return parsed;
  } catch (e) {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save StudyPulse state:', e);
  }
}

export function getTaskDueStatus(task: Assignment): DueStatus | null {
  if (!task || task.completed || !task.due) return null;
  const parts = task.due.split('-');
  if (parts.length !== 3) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'overdue', label: 'Overdue', days: diffDays, isOverdue: true };
  } else if (diffDays === 0) {
    return { status: 'today', label: 'Due Today', days: 0, isToday: true };
  } else if (diffDays === 1) {
    return { status: 'tomorrow', label: 'Due Tomorrow', days: 1 };
  } else if (diffDays === 2) {
    return { status: 'soon', label: 'Due in 2 days', days: 2 };
  } else if (task.priority === 'high' && diffDays <= 4) {
    return { status: 'soon', label: `Due in ${diffDays}d (Urgent)`, days: diffDays };
  }
  return null;
}

export function exportBackup(state: AppState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `StudyPulse_Backup_${state.user.name || 'Student'}_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getSeedData(studentName: string): Partial<AppState> {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const in3Days = new Date(now);
  in3Days.setDate(now.getDate() + 3);
  const in3DaysStr = in3Days.toISOString().split('T')[0];

  return {
    timetable: [
      { id: 'tt-1', day: 1, subject: 'Core Mathematics', type: 'class', start: '08:00', end: '08:50', room: 'Room 3B - Mr. Mensah' },
      { id: 'tt-2', day: 1, subject: 'Elective Mathematics', type: 'class', start: '09:00', end: '09:50', room: 'Math Block 2' },
      { id: 'tt-3', day: 1, subject: 'Physics', type: 'lab', start: '10:15', end: '11:45', room: 'Science Lab 1' },
      { id: 'tt-4', day: 1, subject: 'Chemistry', type: 'prep', start: '19:00', end: '20:30', room: 'Evening Boarding Prep' },
      { id: 'tt-5', day: 2, subject: 'English Language', type: 'class', start: '08:00', end: '08:50', room: 'Room 3B' },
      { id: 'tt-6', day: 2, subject: 'Integrated Science', type: 'class', start: '09:00', end: '09:50', room: 'Bio Lab' },
      { id: 'tt-7', day: 3, subject: 'Biology', type: 'class', start: '08:30', end: '09:30', room: 'Lab 2' },
      { id: 'tt-8', day: 4, subject: 'Social Studies', type: 'class', start: '10:00', end: '11:00', room: 'Room 3B' },
      { id: 'tt-9', day: 5, subject: 'ICT / Computing', type: 'lab', start: '11:00', end: '12:30', room: 'Computer Lab' }
    ],
    assignments: [
      {
        id: 'asg-1',
        title: 'Trigonometry & Calculus Exercise 4B',
        subject: 'Elective Mathematics',
        due: todayStr,
        type: 'individual',
        priority: 'high',
        notes: 'Solve questions 1 through 10 from syllabus textbook page 142.',
        completed: false
      },
      {
        id: 'asg-2',
        title: 'Titration Experiment Lab Report',
        subject: 'Chemistry',
        due: tomorrowStr,
        type: 'group',
        priority: 'medium',
        members: 'Kwame, Ama, Kofi, Efua',
        notes: 'Include graph calculations for standard molarity.',
        completed: false
      },
      {
        id: 'asg-3',
        title: 'Comprehension & Essay on Renewable Energy in Ghana',
        subject: 'English Language',
        due: in3DaysStr,
        type: 'individual',
        priority: 'low',
        notes: 'Minimum 450 words.',
        completed: false
      }
    ],
    dailyGoals: [
      { id: 'dg-1', text: 'Review Newton’s 3 Laws of Motion past questions', subject: 'Physics', completed: false, createdAt: todayStr },
      { id: 'dg-2', text: 'Memorize 5 new vocabulary terms for WASSCE English', subject: 'English Language', completed: true, createdAt: todayStr },
      { id: 'dg-3', text: 'Complete 1 full evening prep session (60 mins)', subject: 'General Study', completed: false, createdAt: todayStr }
    ],
    habits: [
      { id: 'hb-1', name: 'Solve 3 Past Questions Daily', subject: 'Core Mathematics', streak: 6, lastLoggedDate: todayStr },
      { id: 'hb-2', name: 'Evening Boarding Prep Focus', subject: 'General Science', streak: 12, lastLoggedDate: todayStr },
      { id: 'hb-3', name: 'Science Formula Flashcards Review', subject: 'Physics & Chemistry', streak: 4, lastLoggedDate: todayStr }
    ]
  };
}
