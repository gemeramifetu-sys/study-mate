import React from 'react';
import { X, Smartphone, Share2, Download, Zap, WifiOff } from 'lucide-react';
import { playTap } from '../../utils/audio';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Android APK & Offline Sharing Guide
            </h3>
          </div>
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

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <strong>100% Zero-Data Guarantee:</strong> Once installed or added to the home screen, StudyPulse uses <strong>0 megabytes of mobile data</strong> and works entirely offline during class, in the dormitory, or during evening prep.
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Method 1: Direct Instant PWA Install (No APK Needed)</span>
              </div>
              <p className="text-slate-600">
                On Chrome, Brave, or Samsung Internet: tap the <strong>"Install App"</strong> button in the top bar or your browser menu (<strong>"Add to Home screen"</strong>). It installs immediately with its app icon and launches standalone without a browser frame!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Method 2: Share via Bluetooth, Xender, or WhatsApp</span>
              </div>
              <p className="text-slate-600">
                You can generate a standalone <strong>.apk</strong> package using Microsoft's free <strong>PWABuilder.com</strong>:
              </p>
              <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-600">
                <li>Visit <strong>PWABuilder.com</strong> and input this app's URL.</li>
                <li>Click <strong>Package for Stores</strong> &gt; <strong>Android</strong> &gt; <strong>APK</strong>.</li>
                <li>Send the generated <code>.apk</code> to classmates via <strong>Xender</strong> or <strong>Bluetooth</strong>!</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-purple-500" />
                <span>For iPhone / iPad (iOS Safari)</span>
              </div>
              <p className="text-slate-600">
                Open in Safari, tap the <strong>Share</strong> icon (box with arrow) at the bottom, then scroll and select <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                playTap();
                onClose();
              }}
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
