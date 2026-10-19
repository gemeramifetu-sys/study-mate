import React from 'react';
import { X, User, GraduationCap, BookOpen, Clock, RotateCcw } from 'lucide-react';
import { UserProfile } from '../../types';
import { playTap } from '../../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onEditSetup: () => void;
  onResetAll: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onEditSetup,
  onResetAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Student Profile & Settings
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

        <div className="space-y-4">
          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{user.name || 'Student'}</h4>
                <p className="text-xs text-slate-500">{user.level} • {user.track}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div>
                <strong>Daily Prep Goal:</strong> {user.prepGoal} minutes
              </div>
              <div>
                <strong>Active Subjects ({user.subjects.length}):</strong>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {user.subjects.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                playTap();
                onEditSetup();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition text-center cursor-pointer"
            >
              Edit Setup Options & Track
            </button>
            <button
              onClick={() => {
                playTap();
                if (confirm('Clear all schedule data, assignments, and start fresh?')) {
                  onResetAll();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition text-center cursor-pointer"
            >
              Clear All Data & Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
