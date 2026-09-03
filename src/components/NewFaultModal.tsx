import React, { useState, useEffect } from 'react';
import { SchoolItem, FaultItem, FaultFormData, UserAccount } from '../types';

interface NewFaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolItem[];
  faults: FaultItem[];
  currentUser?: UserAccount | null;
  onSubmit: (formData: FaultFormData) => Promise<boolean>;
}

export const NewFaultModal: React.FC<NewFaultModalProps> = ({
  isOpen,
  onClose,
  schools,
  faults,
  currentUser,
  onSubmit,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const defaultReceiver = currentUser?.fullName?.replace(/\s*\(.*?\)/, '').trim() || currentUser?.fullName || currentUser?.username || 'ابراهيم الشيخ';

  const [administration, setAdministration] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [category, setCategory] = useState('');
  const [device, setDevice] = useState('');
  const [faultDate, setFaultDate] = useState(today);
  const [ticketNumber, setTicketNumber] = useState('');
  const [receiverName, setReceiverName] = useState(defaultReceiver);
  const [count, setCount] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate realistic ticket number suggestion
  const generateTicket = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `TK-${new Date().getFullYear()}-${randomNum}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (!ticketNumber) {
        setTicketNumber(generateTicket());
      }
      if (!receiverName && defaultReceiver) {
        setReceiverName(defaultReceiver);
      }
    }
  }, [isOpen, ticketNumber, defaultReceiver, receiverName]);

  // Unique Administrations
  const administrationsList = Array.from(new Set(schools.map((s) => s.administration))).sort();

  // Filtered Schools by chosen administration
  const filteredSchools = administration
    ? schools.filter((s) => s.administration === administration)
    : [];

  // Unique Categories
  const categoriesList = Array.from(new Set(faults.map((f) => f.category))).sort();

  // Filtered Devices by chosen category
  const filteredDevices = category
    ? faults.filter((f) => f.category === category).map((f) => f.device)
    : [];

  // Reset school when administration changes
  const handleAdminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAdministration(val);
    setSchoolName('');
    setSchoolCode('');
  };

  // Set school code automatically when school is selected
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sName = e.target.value;
    setSchoolName(sName);
    const found = schools.find((s) => s.administration === administration && s.schoolName === sName);
    setSchoolCode(found ? found.schoolCode : '');
  };

  // Reset device when category changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setCategory(cat);
    setDevice('');
  };

  const handleReset = () => {
    setAdministration('');
    setSchoolName('');
    setSchoolCode('');
    setCategory('');
    setDevice('');
    setFaultDate(today);
    setTicketNumber(generateTicket());
    setReceiverName(defaultReceiver);
    setCount(1);
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data: FaultFormData = {
      administration,
      schoolName,
      schoolCode,
      category,
      device,
      faultDate,
      ticketNumber,
      receiverName,
      count: Number(count) || 1,
      notes,
    };

    const success = await onSubmit(data);
    setIsSubmitting(false);

    if (success) {
      handleReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in no-print">
      <div className="bg-white rounded-[28px] shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a2647] via-[#144272] to-[#205295] text-white p-5 px-6 flex items-center justify-between border-b-4 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-md">
              <i className="fa-solid fa-circle-plus"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-0">إضافة عطل جديد (تسجيل سريع)</h3>
              <p className="text-xs text-slate-200 mb-0">إدخال بلاغ فني وحفظه مباشرة في شيت Data بقاعدة البيانات</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            title="إغلاق النافذة"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Administration & School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-building-columns text-blue-900 me-1"></i>
                الإدارة التعليمية <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={administration}
                onChange={handleAdminChange}
                className="w-full tdc-input bg-white"
              >
                <option value="">-- اختر الإدارة التعليمية --</option>
                {administrationsList.map((adm) => (
                  <option key={adm} value={adm}>
                    {adm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-school text-blue-900 me-1"></i>
                المدرسة <span className="text-rose-500">*</span>
              </label>
              <select
                required
                disabled={!administration}
                value={schoolName}
                onChange={handleSchoolChange}
                className="w-full tdc-input bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {administration ? '-- اختر المدرسة --' : 'يرجى اختيار الإدارة أولاً'}
                </option>
                {filteredSchools.map((sch) => (
                  <option key={sch.schoolCode} value={sch.schoolName}>
                    {sch.schoolName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School Code (Readonly) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              <i className="fa-solid fa-barcode text-blue-800 me-1"></i>
              كود المدرسة (يُعبأ تلقائياً)
            </label>
            <input
              type="text"
              readOnly
              value={schoolCode}
              placeholder="يظهر كود المدرسة هنا تلقائياً عند تحديد المدرسة"
              className="w-full tdc-input font-mono font-bold text-blue-900 bg-slate-100"
            />
          </div>

          {/* Category & Faulty Device */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-layer-group text-blue-900 me-1"></i>
                فئة العطل <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={handleCategoryChange}
                className="w-full tdc-input bg-white"
              >
                <option value="">-- اختر فئة العطل --</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-laptop text-blue-900 me-1"></i>
                الجهاز المعطل <span className="text-rose-500">*</span>
              </label>
              <select
                required
                disabled={!category}
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="w-full tdc-input bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {category ? '-- اختر الجهاز المعطل --' : 'يرجى اختيار الفئة أولاً'}
                </option>
                {filteredDevices.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Ticket & Receiver */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-calendar-day text-blue-900 me-1"></i>
                تاريخ العطل <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={faultDate}
                onChange={(e) => setFaultDate(e.target.value)}
                className="w-full tdc-input text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-ticket text-blue-900 me-1"></i>
                رقم التيكت <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="مثال: TK-2026-1025"
                className="w-full tdc-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <i className="fa-solid fa-hashtag text-blue-900 me-1"></i>
                العدد المعطل <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full tdc-input text-center font-bold"
              />
            </div>
          </div>

          {/* Receiver Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <i className="fa-solid fa-user-check text-blue-900 me-1"></i>
              اسم متلقي البلاغ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="اسم المهندس أو الموظف متلقي البلاغ"
              className="w-full tdc-input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <i className="fa-solid fa-clipboard-list text-blue-900 me-1"></i>
              ملاحظات فنية وتفاصيل العطل
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="وصف المشكلة الفنية، حالة الضمان، أو أي تفاصيل إضافية..."
              className="w-full tdc-input"
            ></textarea>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="tdc-btn-pill bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>إغلاق</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="tdc-btn-pill tdc-btn-success text-sm px-6 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>جاري تسجيل العطل...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>تسجيل العطل</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
