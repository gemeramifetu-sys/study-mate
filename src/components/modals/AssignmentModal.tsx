import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen } from 'lucide-react';
import { Assignment, TaskType, Priority } from '../../types';
import { STANDARD_SUBJECTS } from '../../utils/storage';
import { playSuccessChime, playTap } from '../../utils/audio';

interface AssignmentModalProps {
  isOpen: boolean;
  editingTask: Assignment | null;
  savedSubjects: string[];
  onClose: () => void;
  onSave: (task: Omit<Assignment, 'id' | 'completed'>, editId?: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  editingTask,
  savedSubjects,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [due, setDue] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TaskType>('individual');
  const [priority, setPriority] = useState<Priority>('medium');
  const [members, setMembers] = useState('');
  const [notes, setNotes] = useState('');

  const allSubjects = Array.from(new Set([...savedSubjects, ...STANDARD_SUBJECTS]));

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDue(editingTask.due);
      setType(editingTask.type);
      setPriority(editingTask.priority);
      setMembers(editingTask.members || '');
      setNotes(editingTask.notes || '');

      if (allSubjects.includes(editingTask.subject)) {
        setSubject(editingTask.subject);
        setIsCustomSubject(false);
        setCustomSubject('');
      } else {
        setIsCustomSubject(true);
        setCustomSubject(editingTask.subject);
        setSubject('');
      }
    } else {
      setTitle('');
      setSubject(savedSubjects[0] || STANDARD_SUBJECTS[0]);
      setIsCustomSubject(false);
      setCustomSubject('');
      setDue(new Date().toISOString().split('T')[0]);
      setType('individual');
      setPriority('medium');
      setMembers('');
      setNotes('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenSubject = isCustomSubject ? customSubject.trim() : subject;
    if (!chosenSubject) {
      alert('Please select or type a subject.');
      return;
    }

    playSuccessChime();
    onSave(
      {
        title: title.trim(),
        subject: chosenSubject,
        due,
        type,
        priority,
        members: type === 'group' ? members.trim() : undefined,
        notes: notes.trim() || undefined
      },
      editingTask?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {editingTask ? 'Edit Assignment' : 'New Assignment / Project'}
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
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exercise on Quadratic Equations & Graphs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Subject with Custom Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Subject *
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
                placeholder="Type custom subject name..."
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

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-slate-900 focus:outline-none"
              >
                <option value="medium">Standard Priority</option>
                <option value="high">Urgent / High Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Individual vs Group */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Project Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setType('individual');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                  type === 'individual'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Individual Task
              </button>
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setType('group');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  type === 'group'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>👥 Group Work</span>
              </button>
            </div>
          </div>

          {/* Group members if group */}
          {type === 'group' && (
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Group Members (Comma Separated)
              </label>
              <input
                type="text"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder="e.g. Kwame, Ama, Kojo, Efua"
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 text-sm focus:border-purple-600 focus:outline-none"
              />
            </div>
          )}

          {/* Notes / Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Notes & Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Page numbers, textbook chapter, teacher instructions..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-slate-900 focus:outline-none leading-relaxed"
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
              {editingTask ? 'Save Changes' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
