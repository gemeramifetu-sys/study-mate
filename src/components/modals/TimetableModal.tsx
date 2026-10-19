import React, { useState } from 'react';
import { X, Clock, Calendar, MapPin } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { STANDARD_SUBJECTS } from '../../utils/storage';
import { playSuccessChime, playTap } from '../../utils/audio';

interface TimetableModalProps {
  isOpen: boolean;
  defaultDay: number;
  savedSubjects: string[];
  onClose: () => void;
  onSave: (slot: Omit<TimetableSlot, 'id'>) => void;
}

const DAYS = [
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
  { index: 0, name: 'Sunday' }
];

export const TimetableModal: React.FC<TimetableModalProps> = ({
  isOpen,
  defaultDay,
  savedSubjects,
  onClose,
  onSave
}) => {
  const [day, setDay] = useState<number>(defaultDay);
  const [subject, setSubject] = useState(savedSubjects[0] || STANDARD_SUBJECTS[0]);
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [type, setType] = useState<'class' | 'prep' | 'lab'>('class');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('08:50');
  const [room, setRoom] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenSubject = isCustomSubject ? customSubject.trim() : subject;
    if (!chosenSubject) {
      alert('Please specify a subject or activity.');
      return;
    }

    playSuccessChime();
    onSave({
      day,
      subject: chosenSubject,
      type,
      start,
      end,
      room: room.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Add Timetable Slot
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
          {/* Subject with Custom Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Subject or Activity *
              </label>
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setIsCustomSubject(!isCustomSubject);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                {isCustomSubject ? '↩ Choose from list' : '+ Type Custom'}
              </button>
            </div>

            {isCustomSubject ? (
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Type custom subject or activity..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
              />
            ) : (
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              >
                <optgroup label="Saved Subjects">
                  {savedSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Standard Syllabus Subjects">
                  {STANDARD_SUBJECTS.filter((s) => !savedSubjects.includes(s)).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>

          {/* Day & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              >
                {DAYS.map((d) => (
                  <option key={d.index} value={d.index}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'class' | 'prep' | 'lab')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              >
                <option value="class">Class Period</option>
                <option value="prep">🌙 Evening Prep</option>
                <option value="lab">🔬 Practical / Lab</option>
              </select>
            </div>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Room / Teacher */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Room or Teacher (Optional)
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Science Lab 1 - Mr. Mensah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none"
            />
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
              Add Schedule Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
