import React, { useState } from 'react';
import { gasBackend } from '../services/googleAppsScriptSimulator';
import { UserAccount } from '../types';

interface LoginSectionProps {
  onLoginSuccess: (user: UserAccount) => void;
  showToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    setIsLoading(true);

    try {
      // Direct call or google.script.run equivalent
      const response = await gasBackend.checkLogin(username, password);
      if (response.success && response.data) {
        showToast('success', 'تم الدخول بنجاح', response.message);
        onLoginSuccess(response.data);
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'بيانات الدخول غير صحيحة أو حدث خطأ بالنظام';
      setErrorMessage(errText);
      showToast('danger', 'خطأ في تسجيل الدخول', errText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div id="loginSection" className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-8">
        <span className="inline-block bg-[#f7e4c3] text-[#c99f4a] border border-[#e8b86d] text-xs font-bold px-4 py-1 rounded-full mb-2 shadow-sm">
          بوابة منظومة الاعطال
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a2647] tracking-tight">
          تسجيل الدخول لمنظومة إدارة أعطال المدارس
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1">
          متابعة وتحديث بلاغات الأعطال للأجهزة التكنولوجية بالمدارس والإدارات التعليمية بالبحيرة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: كلمة مدير المركز (Welcome & Official Message) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-md border border-[#e6edf5] flex-1 flex flex-col justify-between relative overflow-hidden">
            {/* Watermark icon */}
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
              <i className="fa-solid fa-laptop-code text-9xl"></i>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5 border-b border-[#f1f5f9] pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#144272] text-[#e8b86d] flex items-center justify-center text-xl shadow-md">
                  <i className="fa-solid fa-quote-right"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0a2647] mb-0 flex items-center gap-2">
                    <span className="w-2 h-5 bg-[#e8b86d] rounded-full inline-block"></span>
                    كلمة مدير المركز
                  </h3>
                  <p className="text-xs text-slate-500 mb-0">رؤية مركز التطوير التكنولوجي بالبحيرة للدعم الفني الرقمي</p>
                </div>
              </div>

              <div className="text-slate-700 space-y-3.5 text-sm sm:text-base leading-relaxed text-justify">
                <p>
                  <strong>السيدات والسادة الزملاء مديري المدارس ومسؤولي التطوير التكنولوجي بالإدارات التعليمية:</strong>
                </p>
                <p>
                  يسعدنا أن نضع بين أيديكم المنظومة الرقمية المحدثة لإدارة وتتبع بلاغات أعطال الأجهزة التكنولوجية بمدارس محافظة البحيرة. لقد صُممت هذه المنظومة لتوفير آلية سريعة ودقيقة ومباشرة لتوثيق ومتابعة كافة تجهيزات المدارس من:
                  <span className="text-[#144272] font-semibold"> الشاشات التفاعلية، أجهزة التابلت، معامل التطوير، السيرفرات والشبكات، وأجهزة العرض والطباعة</span>.
                </p>
                <p>
                  إن التحول الرقمي الموثوق يبدأ من دقة البيانات وسرعة الاستجابة، ولذا نؤكد على ضرورة تسجيل البلاغات فور حدوثها وتحديث حالتها باستمرار لضمان توجيه فرق الدعم الفني والصيانة بكفاءة متناهية حرصاً على أبنائنا الطلاب واستقرار سير العملية التعليمية.
                </p>
              </div>
            </div>

            {/* Official Signature */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#f7e4c3] border border-[#e8b86d] flex items-center justify-center text-[#c99f4a] font-bold">
                  <i className="fa-solid fa-stamp"></i>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#0a2647] text-sm">السيد السعدنى</div>
                  <div className="text-xs text-slate-600">مدير مركز التطوير التكنولوجي بمحافظة البحيرة</div>
                  <div className="text-[11px] text-slate-400">مديرية التربية والتعليم بالبحيرة</div>
                </div>
              </div>

              <div className="bg-[#f0f4fa] px-3.5 py-1.5 rounded-full border border-[#cbd5e1] text-xs text-[#144272] font-medium flex items-center gap-1.5">
                <i className="fa-solid fa-calendar-check text-[#c99f4a]"></i>
                <span>العام الدراسي 2026 / 2027</span>
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: بطاقة تسجيل الدخول (Login Form Card) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-md border border-[#e6edf5] flex-1 flex flex-col justify-between">
            
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#f0f4fa] text-[#144272] border-2 border-[#e8b86d] mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h3 className="text-xl font-bold text-[#0a2647]">تسجيل الدخول</h3>
                <p className="text-xs text-slate-500 mt-1">
                  أدخل بيانات الحساب المسجل في قاعدة بيانات <span className="font-semibold text-[#144272]">Users</span>
                </p>
              </div>

              {/* Error Alert Area */}
              {errorMessage && (
                <div className="bg-rose-50 border-r-4 border-rose-600 p-3 rounded-xl mb-5 flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm animate-shake">
                  <i className="fa-solid fa-circle-exclamation text-rose-600 mt-0.5 text-base shrink-0"></i>
                  <div className="flex-1">
                    <strong>تنبيه الدخول:</strong> {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#64748b] px-1">
                    <i className="fa-solid fa-user me-1 text-[#144272]"></i>
                    اسم المستخدم (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: admin أو tdc_beheira"
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm focus:ring-2 focus:ring-[#144272] outline-none text-slate-800 transition-all text-right"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 px-1 block">
                    * المقارنة غير حساسة لحالة الأحرف (Case-insensitive)
                  </span>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#64748b] px-1">
                    <i className="fa-solid fa-key me-1 text-[#144272]"></i>
                    كلمة المرور (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-sm focus:ring-2 focus:ring-[#144272] outline-none text-slate-800 transition-all text-right font-mono"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>

                {/* Submit Button with Spinner */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#144272] to-[#205295] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin text-base"></i>
                        <span>جاري التحقق من بيانات الدخول...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-right-to-bracket text-base"></i>
                        <span>دخول المنظومة</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-2 font-medium">حسابات تجريبية سريعة للاختبار:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin', '123')}
                  className="text-xs bg-[#f0f4fa] hover:bg-[#e8b86d] hover:text-[#0a2647] text-[#144272] px-3.5 py-1.5 rounded-full border border-[#cbd5e1] font-semibold transition-colors"
                >
                  <i className="fa-solid fa-user-gear me-1"></i> ابراهيم الشيخ (مدير المنظومة: admin / 123)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('tdc_beheira', '123')}
                  className="text-xs bg-[#f0f4fa] hover:bg-[#e8b86d] hover:text-[#0a2647] text-[#144272] px-3.5 py-1.5 rounded-full border border-[#cbd5e1] font-semibold transition-colors"
                >
                  <i className="fa-solid fa-screwdriver-wrench me-1"></i> دعم فني (tdc_beheira / 123)
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
