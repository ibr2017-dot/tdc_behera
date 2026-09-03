import React from 'react';
import { FaultRecord, ReportSummary } from '../types';

interface PrintSectionProps {
  reportTitle: string;
  records: FaultRecord[];
  summary: ReportSummary;
  printDate: string;
}

export const PrintSection: React.FC<PrintSectionProps> = ({
  reportTitle,
  records,
  summary,
  printDate,
}) => {
  return (
    <div id="printableReportSection" dir="rtl" className="p-8 text-black bg-white">
      {/* Official Print Header */}
      <div className="print-page-header flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
        
        {/* Right side: Official Ministry / Governorate / TDC info */}
        <div className="text-right text-sm leading-relaxed">
          <div className="font-bold text-base">جمهورية مصر العربية</div>
          <div>وزارة التربية والتعليم والتعليم الفني</div>
          <div className="font-semibold">مديرية التربية والتعليم بمحافظة البحيرة</div>
          <div className="font-bold text-blue-900 text-sm">مركز التطوير التكنولوجي (TDC)</div>
        </div>

        {/* Center: Dynamic Report Title & Emblem */}
        <div className="text-center">
          <div className="border border-slate-900 px-6 py-2 rounded-lg bg-slate-100 inline-block mb-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-0">
              {reportTitle || 'تقرير بيان أعطال الأجهزة التكنولوجية بالمدارس'}
            </h2>
          </div>
          <div className="text-xs text-slate-600 mt-1">
            نظام المتابعة الرقمية الموحد لقواعد بيانات Google Sheets
          </div>
        </div>

        {/* Left side: Date of generation & Verification Code */}
        <div className="text-left text-xs leading-relaxed">
          <div className="font-bold text-slate-700">تاريخ وتوقيت الطباعة:</div>
          <div className="font-mono text-slate-900 font-bold">{printDate}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            كود التحقق: <span className="font-mono">TDC-BHR-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

      </div>

      {/* Report Records Table */}
      <table className="print-table w-full mb-6 text-sm border-collapse">
        <thead>
          <tr className="bg-slate-200">
            <th style={{ width: '35px' }}>م</th>
            <th style={{ width: '85px' }}>كود المدرسة</th>
            <th>اسم المدرسة</th>
            <th>الإدارة التعليمية</th>
            <th>فئة العطل</th>
            <th>الجهاز المعطل</th>
            <th style={{ width: '90px' }}>تاريخ العطل</th>
            <th style={{ width: '95px' }}>رقم التيكت</th>
            <th style={{ width: '45px' }}>العدد</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((rec, index) => (
              <tr key={rec.rowIndex || index}>
                <td className="font-bold">{index + 1}</td>
                <td className="font-mono">{rec.schoolCode}</td>
                <td className="font-semibold text-right">{rec.schoolName}</td>
                <td className="text-right">{rec.administration}</td>
                <td>{rec.category}</td>
                <td className="text-right">{rec.device}</td>
                <td className="font-mono">{rec.faultDate}</td>
                <td className="font-mono font-bold">{rec.ticketNumber}</td>
                <td className="font-bold">{rec.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-6 text-slate-500">
                لا توجد سجلات مطابقة للطباعة
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary Totals Bar */}
      <div className="flex items-center justify-between border-2 border-slate-700 bg-slate-50 p-3 rounded-lg text-sm font-bold mb-8">
        <div>
          <span>إجمالي عدد البلاغات المسجلة: </span>
          <span className="font-mono text-blue-900 text-base underline ms-1">
            {summary.totalTickets} بلاغ
          </span>
        </div>
        <div>
          <span>إجمالي عدد الأجهزة المعطلة (مجموع الأعداد): </span>
          <span className="font-mono text-amber-800 text-base underline ms-1">
            {summary.totalDevices} جهاز
          </span>
        </div>
      </div>

      {/* Official Signatures Section */}
      <div className="print-signatures grid grid-cols-4 gap-4 text-center text-xs font-bold pt-4 border-t border-slate-400">
        <div>
          <div className="mb-8">إعداد ومتابعة الدعم الفني:</div>
          <div className="text-slate-500">..............................</div>
        </div>
        <div>
          <div className="mb-8">مسؤول التطوير بالإدارة:</div>
          <div className="text-slate-500">..............................</div>
        </div>
        <div>
          <div className="mb-8">رئيس قسم الصيانة والدعم:</div>
          <div className="text-slate-500">..............................</div>
        </div>
        <div>
          <div className="mb-2">يعتمد، مدير مركز التطوير التكنولوجي:</div>
          <div className="font-bold text-slate-800 text-sm mt-4">السيد السعدنى</div>
        </div>
      </div>

      {/* Footer watermark note */}
      <div className="text-center text-[10px] text-slate-500 mt-8 border-t border-slate-200 pt-2">
        وثيقة رسمية صادرة آلياً من منظومة مركز التطوير التكنولوجي - مديرية التربية والتعليم بمحافظة البحيرة (Google Sheets Backend)
      </div>
    </div>
  );
};
