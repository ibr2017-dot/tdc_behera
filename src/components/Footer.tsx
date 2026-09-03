import React from 'react';

/**
 * =========================================================================
 * حقول التذييل الثابت القابلة للتعديل بسهولة (Customizable Footer Fields)
 * =========================================================================
 */
export const FOOTER_CONFIG = {
  // رقم تليفون التواصل والدعم الفني
  contactPhone: '045-3312345',
  contactMobile: '01002345678',

  // رابط صفحة فيسبوك
  facebookPageUrl: 'https://www.facebook.com/profile.php?id=100087442746010',

  // سطر المصمم
  designerCredit: 'تصميم: إبراهيم الشيخ',

  // الإدارة والمديرية
  directorateName: 'مديرية التربية والتعليم بمحافظة البحيرة',
  centerName: 'مركز التطوير التكنولوجي - ديوان عام المديرية بدمنهور',
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a2647] text-white border-t border-white/10 no-print py-3 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-medium">
        
        {/* Contact info with gold indicators */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 bg-[#e8b86d] rounded-full inline-block"></span>
            <span>هاتف الدعم: <span dir="ltr" className="font-bold text-white">{FOOTER_CONFIG.contactPhone}</span></span>
          </span>
          <span className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 bg-[#e8b86d] rounded-full inline-block"></span>
            <span>واتساب: <span dir="ltr" className="font-bold text-white">{FOOTER_CONFIG.contactMobile}</span></span>
          </span>
          <a
            href={FOOTER_CONFIG.facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors"
          >
            <span className="w-2 h-2 bg-[#e8b86d] rounded-full inline-block"></span>
            <span>فيسبوك: <span dir="ltr">it.behera.edu</span></span>
          </a>
        </div>

        {/* Center Directorate Copyright */}
        <div className="opacity-75 text-center text-[11px] sm:text-xs">
          © {new Date().getFullYear()} {FOOTER_CONFIG.centerName} - {FOOTER_CONFIG.directorateName}
        </div>

        {/* Designer Credit with gold text */}
        <div className="text-[#e8b86d] font-semibold text-center text-xs">
          {FOOTER_CONFIG.designerCredit}
        </div>

      </div>
    </footer>
  );
};
