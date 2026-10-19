import React from 'react';
import { Download, Sparkles, User, WifiOff, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { playTap } from '../utils/audio';

interface HeaderProps {
  studentName: string;
  onOpenProfile: () => void;
  onOpenApkGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentName,
  onOpenProfile,
  onOpenApkGuide
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl overflow-hidden p-1">
            <img src="/icon.svg" alt="StudyPulse" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                StudyPulse
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Student Study Copilot</p>
          </div>
        </div>

        {/* Center Indicators & Install Trigger */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline Mode</span>
            </div>
          )}

          {/* Android APK Share / Guide Button */}
          <button
            onClick={() => {
              playTap();
              onOpenApkGuide();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
            title="Download or share as Android App"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android APK</span>
          </button>

          {/* In-App PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={() => {
                playTap();
                install();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && !isInstalled && (
            <button
              onClick={() => {
                playTap();
                alert('To install StudyPulse on iPhone / iPad:\n1. Tap the Share button in Safari toolbar.\n2. Select "Add to Home Screen".\nRuns 100% offline!');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200"
            >
              <span>+ Home Screen</span>
            </button>
          )}
        </div>

        {/* Profile Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playTap();
              onOpenProfile();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
              {studentName ? studentName.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="max-w-[100px] truncate">{studentName || 'Profile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
