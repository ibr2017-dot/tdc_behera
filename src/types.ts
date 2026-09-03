/**
 * Types and interfaces for TDC Devices Faults Management System
 * مركز التطوير التكنولوجي - نظام إدارة أعطال الأجهزة بمحافظة البحيرة
 */

export interface UserAccount {
  username: string;
  password: string;
  role?: string;
  fullName?: string;
}

export interface SchoolItem {
  administration: string; // الإدارة
  schoolName: string;     // المدرسة
  schoolCode: string;     // كود المدرسة
}

export interface FaultItem {
  category: string; // الفئة
  device: string;   // الجهاز
}

export interface FaultFormData {
  rowIndex?: number;      // رقم الصف في شيت Data (للتعرف على التعديل أو الإضافة)
  administration: string; // الإدارة التعليمية
  schoolName: string;     // المدرسة
  schoolCode: string;     // كود المدرسة
  category: string;       // الفئة
  device: string;         // الجهاز المعطل
  faultDate: string;      // تاريخ العطل yyyy-MM-dd
  ticketNumber: string;   // رقم التيكت
  receiverName: string;   // متلقي البلاغ
  count: number;          // العدد (افتراضي 1، حد أدنى 1)
  notes: string;          // ملاحظات
}

export interface FaultRecord extends FaultFormData {
  seq: number;            // م (رقم المسلسل)
  rowIndex: number;       // رقم الصف الفعلي في الشيت
  createdAt?: string;
  updatedAt?: string;
  userEmail?: string;
}

export interface MasterDataResponse {
  schools: SchoolItem[];
  faults: FaultItem[];
}

export interface ReportSummary {
  totalTickets: number; // إجمالي عدد البلاغات (عدد الصفوف)
  totalDevices: number; // إجمالي عدد الأجهزة المعطلة (مجموع عمود العدد)
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface GoogleAppsScriptResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
