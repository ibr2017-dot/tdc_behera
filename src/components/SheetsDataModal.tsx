import React, { useState } from 'react';
import { gasBackend, GOOGLE_APPS_SCRIPT_CODE_GS } from '../services/googleAppsScriptSimulator';

interface SheetsDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
  showToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
}

export const SheetsDataModal: React.FC<SheetsDataModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'Data' | 'Schools' | 'Faults' | 'Users' | 'CodeGs'>('Data');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const sheets = gasBackend.getAllSheetsRaw();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE_GS);
      setCopiedCode(true);
      showToast('success', 'تم النسخ', 'تم نسخ كود Code.gs بالكامل إلى الحافظة بنجاح.');
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      showToast('warning', 'تنبيه', 'تعذر النسخ التلقائي، يمكنك تحديد النص ونسخه يدوياً.');
    }
  };

  const handleResetData = () => {
    gasBackend.resetDatabase();
    if (onDataReset) onDataReset();
    setShowResetConfirm(false);
    showToast('success', 'تمت الاستعادة', 'تمت إعادة ضبط شيتات قاعدة البيانات بنجاح.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in no-print">
      <div className="bg-white rounded-[28px] shadow-2xl border border-slate-300 w-full max-w-5xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a2647] via-[#144272] to-[#205295] text-white p-4 sm:p-5 flex items-center justify-between border-b-4 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-md">
              <i className="fa-solid fa-file-excel"></i>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-0">
                مستعرض قاعدة بيانات Google Sheets وكود Backend (Code.gs)
              </h3>
              <p className="text-xs text-slate-200 mb-0">
                شيتات المنظومة الأربعة: Users, Schools, Faults, Data ومطابقتها المباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-700/80 px-2.5 py-1 rounded-full border border-rose-400/40 text-xs text-white animate-fade-in">
                <span>تأكيد الاستعادة؟</span>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="bg-white text-rose-700 font-bold px-2 py-0.5 rounded-full hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  نعم
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-black/30 hover:bg-black/50 text-white px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="tdc-btn-pill bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 cursor-pointer shadow-sm active:scale-95"
                title="إعادة ضبط البيانات إلى البيانات الافتراضية"
              >
                <i className="fa-solid fa-rotate-right"></i>
                <span>استعادة الافتراضي</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/15 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-slate-100 p-2 sm:p-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('Data')}
              className={`tdc-btn-pill text-xs sm:text-sm py-1.5 px-3.5 ${
                activeTab === 'Data' ? 'tdc-btn-primary shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-table-list text-amber-500"></i>
              <span>شيت Data ({sheets.data.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Schools')}
              className={`tdc-btn-pill text-xs sm:text-sm py-1.5 px-3.5 ${
                activeTab === 'Schools' ? 'tdc-btn-primary shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-school text-emerald-500"></i>
              <span>شيت Schools ({sheets.schools.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Faults')}
              className={`tdc-btn-pill text-xs sm:text-sm py-1.5 px-3.5 ${
                activeTab === 'Faults' ? 'tdc-btn-primary shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-triangle-exclamation text-rose-500"></i>
              <span>شيت Faults ({sheets.faults.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Users')}
              className={`tdc-btn-pill text-xs sm:text-sm py-1.5 px-3.5 ${
                activeTab === 'Users' ? 'tdc-btn-primary shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-users text-blue-500"></i>
              <span>شيت Users ({sheets.users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CodeGs')}
              className={`tdc-btn-pill text-xs sm:text-sm py-1.5 px-3.5 ${
                activeTab === 'CodeGs' ? 'tdc-btn-gold shadow-sm' : 'bg-white text-slate-800 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-code text-blue-900"></i>
              <span>كود Code.gs الأصلي</span>
            </button>
          </div>

          {activeTab === 'CodeGs' && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="tdc-btn-pill tdc-btn-gold text-xs shadow-sm py-1.5 px-3.5"
            >
              <i className={`fa-solid ${copiedCode ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copiedCode ? 'تم النسخ!' : 'نسخ كود Code.gs'}</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'Data' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>أعمدة شيت Data: م | الإدارة | المدرسة | كود المدرسة | الفئة | الجهاز المعطل | تاريخ العطل | رقم التيكت | متلقي البلاغ | العدد | ملاحظات</span>
                <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">إجمالي: {sheets.data.length} سجل</span>
              </div>
              <div className="tdc-table-wrapper overflow-x-auto">
                <table className="table tdc-table mb-0 w-full text-xs text-right">
                  <thead>
                    <tr>
                      <th>م</th>
                      <th>الصف (rowIndex)</th>
                      <th>الإدارة</th>
                      <th>المدرسة</th>
                      <th>كود المدرسة</th>
                      <th>الفئة</th>
                      <th>الجهاز المعطل</th>
                      <th>تاريخ العطل</th>
                      <th>رقم التيكت</th>
                      <th>متلقي البلاغ</th>
                      <th>العدد</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets.data.map((row) => (
                      <tr key={row.rowIndex}>
                        <td className="font-bold">{row.seq}</td>
                        <td className="font-mono text-blue-700 font-bold bg-blue-50/50">{row.rowIndex}</td>
                        <td>{row.administration}</td>
                        <td className="font-semibold">{row.schoolName}</td>
                        <td className="font-mono">{row.schoolCode}</td>
                        <td>{row.category}</td>
                        <td>{row.device}</td>
                        <td className="font-mono">{row.faultDate}</td>
                        <td className="font-mono font-bold text-amber-900">{row.ticketNumber}</td>
                        <td>{row.receiverName}</td>
                        <td className="font-bold">{row.count}</td>
                        <td className="text-slate-500 truncate max-w-xs">{row.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Schools' && (
            <div>
              <div className="text-xs text-slate-500 mb-3">
                أعمدة شيت Schools: الإدارة | المدرسة | كود المدرسة
              </div>
              <div className="tdc-table-wrapper overflow-x-auto">
                <table className="table tdc-table mb-0 w-full text-xs text-right">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>م</th>
                      <th>الإدارة التعليمية</th>
                      <th>اسم المدرسة</th>
                      <th>كود المدرسة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets.schools.map((sch, i) => (
                      <tr key={sch.schoolCode + i}>
                        <td>{i + 1}</td>
                        <td className="font-semibold">{sch.administration}</td>
                        <td>{sch.schoolName}</td>
                        <td className="font-mono font-bold text-blue-800">{sch.schoolCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Faults' && (
            <div>
              <div className="text-xs text-slate-500 mb-3">
                أعمدة شيت Faults (البيانات المرجعية للأجهزة والأعطال): الفئة | الجهاز
              </div>
              <div className="tdc-table-wrapper overflow-x-auto">
                <table className="table tdc-table mb-0 w-full text-xs text-right">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>م</th>
                      <th>فئة الجهاز / العطل</th>
                      <th>اسم الجهاز ونوعه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets.faults.map((f, i) => (
                      <tr key={f.device + i}>
                        <td>{i + 1}</td>
                        <td className="font-semibold text-blue-900">{f.category}</td>
                        <td>{f.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div>
              <div className="text-xs text-slate-500 mb-3">
                أعمدة شيت Users: username | password
              </div>
              <div className="tdc-table-wrapper overflow-x-auto">
                <table className="table tdc-table mb-0 w-full text-xs text-right">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>م</th>
                      <th>اسم المستخدم (username)</th>
                      <th>كلمة المرور (password)</th>
                      <th>الدور والوظيفة</th>
                      <th>الاسم بالكامل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheets.users.map((u, i) => (
                      <tr key={u.username + i}>
                        <td>{i + 1}</td>
                        <td className="font-mono font-bold text-blue-900">{u.username}</td>
                        <td className="font-mono text-slate-600 font-bold">{u.password}</td>
                        <td>
                          <span className="badge-primary-custom text-[11px]">{u.role || 'مستخدم'}</span>
                        </td>
                        <td className="font-medium">{u.fullName || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'CodeGs' && (
            <div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-amber-600 text-base"></i>
                  <span>
                    هذا هو كود Google Apps Script الأصلي الكامل (Code.gs). يمكنك نسخه ولصقه مباشرة في محرر النصوص البرمجية داخل شيت Google Sheets لديك (من قائمة: Extensions &gt; Apps Script).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="tdc-btn-pill tdc-btn-gold text-xs py-1 px-3"
                >
                  <i className="fa-solid fa-copy me-1"></i>
                  نسخ الكود
                </button>
              </div>

              <pre dir="ltr" className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[55vh] border border-slate-700 leading-relaxed text-left">
                <code>{GOOGLE_APPS_SCRIPT_CODE_GS}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="tdc-btn-pill bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs sm:text-sm px-5"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
