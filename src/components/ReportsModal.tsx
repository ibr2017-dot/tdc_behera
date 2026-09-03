import React, { useState, useEffect } from 'react';
import { SchoolItem, FaultRecord, ReportSummary } from '../types';
import { gasBackend } from '../services/googleAppsScriptSimulator';

interface ReportsModalProps {
  isOpen: boolean;
  mode: 'school' | 'administration';
  onClose: () => void;
  schools: SchoolItem[];
  onTriggerPrint: (
    title: string,
    records: FaultRecord[],
    summary: ReportSummary,
    printDate: string
  ) => void;
  showToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  mode,
  onClose,
  schools,
  onTriggerPrint,
  showToast,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [reportRecords, setReportRecords] = useState<FaultRecord[]>([]);
  const [reportSummary, setReportSummary] = useState<ReportSummary>({ totalTickets: 0, totalDevices: 0 });

  // Current print date/time
  const currentFormattedDate = new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date());

  // Unique Administrations
  const administrationsList = Array.from(new Set(schools.map((s) => s.administration))).sort();

  // Filtered Schools by selected administration
  const filteredSchools = (selectedAdmin && selectedAdmin !== 'all')
    ? schools.filter((s) => s.administration === selectedAdmin)
    : [];

  // Reusable report loader
  const loadReportData = async (adminVal: string, schoolVal: string) => {
    setIsLoading(true);
    try {
      const response = await gasBackend.getReportData(mode, adminVal, schoolVal);
      if (response.success && response.data) {
        setReportRecords(response.data.records);
        setReportSummary(response.data.summary);
        setHasGenerated(true);
        return response.data;
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'فشل جلب بيانات التقرير';
      showToast('danger', 'خطأ في التقرير', errText);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  // Auto load report when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      const initialAdmin = 'all';
      const initialSchool = 'all';
      setSelectedAdmin(initialAdmin);
      setSelectedSchool(initialSchool);
      loadReportData(initialAdmin, initialSchool);
    }
  }, [isOpen, mode]);

  // Dynamic Title
  const dynamicReportTitle =
    mode === 'school'
      ? selectedSchool && selectedSchool !== 'all'
        ? `تقرير أعطال مدرسة: ${selectedSchool} - ${selectedAdmin === 'all' ? 'جميع الإدارات' : selectedAdmin}`
        : selectedAdmin && selectedAdmin !== 'all'
        ? `تقرير أعطال مدارس: ${selectedAdmin}`
        : 'تقرير أعطال المدارس (عام لكافة الإدارات)'
      : selectedAdmin && selectedAdmin !== 'all'
      ? `تقرير أعطال مدارس: ${selectedAdmin}`
      : 'تقرير أعطال الإدارات التعليمية (شامل المحافظة)';

  // Handle Admin Change
  const handleAdminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAdmin(val);
    setSelectedSchool('all');
    loadReportData(val, 'all');
  };

  // Handle School Change
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSchool(val);
    loadReportData(selectedAdmin, val);
  };

  // Fetch Report Data manually on Clicking "عرض"
  const handleFetchReport = async () => {
    const data = await loadReportData(selectedAdmin, selectedSchool);
    if (data) {
      showToast('success', 'تم تحديث التقرير', `تم استعراض ${data.records.length} بلاغ أعطال بنجاح.`);
    }
  };

  // Print Report Handler - Works immediately under all circumstances!
  const handlePrintClick = async () => {
    let recs = reportRecords;
    let summary = reportSummary;

    // If records not loaded yet, fetch immediately!
    if (!hasGenerated || recs.length === 0) {
      const fetched = await loadReportData(selectedAdmin, selectedSchool);
      if (fetched) {
        recs = fetched.records;
        summary = fetched.summary;
      }
    }

    if (recs.length === 0) {
      showToast(
        'info',
        'لا توجد بلاغات',
        'التقرير فارغ ولا توجد بلاغات أعطال مسجلة ضمن المعايير المحددة للطباعة.'
      );
      return;
    }

    showToast('success', 'معاينة واعتماد الطباعة', 'تم تجهيز التقرير وفتح شاشة المعاينة والطباعة.');
    onTriggerPrint(dynamicReportTitle, recs, summary, currentFormattedDate);
  };

  // Export CSV / Excel
  const handleExportCSV = () => {
    if (reportRecords.length === 0) {
      showToast('warning', 'تنبيه التصدير', 'لا توجد بيانات متاحة للتصدير حالياً.');
      return;
    }

    const headers = ['م', 'كود المدرسة', 'المدرسة', 'الإدارة', 'فئة العطل', 'الجهاز المعطل', 'تاريخ العطل', 'رقم التيكت', 'العدد', 'ملاحظات'];
    const rows = reportRecords.map((r, idx) => [
      idx + 1,
      `"${r.schoolCode}"`,
      `"${r.schoolName}"`,
      `"${r.administration}"`,
      `"${r.category}"`,
      `"${r.device}"`,
      `"${r.faultDate}"`,
      `"${r.ticketNumber}"`,
      r.count,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${dynamicReportTitle.replace(/[/\\?%*:|"<>]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'تم تصدير التقرير', 'تم تنزيل ملف الإكسيل المعتمد بنجاح.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto animate-fade-in no-print">
      <div className="bg-white rounded-[28px] shadow-2xl border border-slate-300 w-full max-w-5xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Official Banner Header (Fixed Official Header) */}
        <div className="bg-gradient-to-r from-[#0a2647] via-[#144272] to-[#205295] text-white p-4 sm:p-5 border-b-4 border-amber-400">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 text-center md:text-right">
            
            {/* Right: Official Ministry / Governorate Header */}
            <div>
              <div className="text-xs font-bold text-amber-300">جمهورية مصر العربية</div>
              <div className="text-xs font-medium text-slate-200">محافظة البحيرة / مديرية التربية والتعليم</div>
              <div className="text-sm font-bold text-white">مركز التطوير التكنولوجي</div>
            </div>

            {/* Center: Dynamic Report Title */}
            <div className="text-center">
              <span className="inline-block bg-white/15 text-amber-200 px-3 py-0.5 rounded-full text-xs font-bold mb-1 border border-amber-300/30">
                {mode === 'school' ? 'نموذج تقرير مدرسة' : 'نموذج تقرير إدارة تعليمية'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-0">
                {dynamicReportTitle}
              </h3>
            </div>

            {/* Left: Print Date & Close */}
            <div className="flex items-center justify-center md:justify-end gap-3 text-xs">
              <div className="text-slate-200 text-center md:text-left bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-amber-300">تاريخ الطباعة المعتمد:</div>
                <div className="font-semibold">{currentFormattedDate}</div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-300 hover:text-white hover:bg-white/15 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                title="إغلاق النافذة"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

          </div>
        </div>

        {/* Modal Controls Section: Administration / School / "عرض" Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-end gap-3 flex-wrap">
            
            {/* Administration Selection */}
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <i className="fa-solid fa-building-columns text-blue-900 me-1"></i>
                الإدارة التعليمية:
              </label>
              <select
                value={selectedAdmin}
                onChange={handleAdminChange}
                className="w-full tdc-input bg-white text-sm font-semibold"
              >
                <option value="all">-- جميع الإدارات التعليمية --</option>
                {administrationsList.map((adm) => (
                  <option key={adm} value={adm}>
                    {adm}
                  </option>
                ))}
              </select>
            </div>

            {/* School Selection: ONLY visible in 'school' mode! */}
            {mode === 'school' && (
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <i className="fa-solid fa-school text-blue-900 me-1"></i>
                  المدرسة:
                </label>
                <select
                  disabled={selectedAdmin === 'all'}
                  value={selectedSchool}
                  onChange={handleSchoolChange}
                  className="w-full tdc-input bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="all">
                    {selectedAdmin === 'all' ? '-- كافة مدارس المحافظة --' : '-- جميع مدارس الإدارة --'}
                  </option>
                  {filteredSchools.map((sch) => (
                    <option key={sch.schoolCode} value={sch.schoolName}>
                      {sch.schoolName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons: "عرض" & "طباعة" & "تصدير" */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleFetchReport}
                disabled={isLoading}
                className="tdc-btn-pill tdc-btn-primary text-sm shadow-md"
                title="تحديث وعرض البيانات"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>جاري الجلب...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span>تحديث العرض</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrintClick}
                disabled={isLoading}
                className="tdc-btn-pill tdc-btn-gold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
                title="طباعة تقرير منسق A4"
              >
                <i className="fa-solid fa-print"></i>
                <span>طباعة التقرير</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={reportRecords.length === 0}
                className="tdc-btn-pill bg-emerald-700 hover:bg-emerald-800 text-white text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="تنزيل كملف Excel / CSV"
              >
                <i className="fa-solid fa-file-excel"></i>
                <span>تصدير Excel</span>
              </button>
            </div>

          </div>
        </div>

        {/* Modal Body: Results Table & Skeleton Shimmer or Empty State */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isLoading ? (
            /* Skeleton Shimmer Loading */
            <div className="space-y-3">
              <div className="skeleton-shimmer h-10 w-full"></div>
              <div className="skeleton-shimmer h-12 w-full"></div>
              <div className="skeleton-shimmer h-12 w-full"></div>
              <div className="skeleton-shimmer h-12 w-full"></div>
              <div className="skeleton-shimmer h-12 w-full"></div>
            </div>
          ) : !hasGenerated ? (
            /* Waiting State */
            <div className="text-center py-12 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-800 mx-auto flex items-center justify-center text-3xl mb-3">
                <i className="fa-solid fa-file-waveform"></i>
              </div>
              <h5 className="font-bold text-slate-700 text-base">بانتظار تحديد معايير التقرير</h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                اختر {mode === 'school' ? 'الإدارة التعليمية والمدرسة' : 'الإدارة التعليمية'} ثم اضغط على زر "عرض التقرير" لاستعراض بلاغات الأعطال المسجلة.
              </p>
            </div>
          ) : reportRecords.length === 0 ? (
            /* No Results State */
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-2xl mb-2">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h5 className="font-bold text-slate-700 text-sm">لا توجد بلاغات أعطال مسجلة</h5>
              <p className="text-xs text-slate-500">
                لم يتم العثور على أي أعطال مسجلة وفقاً لاختياراتك الحالية في قاعدة بيانات Data.
              </p>
            </div>
          ) : (
            /* Table of Records */
            <div className="tdc-table-wrapper overflow-x-auto shadow-sm">
              <table className="table tdc-table mb-0 w-full text-right">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>م</th>
                    <th>كود المدرسة</th>
                    <th>المدرسة</th>
                    <th>الإدارة</th>
                    <th>الفئة</th>
                    <th>الجهاز المعطل</th>
                    <th>تاريخ العطل</th>
                    <th>رقم التيكت</th>
                    <th>العدد</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRecords.map((rec, idx) => (
                    <tr key={rec.rowIndex || idx}>
                      <td className="font-bold text-slate-600">{idx + 1}</td>
                      <td>
                        <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                          {rec.schoolCode}
                        </span>
                      </td>
                      <td className="font-bold text-slate-800">{rec.schoolName}</td>
                      <td className="text-slate-600 text-xs">{rec.administration}</td>
                      <td>
                        <span className="badge-primary-custom text-xs">{rec.category}</span>
                      </td>
                      <td className="text-slate-800 font-medium">{rec.device}</td>
                      <td className="text-slate-600 font-mono text-xs">{rec.faultDate}</td>
                      <td>
                        <span className="font-mono font-semibold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {rec.ticketNumber}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-slate-800 px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                          {rec.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer Summary Bar */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-300 shadow-sm text-xs font-semibold text-slate-700">
              <i className="fa-solid fa-file-lines text-blue-700"></i>
              <span>إجمالي عدد البلاغات:</span>
              <span className="badge-primary-custom py-0.5 px-2">{reportSummary.totalTickets}</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-amber-300 shadow-sm text-xs font-semibold text-slate-800">
              <i className="fa-solid fa-boxes-stacked text-amber-600"></i>
              <span>إجمالي الأجهزة المعطلة:</span>
              <span className="badge-gold py-0.5 px-2">{reportSummary.totalDevices}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={reportRecords.length === 0}
              className="tdc-btn-pill bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-file-excel"></i>
              <span>تصدير Excel</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="tdc-btn-pill bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>إغلاق</span>
            </button>

            <button
              type="button"
              id="btnPrintReportDocument"
              onClick={handlePrintClick}
              disabled={isLoading}
              className="tdc-btn-pill tdc-btn-gold text-xs sm:text-sm shadow-md font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="معاينة وطباعة المستند الرسمي المعتمد"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-print"></i>
              )}
              <span>طباعة المستند</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
