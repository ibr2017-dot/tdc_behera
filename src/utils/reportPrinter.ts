import { FaultRecord, ReportSummary } from '../types';

/**
 * Generate a complete, self-contained, standalone printable HTML document.
 * Works flawlessly in all browsers, external tabs, and offline printing without iframe restrictions.
 */
export function generateReportHtml(
  reportTitle: string,
  records: FaultRecord[],
  summary: ReportSummary,
  printDate: string
): string {
  const verificationCode = `TDC-BHR-${Math.floor(100000 + Math.random() * 900000)}`;

  const tableRows = records.map((rec, index) => `
    <tr>
      <td style="font-weight: bold; text-align: center;">${index + 1}</td>
      <td style="font-family: monospace; text-align: center;">${rec.schoolCode || '-'}</td>
      <td style="font-weight: 600; text-align: right;">${rec.schoolName}</td>
      <td style="text-align: right;">${rec.administration}</td>
      <td style="text-align: center;">${rec.category}</td>
      <td style="text-align: right;">${rec.device}</td>
      <td style="font-family: monospace; text-align: center;">${rec.faultDate}</td>
      <td style="font-family: monospace; font-weight: bold; text-align: center;">${rec.ticketNumber}</td>
      <td style="font-weight: bold; text-align: center; background-color: #fef3c7;">${rec.count}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", "Tahoma", sans-serif;
      margin: 0;
      padding: 12mm;
      color: #111827;
      background-color: #ffffff;
      direction: rtl;
    }
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0a2647;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-right {
      text-align: right;
      font-size: 13px;
      line-height: 1.6;
    }
    .header-right .gov-title {
      font-size: 15px;
      font-weight: bold;
      color: #0a2647;
    }
    .header-center {
      text-align: center;
    }
    .report-title-badge {
      display: inline-block;
      border: 2px solid #0a2647;
      background: #f8fafc;
      padding: 8px 24px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      color: #0a2647;
      margin-bottom: 4px;
    }
    .header-left {
      text-align: left;
      font-size: 12px;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      margin-bottom: 16px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #334155;
      padding: 7px 6px;
      vertical-align: middle;
    }
    th {
      background-color: #f1f5f9;
      color: #0a2647;
      font-weight: bold;
      text-align: center;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .summary-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 2px solid #0a2647;
      background-color: #f8fafc;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .summary-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .summary-val {
      font-size: 16px;
      color: #0a2647;
      text-decoration: underline;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      border-top: 1px solid #cbd5e1;
      padding-top: 14px;
      margin-top: 20px;
    }
    .sig-role {
      color: #334155;
      margin-bottom: 28px;
    }
    .sig-dots {
      color: #94a3b8;
    }
    .sig-director {
      color: #0a2647;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
    }
    .footer-note {
      text-align: center;
      font-size: 11px;
      color: #64748b;
      margin-top: 20px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
    .no-print-bar {
      background: #0a2647;
      color: white;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: -12mm -12mm 16px -12mm;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .no-print-bar button {
      background: #e8b86d;
      color: #0a2647;
      font-weight: bold;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>مركز التطوير التكنولوجي بمحافظة البحيرة</strong> - مستند التقرير الرسمي المعتمد</div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()">🖨️ طباعة الآن (Print)</button>
      <button onclick="window.close()" style="background:#cbd5e1; color:#0f172a;">إغلاق النافذة</button>
    </div>
  </div>

  <div class="header-box">
    <div class="header-right">
      <div class="gov-title">جمهورية مصر العربية</div>
      <div>وزارة التربية والتعليم والتعليم الفني</div>
      <div style="font-weight: 600;">مديرية التربية والتعليم بمحافظة البحيرة</div>
      <div style="color: #0a2647; font-weight: bold;">مركز التطوير التكنولوجي (TDC)</div>
    </div>

    <div class="header-center">
      <div class="report-title-badge">${reportTitle}</div>
      <div style="font-size: 12px; color: #475569; margin-top: 4px;">
        نظام إدارة ومتابعة أعطال الأجهزة بالمدارس - البحيرة
      </div>
    </div>

    <div class="header-left">
      <div><strong>تاريخ وتوقيت التقرير:</strong></div>
      <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #0a2647;">${printDate}</div>
      <div style="color: #64748b; margin-top: 4px;">كود التحقق: <span style="font-family: monospace;">${verificationCode}</span></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 38px;">م</th>
        <th style="width: 85px;">كود المدرسة</th>
        <th>اسم المدرسة</th>
        <th>الإدارة التعليمية</th>
        <th>فئة العطل</th>
        <th>الجهاز المعطل</th>
        <th style="width: 90px;">تاريخ العطل</th>
        <th style="width: 100px;">رقم التيكت</th>
        <th style="width: 50px;">العدد</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows.length > 0 ? tableRows : '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #64748b;">لا توجد بلاغات أعطال مسجلة</td></tr>'}
    </tbody>
  </table>

  <div class="summary-box">
    <div class="summary-item">
      <span>إجمالي عدد البلاغات المسجلة:</span>
      <span class="summary-val">${summary.totalTickets} بلاغ</span>
    </div>
    <div class="summary-item">
      <span>إجمالي عدد الأجهزة المعطلة:</span>
      <span class="summary-val" style="color: #b45309;">${summary.totalDevices} جهاز</span>
    </div>
  </div>

  <div class="signatures-grid">
    <div>
      <div class="sig-role">إعداد ومتابعة الدعم الفني:</div>
      <div class="sig-dots">..............................</div>
    </div>
    <div>
      <div class="sig-role">مسؤول التطوير بالإدارة:</div>
      <div class="sig-dots">..............................</div>
    </div>
    <div>
      <div class="sig-role">رئيس قسم الصيانة والدعم:</div>
      <div class="sig-dots">..............................</div>
    </div>
    <div>
      <div class="sig-role">يعتمد، مدير مركز التطوير التكنولوجي:</div>
      <div class="sig-director">السيد السعدنى</div>
    </div>
  </div>

  <div class="footer-note">
    وثيقة رسمية معتمدة صادرة آلياً من مركز التطوير التكنولوجي - مديرية التربية والتعليم بالبحيرة
  </div>

  <script>
    // Automatically trigger print dialog when opened in a new tab/window
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Downloads the printable report as a standalone HTML file.
 * The user can save or double click this file to print or save as PDF from any browser.
 */
export function downloadReportHtml(
  reportTitle: string,
  records: FaultRecord[],
  summary: ReportSummary,
  printDate: string
): void {
  const htmlContent = generateReportHtml(reportTitle, records, summary, printDate);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = reportTitle.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'تقرير_أعطال_المدارس';
  link.download = `${safeName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Attempts to open the report in a new browser tab/window for direct printing.
 */
export function openReportInNewTab(
  reportTitle: string,
  records: FaultRecord[],
  summary: ReportSummary,
  printDate: string
): boolean {
  try {
    const htmlContent = generateReportHtml(reportTitle, records, summary, printDate);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, '_blank');
    if (newWindow) {
      newWindow.focus();
      return true;
    }
  } catch (err) {
    console.warn('Failed to open report in new tab:', err);
  }
  return false;
}
