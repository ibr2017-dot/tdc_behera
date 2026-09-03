import React from 'react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentUser: UserAccount | null;
  onLogout?: () => void;
  onOpenSheetsModal?: () => void;
  onOpenNewFaultModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenSheetsModal,
  onOpenNewFaultModal,
}) => {
  return (
    <header className="min-h-[85px] w-full bg-gradient-to-l from-[#0a2647] via-[#144272] to-[#205295] border-b-[6px] border-[#e8b86d] flex items-center justify-between px-4 sm:px-8 py-3 shadow-xl relative z-10 text-white no-print">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Emblem & Titles */}
        <div className="flex items-center gap-4 text-center md:text-right">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
            <div className="w-8 h-8 rounded-full border-4 border-[#e8b86d] border-t-transparent animate-spin-slow"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              <h1 className="text-white text-lg sm:text-xl font-bold leading-tight mb-0">
                مركز التطوير التكنولوجي
              </h1>
            </div>
            <p className="text-[#e8b86d] text-xs sm:text-sm font-medium mt-0.5 mb-0">
              نظام إدارة أعطال الأجهزة - البحيرة
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          
          {/* Database Sheets & Code.gs */}
          {onOpenSheetsModal && (
            <button
              type="button"
              onClick={onOpenSheetsModal}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
              title="عرض شيتات قاعدة البيانات وكود Google Apps Script (Code.gs)"
            >
              <i className="fa-solid fa-file-excel text-emerald-400"></i>
              <span>قاعدة البيانات & Code.gs</span>
            </button>
          )}

          {/* New Fault Button (+ إضافة عطل جديد) */}
          {currentUser && onOpenNewFaultModal && (
            <button
              type="button"
              onClick={onOpenNewFaultModal}
              className="bg-[#28a745] hover:bg-[#218838] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all"
              title="تسجيل بلاغ عطل جديد سريع"
            >
              <span className="text-base font-black leading-none">+</span>
              <span>إضافة عطل جديد</span>
            </button>
          )}

          {/* User Status Chip */}
          {currentUser && (
            <div
              id="currentUserChip"
              className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/15 shadow-sm"
              title={`المستخدم الحالي: ${currentUser.fullName || currentUser.username}`}
            >
              <div className="w-7 h-7 rounded-full bg-[#e8b86d] text-[#0a2647] flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div className="text-right text-xs leading-tight">
                <div id="currentUserNameDisplay" className="font-bold text-[#e8b86d] truncate max-w-[140px] sm:max-w-[180px]">
                  {currentUser.fullName || 'ابراهيم الشيخ'}
                </div>
                <div className="text-slate-300 text-[10px]">{currentUser.role || 'مسؤول المنظومة'}</div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {currentUser && onLogout && (
            <button
              type="button"
              id="btnLogoutHeader"
              onClick={onLogout}
              className="bg-white/10 hover:bg-rose-600/40 text-white hover:text-rose-100 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-white/20 hover:border-rose-400/40 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
              title="تسجيل الخروج من المنظومة"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>خروج</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
