import React, { useState } from 'react';
import { Plus, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { TimetableIllustration } from '../illustrations/TimetableIllustration';
import { playTap } from '../../utils/audio';

interface TimetableTabProps {
  timetable: TimetableSlot[];
  onOpenAddModal: (day: number) => void;
  onDeleteSlot: (id: string) => void;
}

const DAYS = [
  { index: 1, name: 'Monday', short: 'Mon' },
  { index: 2, name: 'Tuesday', short: 'Tue' },
  { index: 3, name: 'Wednesday', short: 'Wed' },
  { index: 4, name: 'Thursday', short: 'Thu' },
  { index: 5, name: 'Friday', short: 'Fri' },
  { index: 6, name: 'Saturday', short: 'Sat' },
  { index: 0, name: 'Sunday', short: 'Sun' }
];

export const TimetableTab: React.FC<TimetableTabProps> = ({
  timetable,
  onOpenAddModal,
  onDeleteSlot
}) => {
  const currentSystemDay = new Date().getDay();
  const [activeDay, setActiveDay] = useState<number>(currentSystemDay);

  const daySlots = timetable
    .filter((slot) => slot.day === activeDay)
    .sort((a, b) => a.start.localeCompare(b.start));

  const activeDayName = DAYS.find((d) => d.index === activeDay)?.name || 'Monday';

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
            <TimetableIllustration className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Weekly Timetable
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Classes, practical laboratory periods, and evening boarding prep
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playTap();
            onOpenAddModal(activeDay);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Period</span>
        </button>
      </div>

      {/* Day Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {DAYS.map((d) => {
          const isSelected = activeDay === d.index;
          const count = timetable.filter((s) => s.day === d.index).length;
          return (
            <button
              key={d.index}
              onClick={() => {
                playTap();
                setActiveDay(d.index);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{d.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Slots List or Clean Empty State */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {daySlots.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-3">
              <TimetableIllustration className="w-full h-full" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No classes scheduled for {activeDayName}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Log your subject periods, science labs, or evening prep times for {activeDayName} so you never miss a lesson.
            </p>
            <button
              onClick={() => {
                playTap();
                onOpenAddModal(activeDay);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add First Period for {activeDayName}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {daySlots.map((slot) => (
              <div
                key={slot.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ${
                      slot.type === 'prep'
                        ? 'bg-amber-100 text-amber-800'
                        : slot.type === 'lab'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {slot.type === 'prep' ? '🌙' : slot.type === 'lab' ? '🔬' : '📚'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {slot.subject}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.start} – {slot.end}
                      </span>
                      {slot.room && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {slot.room}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      slot.type === 'prep'
                        ? 'bg-amber-100 text-amber-900'
                        : slot.type === 'lab'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {slot.type === 'prep' ? 'Evening Prep' : slot.type === 'lab' ? 'Practical Lab' : 'Class Period'}
                  </span>
                  <button
                    onClick={() => {
                      playTap();
                      onDeleteSlot(slot.id);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                    title="Delete Period"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
