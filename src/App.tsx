import React, { useState, useEffect, useCallback } from 'react';
import { UserAccount, SchoolItem, FaultItem, FaultFormData, FaultRecord, ReportSummary, ToastMessage } from './types';
import { gasBackend } from './services/googleAppsScriptSimulator';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginSection } from './components/LoginSection';
import { Dashboard } from './components/Dashboard';
import { NewFaultModal } from './components/NewFaultModal';
import { ReportsModal } from './components/ReportsModal';
import { SheetsDataModal } from './components/SheetsDataModal';
import { PrintSection } from './components/PrintSection';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Master Data State (loaded once on login)
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [faults, setFaults] = useState<FaultItem[]>([]);

  // Modals State
  const [isNewFaultModalOpen, setIsNewFaultModalOpen] = useState(false);
  const [reportsModalConfig, setReportsModalConfig] = useState<{
    isOpen: boolean;
    mode: 'school' | 'administration';
  }>({
    isOpen: false,
    mode: 'school',
  });
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Printable Report State
  const [printState, setPrintState] = useState<{
    title: string;
    records: FaultRecord[];
    summary: ReportSummary;
    printDate: string;
  }>({
    title: '',
    records: [],
    summary: { totalTickets: 0, totalDevices: 0 },
    printDate: '',
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add Toast helper
  const showToast = useCallback(
    (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Master Data
  const loadMasterData = useCallback(async () => {
    try {
      const res = await gasBackend.getAllMasterData();
      if (res.success && res.data) {
        setSchools(res.data.schools);
        setFaults(res.data.faults);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل تحميل البيانات المرجعية من الشيت';
      showToast('danger', 'خطأ بالبيانات', msg);
    }
  }, [showToast]);

  // Initial check on mount
  useEffect(() => {
    gasBackend.setupSheets();
    const existing = gasBackend.getCurrentUser();
    if (existing) {
      setCurrentUser(existing);
      loadMasterData();
    }
    setIsInitializing(false);
  }, [loadMasterData]);

  // Handle Login Success
  const handleLoginSuccess = async (user: UserAccount) => {
    setCurrentUser(user);
    await loadMasterData();
  };

  // Handle Logout with in-app confirmation (safe for iframe environments)
  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    gasBackend.logout();
    setCurrentUser(null);
    showToast('info', 'تسجيل الخروج', 'تم تسجيل الخروج من المنظومة بنجاح والعودة لشاشة الدخول.');
  };

  // Handle Quick Add Submit from NewFaultModal
  const handleNewFaultSubmit = async (formData: FaultFormData): Promise<boolean> => {
    try {
      const res = await gasBackend.saveOrUpdateData(formData);
      if (res.success) {
        showToast('success', 'تم التسجيل', res.message);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل حفظ البلاغ في قاعدة البيانات';
      showToast('danger', 'خطأ بالحفظ', msg);
      return false;
    }
  };

  // Trigger Formatted Print View
  const handleTriggerPrint = (
    title: string,
    records: FaultRecord[],
    summary: ReportSummary,
    printDate: string
  ) => {
    setPrintState({
      title,
      records,
      summary,
      printDate,
    });

    // Open rich interactive official print preview immediately
    setIsPrintPreviewOpen(true);

    // Attempt direct window.print() if allowed by browser
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn('Direct print modal call caught:', err);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-slate-900">
      
      {/* Toast Notification Layer (Sliding from top) */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          currentUser={currentUser}
          onLogout={currentUser ? handleLogout : undefined}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          onOpenNewFaultModal={() => setIsNewFaultModalOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1">
          {isInitializing ? (
            <div className="container max-w-xl mx-auto py-24 text-center">
              <div className="skeleton-shimmer h-12 w-48 mx-auto mb-4"></div>
              <div className="skeleton-shimmer h-6 w-72 mx-auto"></div>
            </div>
          ) : !currentUser ? (
            /* Login Section */
            <LoginSection onLoginSuccess={handleLoginSuccess} showToast={showToast} />
          ) : (
            /* Dashboard */
            <Dashboard
              currentUser={currentUser}
              schools={schools}
              faults={faults}
              onOpenNewFaultModal={() => setIsNewFaultModalOpen(true)}
              onOpenReportsModal={(mode) => setReportsModalConfig({ isOpen: true, mode })}
              onLogout={handleLogout}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {/* 1) New Fault Quick Modal */}
      <NewFaultModal
        isOpen={isNewFaultModalOpen}
        onClose={() => setIsNewFaultModalOpen(false)}
        schools={schools}
        faults={faults}
        currentUser={currentUser}
        onSubmit={handleNewFaultSubmit}
      />

      {/* 2) Reports Modal */}
      <ReportsModal
        isOpen={reportsModalConfig.isOpen}
        mode={reportsModalConfig.mode}
        onClose={() => setReportsModalConfig((prev) => ({ ...prev, isOpen: false }))}
        schools={schools}
        onTriggerPrint={handleTriggerPrint}
        showToast={showToast}
      />

      {/* 3) Virtual Sheets & Code.gs Modal */}
      <SheetsDataModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        onDataReset={() => {
          loadMasterData();
        }}
        showToast={showToast}
      />

      {/* 4) Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          id="logoutConfirmationModal"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in no-print"
        >
          <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 sm:p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
            <h3 className="text-xl font-black text-[#0a2647] mb-2">
              تأكيد تسجيل الخروج
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في تسجيل الخروج من منظومة إدارة أعطال المدارس والعودة إلى شاشة تسجيل الدخول؟
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                id="btnConfirmLogout"
                onClick={confirmLogout}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-check"></i>
                <span>نعم، خروج</span>
              </button>
              <button
                type="button"
                id="btnCancelLogout"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-[#f0f4fa] hover:bg-slate-200 text-slate-700 font-semibold rounded-full border border-slate-300 transition-all text-sm cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5) Official Print Preview & Export Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        reportTitle={printState.title}
        records={printState.records}
        summary={printState.summary}
        printDate={printState.printDate}
        onExportCSV={() => {
          if (printState.records.length === 0) return;
          const headers = ['م', 'كود المدرسة', 'المدرسة', 'الإدارة', 'فئة العطل', 'الجهاز المعطل', 'تاريخ العطل', 'رقم التيكت', 'العدد'];
          const rows = printState.records.map((r, idx) => [
            idx + 1,
            `"${r.schoolCode || ''}"`,
            `"${r.schoolName}"`,
            `"${r.administration}"`,
            `"${r.category}"`,
            `"${r.device}"`,
            `"${r.faultDate}"`,
            `"${r.ticketNumber}"`,
            r.count
          ]);
          const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${(printState.title || 'تقرير_أعطال').replace(/[/\\?%*:|"<>]/g, '_')}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('success', 'تصدير إكسيل', 'تم تصدير ملف الإكسيل بنجاح.');
        }}
      />

      {/* 6) Dedicated Printable Report Section (Strictly displayed only on @media print) */}
      <PrintSection
        reportTitle={printState.title}
        records={printState.records}
        summary={printState.summary}
        printDate={printState.printDate}
      />

    </div>
  );
}
