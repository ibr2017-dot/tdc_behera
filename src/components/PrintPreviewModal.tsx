import React from 'react';
import { FaultRecord, ReportSummary } from '../types';
import { downloadReportHtml, openReportInNewTab } from '../utils/reportPrinter';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  records: FaultRecord[];
  summary: ReportSummary;
  printDate: string;
  onExportCSV: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  records,
  summary,
  printDate,
  onExportCSV,
}) => {
  if (!isOpen) return null;

  const handlePrintNow = () => {
    // Attempt standard print
    window.print();
  };

  const handleDownloadHtml = () => {
    downloadReportHtml(reportTitle, records, summary, printDate);
  };

  const handleOpenNewTab = () => {
    const opened = openReportInNewTab(reportTitle, records, summary, printDate);
    if (!opened) {
      // Fallback to download
      downloadReportHtml(reportTitle, records, summary, printDate);
    }
  };

  return (
    <div
      id="printPreviewModalOverlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      dir="rtl"
    >
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl overflow-hidden my-4 flex flex-col max-h-[96vh]">
        
        {/* Top Sticky Toolbar */}
        <div className="bg-[#0a2647] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-[#e8b86d] flex items-center justify-center text-lg">
              <i className="fa-solid fa-print"></i>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight text-white mb-0">
                معاينة واعتماد التقرير الرسمي للطباعة
              </h3>
              <p className="text-xs text-amber-200/90 mt-0.5 mb-0">
                مركز التطوير التكنولوجي - مديرية التربية والتعليم بالبحيرة
              </p>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePrintNow}
              className="tdc-btn-pill tdc-btn-gold text-xs sm:text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              title="إرسال أمر الطباعة للمتصفح"
            >
              <i className="fa-solid fa-print"></i>
              <span>طباعة فورية (Print)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="tdc-btn-pill bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow"
              title="تنزيل ملف HTML جاهز للطباعة والحفظ كـ PDF"
            >
              <i className="fa-solid fa-file-arrow-down"></i>
              <span>تنزيل للطباعة / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="tdc-btn-pill bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm shadow"
              title="فتح في لسان جديد مستقل عن المتصفح"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <span className="hidden sm:inline">نافذة جديدة</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              className="tdc-btn-pill bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm shadow"
              title="تصدير إلى جدول Excel"
            >
              <i className="fa-solid fa-file-excel"></i>
              <span>Excel</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="tdc-btn-pill bg-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white text-xs sm:text-sm border border-slate-700"
              title="إغلاق المعاينة والرجوع للتقارير"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>إغلاق</span>
            </button>
          </div>
        </div>

        {/* Helpful Info Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-amber-600"></i>
            <span>
              جاهز للطباعة على ورق <strong>A4 بالعرض (Landscape)</strong>. إذا كان المتصفح يقيد الطباعة المباشرة داخل الإطارات، استخدم زر <strong>«تنزيل للطباعة / PDF»</strong> لفتحه وطباعته فوراً.
            </span>
          </div>
          <span className="font-semibold text-slate-700">
            {records.length} بلاغ مسجل
          </span>
        </div>

        {/* Document Paper Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/70">
          <div className="max-w-5xl mx-auto bg-white text-slate-900 p-6 sm:p-10 shadow-xl rounded-xl border border-slate-300">
            
            {/* Paper Official Header */}
            <div className="flex items-start justify-between border-b-2 border-[#0a2647] pb-4 mb-6">
              <div className="text-right text-xs sm:text-sm leading-relaxed">
                <div className="font-bold text-[#0a2647] text-base">جمهورية مصر العربية</div>
                <div className="text-slate-700">وزارة التربية والتعليم والتعليم الفني</div>
                <div className="font-semibold text-slate-800">مديرية التربية والتعليم بمحافظة البحيرة</div>
                <div className="font-bold text-[#0a2647] text-sm">مركز التطوير التكنولوجي (TDC)</div>
              </div>

              <div className="text-center">
                <div className="border-2 border-[#0a2647] px-5 py-2 rounded-lg bg-slate-50 inline-block mb-1 shadow-xs">
                  <h2 className="text-base sm:text-lg font-bold text-[#0a2647] mb-0">
                    {reportTitle || 'تقرير بيان أعطال الأجهزة التكنولوجية بالمدارس'}
                  </h2>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  نظام المتابعة الرقمية الموحد لقواعد بيانات مركز التطوير التكنولوجي بالبحيرة
                </div>
              </div>

              <div className="text-left text-xs leading-relaxed">
                <div className="font-bold text-slate-700">تاريخ وتوقيت الطباعة:</div>
                <div className="font-mono text-[#0a2647] font-bold text-sm">{printDate}</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  كود الاعتماد: <span className="font-mono font-bold">TDC-BHR-OFFICIAL</span>
                </div>
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-[#0a2647]">
                    <th className="border border-slate-300 p-2 text-center" style={{ width: '40px' }}>م</th>
                    <th className="border border-slate-300 p-2 text-center" style={{ width: '90px' }}>كود المدرسة</th>
                    <th className="border border-slate-300 p-2 text-right">اسم المدرسة</th>
                    <th className="border border-slate-300 p-2 text-right">الإدارة التعليمية</th>
                    <th className="border border-slate-300 p-2 text-center">فئة العطل</th>
                    <th className="border border-slate-300 p-2 text-right">الجهاز المعطل</th>
                    <th className="border border-slate-300 p-2 text-center" style={{ width: '95px' }}>تاريخ العطل</th>
                    <th className="border border-slate-300 p-2 text-center" style={{ width: '100px' }}>رقم التيكت</th>
                    <th className="border border-slate-300 p-2 text-center" style={{ width: '50px' }}>العدد</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 ? (
                    records.map((rec, index) => (
                      <tr key={rec.rowIndex || index} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center font-bold">{index + 1}</td>
                        <td className="border border-slate-300 p-2 text-center font-mono">{rec.schoolCode || '-'}</td>
                        <td className="border border-slate-300 p-2 text-right font-semibold">{rec.schoolName}</td>
                        <td className="border border-slate-300 p-2 text-right">{rec.administration}</td>
                        <td className="border border-slate-300 p-2 text-center">{rec.category}</td>
                        <td className="border border-slate-300 p-2 text-right">{rec.device}</td>
                        <td className="border border-slate-300 p-2 text-center font-mono">{rec.faultDate}</td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-900">{rec.ticketNumber}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold bg-amber-50">{rec.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="border border-slate-300 p-6 text-center text-slate-500">
                        لا توجد سجلات أعطال مطابقة للشروط المحددة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Statistics Bar */}
            <div className="flex flex-wrap items-center justify-between border-2 border-[#0a2647] bg-slate-50 p-4 rounded-lg text-sm font-bold mb-8 gap-4">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-file-circle-check text-blue-800 text-base"></i>
                <span>إجمالي عدد البلاغات المسجلة بالتقرير: </span>
                <span className="font-mono text-blue-900 text-base underline ms-1">
                  {summary.totalTickets} بلاغ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-laptop-medical text-amber-700 text-base"></i>
                <span>إجمالي عدد الأجهزة المعطلة (مجموع الأعداد): </span>
                <span className="font-mono text-amber-800 text-base underline ms-1">
                  {summary.totalDevices} جهاز
                </span>
              </div>
            </div>

            {/* Official Signatures Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-bold pt-4 border-t border-slate-400">
              <div>
                <div className="mb-8 text-slate-700">إعداد ومتابعة الدعم الفني:</div>
                <div className="text-slate-400">..............................</div>
              </div>
              <div>
                <div className="mb-8 text-slate-700">مسؤول التطوير بالإدارة:</div>
                <div className="text-slate-400">..............................</div>
              </div>
              <div>
                <div className="mb-8 text-slate-700">رئيس قسم الصيانة والدعم:</div>
                <div className="text-slate-400">..............................</div>
              </div>
              <div>
                <div className="mb-2 text-slate-800">يعتمد، مدير مركز التطوير التكنولوجي:</div>
                <div className="font-extrabold text-[#0a2647] text-sm mt-4">السيد السعدنى</div>
              </div>
            </div>

            {/* Footer watermark note */}
            <div className="text-center text-[10px] text-slate-500 mt-8 border-t border-slate-200 pt-3">
              وثيقة رسمية معتمدة صادرة آلياً من منظومة مركز التطوير التكنولوجي - مديرية التربية والتعليم بمحافظة البحيرة
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            مركز التطوير التكنولوجي - محافظة البحيرة
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="tdc-btn-pill bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold"
            >
              رجوع إلى قائمة التقارير
            </button>
            <button
              type="button"
              onClick={handlePrintNow}
              className="tdc-btn-pill tdc-btn-gold text-xs sm:text-sm font-bold shadow"
            >
              <i className="fa-solid fa-print"></i>
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
