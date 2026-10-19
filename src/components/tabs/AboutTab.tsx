import React, { useRef } from 'react';
import { Download, Upload, Smartphone, ShieldCheck, Heart, Trash2, Cpu, Code2, Sparkles, BookOpen } from 'lucide-react';
import { AppState } from '../../utils/storage';
import { playSuccessChime, playTap } from '../../utils/audio';

interface AboutTabProps {
  appState: AppState;
  onRestoreBackup: (state: AppState) => void;
  onClearAll: () => void;
  onOpenApkGuide: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  appState,
  onRestoreBackup,
  onClearAll,
  onOpenApkGuide
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    playSuccessChime();
    const dataStr = JSON.stringify(appState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyPulse_Backup_${appState.user.name || 'Student'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.user) {
          playSuccessChime();
          onRestoreBackup(parsed);
          alert('StudyPulse data restored successfully!');
        } else {
          alert('Invalid StudyPulse backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm mb-3">
          <img src="/icon.svg" alt="StudyPulse" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          StudyPulse
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1">
          Built with passion by brothers who understand the grind. 100% offline for every student.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Version 2.0 Production
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Zero Internet Needed
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Open Spirit
          </span>
        </div>
      </div>

      {/* Mission Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Our Mission
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          StudyPulse was born out of one simple frustration — students spending more time fighting complicated, ad-heavy apps and unstable internet connections than actually studying. We engineered something clean, fast, offline, and genuinely useful. No subscriptions, no cloud sync lag, and zero tracking. Just pure focus.
        </p>
      </div>

      {/* The Founders / Brothers Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          👨‍💻 The Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Desmond */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
              D
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Desmond</div>
              <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                Co-Founder & Lead Developer
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                The architect behind StudyPulse. Spearheading core logic, responsive performance, offline algorithms, and the grand vision.
              </p>
            </div>
          </div>

          {/* #Brother */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
              B
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">#Brother</div>
              <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                Co-Founder & Creative Director
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                The creative force. Refining interactions, visual motifs, user empathy, and ensuring every single screen feels effortless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Android APK & Offline Distribution Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Share as Android App (.APK)</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-lg">
            Share this app with classmates via Bluetooth, Xender, or WhatsApp. Learn how to generate the standalone installable Android package in 1 click.
          </p>
        </div>
        <button
          onClick={() => {
            playTap();
            onOpenApkGuide();
          }}
          className="px-4 py-2 rounded-full text-xs font-bold text-slate-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition shrink-0 cursor-pointer"
        >
          View APK Guide →
        </button>
      </div>

      {/* Backup & Data Management */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Data Backup & Safe Storage
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Because your data is stored locally in your browser storage, you can export a complete JSON backup anytime to keep your timetable and notes safe or transfer to another phone.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition ml-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
