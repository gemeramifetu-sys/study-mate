import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LottiePlayer } from '../common/LottiePlayer';
import { successDoneLottieData } from '../../data/lottieAnimations';
import { playTap } from '../../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  taskTitle: string;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  taskTitle,
  onClose
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
        <div className="w-32 h-32 flex items-center justify-center">
          <LottiePlayer animationData={successDoneLottieData} loop={false} />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
          Task Completed! 🎉
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 line-clamp-2 max-w-xs">
          {taskTitle || 'Great work on finishing your task.'}
        </p>

        <button
          onClick={() => {
            playTap();
            onClose();
          }}
          className="mt-5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-2xs cursor-pointer"
        >
          Keep Crushing It →
        </button>
      </div>
    </div>
  );
};
