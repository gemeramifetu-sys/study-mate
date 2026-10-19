export type SchoolLevel =
  | 'Senior High School (SHS)'
  | 'Junior High School (JHS)'
  | 'University / Tertiary'
  | 'Independent Prep';

export type ProgramTrack =
  | 'General Science'
  | 'General Arts'
  | 'Business'
  | 'Visual Arts'
  | 'Home Economics'
  | 'Custom';

export interface UserProfile {
  name: string;
  level: SchoolLevel | string;
  track: ProgramTrack | string;
  subjects: string[];
  prepGoal: number; // in minutes
  isSetupComplete: boolean;
}

export interface TimetableSlot {
  id: string;
  day: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  subject: string;
  type: 'class' | 'prep' | 'lab';
  start: string; // e.g. "08:00"
  end: string;   // e.g. "08:50"
  room?: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type TaskType = 'individual' | 'group';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  due: string; // YYYY-MM-DD
  type: TaskType;
  priority: Priority;
  members?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyGoal {
  id: string;
  text: string;
  subject?: string;
  completed: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  subject?: string;
  streak: number;
  lastLoggedDate?: string;
}

export interface TimerPreset {
  id: string;
  focus: number; // in minutes
  rest: number;  // in minutes
  label: string;
}

export interface StudyStats {
  todayMinutes: number;
  lastDate: string;
  totalSessions: number;
}

export interface DueStatus {
  status: 'overdue' | 'today' | 'tomorrow' | 'soon';
  label: string;
  days: number;
  isOverdue?: boolean;
  isToday?: boolean;
}

export type TabType = 'assistant' | 'timetable' | 'assignments' | 'goals' | 'focus' | 'about';
