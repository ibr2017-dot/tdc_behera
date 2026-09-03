import React from 'react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full max-w-md px-4 pointer-events-none no-print">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 border-slate-700 text-white';
        let icon = 'fa-solid fa-circle-info text-blue-400';

        if (toast.type === 'success') {
          bgColor = 'bg-[#0a2647] border-emerald-400 text-white shadow-emerald-900/20';
          icon = 'fa-solid fa-circle-check text-emerald-400';
        } else if (toast.type === 'danger') {
          bgColor = 'bg-rose-900 border-rose-400 text-white shadow-rose-950/30';
          icon = 'fa-solid fa-triangle-exclamation text-rose-400';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950 border-amber-400 text-amber-50 shadow-amber-950/30';
          icon = 'fa-solid fa-circle-exclamation text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full p-4 rounded-2xl shadow-2xl border-2 flex items-start gap-3 transition-all duration-300 transform translate-y-0 animate-bounce-short ${bgColor}`}
            role="alert"
          >
            <i className={`${icon} text-xl mt-0.5 shrink-0`}></i>
            <div className="flex-1 text-right text-xs sm:text-sm">
              <div className="font-bold mb-0.5">{toast.title}</div>
              <div className="text-slate-200 leading-relaxed">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-full shrink-0"
              title="إغلاق التنبيه"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
