/**
 * Google Apps Script Simulator and Backend Service
 * مركز التطوير التكنولوجي - مديرية التربية والتعليم بالبحيرة
 *
 * Implements the exact logic and database structure required for:
 * - Users Sheet (username, password)
 * - Schools Sheet (الإدارة, المدرسة, كود المدرسة)
 * - Faults Sheet (الفئة, الجهاز)
 * - Data Sheet (م, الإدارة, المدرسة, كود المدرسة, الفئة, الجهاز المعطل, تاريخ العطل, رقم التيكت, متلقي البلاغ, العدد, ملاحظات)
 */

import {
  UserAccount,
  SchoolItem,
  FaultItem,
  FaultFormData,
  FaultRecord,
  MasterDataResponse,
  ReportSummary,
  GoogleAppsScriptResponse,
} from '../types';

// LocalStorage Keys for simulated Google Sheets
const STORAGE_KEYS = {
  USERS: 'tdc_beheira_sheet_users',
  SCHOOLS: 'tdc_beheira_sheet_schools',
  FAULTS: 'tdc_beheira_sheet_faults',
  DATA: 'tdc_beheira_sheet_data',
  CURRENT_USER: 'tdc_beheira_current_user',
};

// Initial Seed Data for Beheira Governorate
export const INITIAL_USERS: UserAccount[] = [
  { username: 'admin', password: '123', role: 'مدير المنظومة', fullName: 'ابراهيم الشيخ (مدير المنظومة)' },
  { username: 'tdc_beheira', password: '123', role: 'مسؤول الدعم الفني', fullName: 'ابراهيم الشيخ (مركز التطوير التكنولوجي)' },
  { username: 'support', password: '123', role: 'دعم فني إدارات', fullName: 'فريق صيانة وتحديث الأجهزة' },
];

export const INITIAL_SCHOOLS: SchoolItem[] = [
  // إدارة بندر دمنهور التعليمية
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة دمنهور الثانوية العسكرية بنين', schoolCode: '180101' },
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة دمنهور الثانوية بنات', schoolCode: '180102' },
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة الشهيد عماد نصر الإعدادية', schoolCode: '180103' },
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة الجمهورية الابتدائية المشتركة', schoolCode: '180104' },
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة أحمد محرم الإعدادية بنات', schoolCode: '180105' },
  { administration: 'إدارة بندر دمنهور التعليمية', schoolName: 'مدرسة عمر بن الخطاب الرسمية لغات', schoolCode: '180106' },

  // إدارة كفر الدوار التعليمية
  { administration: 'إدارة كفر الدوار التعليمية', schoolName: 'مدرسة كفر الدوار الثانوية بنين', schoolCode: '180201' },
  { administration: 'إدارة كفر الدوار التعليمية', schoolName: 'مدرسة كفر الدوار الثانوية بنات', schoolCode: '180202' },
  { administration: 'إدارة كفر الدوار التعليمية', schoolName: 'مدرسة الحدائق الإعدادية المشتركة', schoolCode: '180203' },
  { administration: 'إدارة كفر الدوار التعليمية', schoolName: 'مدرسة المهاجرين الابتدائية', schoolCode: '180204' },
  { administration: 'إدارة كفر الدوار التعليمية', schoolName: 'مدرسة التمليك الإعدادية بنات', schoolCode: '180205' },

  // إدارة إيتاي البارود التعليمية
  { administration: 'إدارة إيتاي البارود التعليمية', schoolName: 'مدرسة إيتاي البارود الثانوية المشتركة', schoolCode: '180301' },
  { administration: 'إدارة إيتاي البارود التعليمية', schoolName: 'مدرسة الشهيد محمد أحمد عبده الإعدادية', schoolCode: '180302' },
  { administration: 'إدارة إيتاي البارود التعليمية', schoolName: 'مدرسة السيدة زينب الابتدائية', schoolCode: '180303' },
  { administration: 'إدارة إيتاي البارود التعليمية', schoolName: 'مدرسة شبرا النونة الإعدادية المشتركة', schoolCode: '180304' },

  // إدارة كوم حمادة التعليمية
  { administration: 'إدارة كوم حمادة التعليمية', schoolName: 'مدرسة كوم حمادة الثانوية العسكرية', schoolCode: '180401' },
  { administration: 'إدارة كوم حمادة التعليمية', schoolName: 'مدرسة الشهيد عاطف السادات الإعدادية', schoolCode: '180402' },
  { administration: 'إدارة كوم حمادة التعليمية', schoolName: 'مدرسة الطود الثانوية المشتركة', schoolCode: '180403' },

  // إدارة أبو حمص التعليمية
  { administration: 'إدارة أبو حمص التعليمية', schoolName: 'مدرسة أبو حمص الثانوية المشتركة', schoolCode: '180501' },
  { administration: 'إدارة أبو حمص التعليمية', schoolName: 'مدرسة ناصر الإعدادية بنين', schoolCode: '180502' },
  { administration: 'إدارة أبو حمص التعليمية', schoolName: 'مدرسة الزهراء الابتدائية', schoolCode: '180503' },

  // إدارة المحمودية التعليمية
  { administration: 'إدارة المحمودية التعليمية', schoolName: 'مدرسة المحمودية الثانوية بنين', schoolCode: '180601' },
  { administration: 'إدارة المحمودية التعليمية', schoolName: 'مدرسة المحمودية الإعدادية بنات', schoolCode: '180602' },

  // إدارة رشيد التعليمية
  { administration: 'إدارة رشيد التعليمية', schoolName: 'مدرسة رشيد الثانوية المشتركة', schoolCode: '180701' },
  { administration: 'إدارة رشيد التعليمية', schoolName: 'مدرسة الشهيد الرائد محمد الحوفي الإعدادية', schoolCode: '180702' },

  // إدارة حوش عيسى التعليمية
  { administration: 'إدارة حوش عيسى التعليمية', schoolName: 'مدرسة حوش عيسى الثانوية العسكرية', schoolCode: '180801' },
  { administration: 'إدارة حوش عيسى التعليمية', schoolName: 'مدرسة الدكتور أحمد جويلي الإعدادية', schoolCode: '180802' },

  // إدارة الدلنجات التعليمية
  { administration: 'إدارة الدلنجات التعليمية', schoolName: 'مدرسة الدلنجات الثانوية بنين', schoolCode: '180901' },
  { administration: 'إدارة الدلنجات التعليمية', schoolName: 'مدرسة الدلنجات الثانوية بنات', schoolCode: '180902' },

  // إدارة وادي النطرون التعليمية
  { administration: 'إدارة وادي النطرون التعليمية', schoolName: 'مدرسة وادي النطرون الثانوية المشتركة', schoolCode: '181001' },
  { administration: 'إدارة وادي النطرون التعليمية', schoolName: 'مدرسة الأمين الإعدادية المشتركة', schoolCode: '181002' },
];

export const INITIAL_FAULTS: FaultItem[] = [
  // الشاشات التفاعلية
  { category: 'الشاشات التفاعلية', device: 'شاشة بروميثيان Promethean 75 بوصة' },
  { category: 'الشاشات التفاعلية', device: 'شاشة فيوسونيك ViewSonic 65 بوصة' },
  { category: 'الشاشات التفاعلية', device: 'شاشة هيتاشي تفاعلية Hitachi' },
  { category: 'الشاشات التفاعلية', device: 'كابل HDMI / محول العرض التفاعلي' },
  { category: 'الشاشات التفاعلية', device: 'قلم الشاشة التفاعلية وحساس اللمس' },

  // أجهزة التابلت المدرسي
  { category: 'أجهزة التابلت المدرسي', device: 'تابلت سامسونج Galaxy Tab A T585' },
  { category: 'أجهزة التابلت المدرسي', device: 'تابلت سامسونج Galaxy Tab A7 T505' },
  { category: 'أجهزة التابلت المدرسي', device: 'شاحن وكابل تابلت أصلي' },
  { category: 'أجهزة التابلت المدرسي', device: 'بطارية تابلت تالفة أو منتفخة' },
  { category: 'أجهزة التابلت المدرسي', device: 'شريحة البيانات المدرسية ومنظومة Knox' },

  // السيرفرات والشبكات
  { category: 'السيرفرات والشبكات', device: 'سيرفر المدرسة الرئيسي (School Server)' },
  { category: 'السيرفرات والشبكات', device: 'سويتش شبكة سيسكو Cisco Switch' },
  { category: 'السيرفرات والشبكات', device: 'سويتش شبكة إتش بي HP Switch' },
  { category: 'السيرفرات والشبكات', device: 'راوتر وي اللاسلكي WE VDSL/Fiber Router' },
  { category: 'السيرفرات والشبكات', device: 'نقطة وصول لاسلكية Access Point' },
  { category: 'السيرفرات والشبكات', device: 'كابينة الرك وتوصيلات الفايبر Patch Panel' },
  { category: 'السيرفرات والشبكات', device: 'وحدة التغذية غير المنقطعة UPS' },

  // معامل التطوير والأوساط
  { category: 'معامل التطوير والأوساط', device: 'جهاز حاسب آلي مكتبي PC (معمل الحاسب)' },
  { category: 'معامل التطوير والأوساط', device: 'شاشة كمبيوتر LCD/LED' },
  { category: 'معامل التطوير والأوساط', device: 'لوحة مفاتيح وفأرة معتمدة' },
  { category: 'معامل التطوير والأوساط', device: 'مزود الطاقة Power Supply / كارت الشاشة' },
  { category: 'معامل التطوير والأوساط', device: 'قرص صلب SSD/HDD تالف' },
  { category: 'معامل التطوير والأوساط', device: 'سماعات وسائط متعددة ومضخم صوت' },

  // أجهزة العرض والطباعة
  { category: 'أجهزة العرض والطباعة', device: 'جهاز عرض ضوئي Data Show (بروجكتور)' },
  { category: 'أجهزة العرض والطباعة', device: 'لمبة بروجكتور Data Show Lamp' },
  { category: 'أجهزة العرض والطباعة', device: 'طابعة ليزر HP LaserJet' },
  { category: 'أجهزة العرض والطباعة', device: 'طابعة ليزر متعددة الوظائف كبرى' },
  { category: 'أجهزة العرض والطباعة', device: 'ماسح ضوئي Scanner' },

  // أجهزة أخرى وتجهيزات
  { category: 'أجهزة أخرى وتجهيزات', device: 'ميكروفون لاسلكي وإذاعة مدرسية' },
  { category: 'أجهزة أخرى وتجهيزات', device: 'كاميرا مراقبة معمل التطوير التكنولوجي' },
  { category: 'أجهزة أخرى وتجهيزات', device: 'مشترك كهربائي مصفح وكابلات توصيل رئيسية' },
];

export const INITIAL_DATA: FaultRecord[] = [
  {
    seq: 1,
    rowIndex: 2, // Header is row 1
    administration: 'إدارة بندر دمنهور التعليمية',
    schoolName: 'مدرسة دمنهور الثانوية العسكرية بنين',
    schoolCode: '180101',
    category: 'الشاشات التفاعلية',
    device: 'شاشة بروميثيان Promethean 75 بوصة',
    faultDate: '2026-08-28',
    ticketNumber: 'TK-2026-0841',
    receiverName: 'م. أشرف عبد السلام',
    count: 2,
    notes: 'الشاشة لا تستجيب للمس في الجزء الأيمن وتم فحص كابل التوصيل.',
    createdAt: '2026-08-28T09:15:00',
    userEmail: 'admin@tdc.moe.gov.eg',
  },
  {
    seq: 2,
    rowIndex: 3,
    administration: 'إدارة بندر دمنهور التعليمية',
    schoolName: 'مدرسة دمنهور الثانوية بنات',
    schoolCode: '180102',
    category: 'السيرفرات والشبكات',
    device: 'سيرفر المدرسة الرئيسي (School Server)',
    faultDate: '2026-08-30',
    ticketNumber: 'TK-2026-0856',
    receiverName: 'م. شيماء عبد الله',
    count: 1,
    notes: 'توقف خدمة الامتحانات المحلية بالسيرفر ويحتاج إعادة تشغيل قواعد البيانات وتحديث الخدمة.',
    createdAt: '2026-08-30T11:40:00',
    userEmail: 'tdc_beheira@tdc.moe.gov.eg',
  },
  {
    seq: 3,
    rowIndex: 4,
    administration: 'إدارة كفر الدوار التعليمية',
    schoolName: 'مدرسة كفر الدوار الثانوية بنين',
    schoolCode: '180201',
    category: 'أجهزة التابلت المدرسي',
    device: 'تابلت سامسونج Galaxy Tab A7 T505',
    faultDate: '2026-09-01',
    ticketNumber: 'TK-2026-0872',
    receiverName: 'أ. طارق فاروق',
    count: 5,
    notes: 'أجهزة تابلت طلاب أولى ثانوي تحتاج إعادة ضبط مصنع وضبط منظومة Knox الوزارية.',
    createdAt: '2026-09-01T10:00:00',
    userEmail: 'support@tdc.moe.gov.eg',
  },
  {
    seq: 4,
    rowIndex: 5,
    administration: 'إدارة إيتاي البارود التعليمية',
    schoolName: 'مدرسة إيتاي البارود الثانوية المشتركة',
    schoolCode: '180301',
    category: 'معامل التطوير والأوساط',
    device: 'جهاز حاسب آلي مكتبي PC (معمل الحاسب)',
    faultDate: '2026-09-02',
    ticketNumber: 'TK-2026-0888',
    receiverName: 'م. إبراهيم رضوان',
    count: 3,
    notes: 'أجهزة حاسب بمعمل الأوساط تحتاج تغيير مزود طاقة Power Supply وتنظيف مراوح التبريد.',
    createdAt: '2026-09-02T13:25:00',
    userEmail: 'tdc_beheira@tdc.moe.gov.eg',
  },
  {
    seq: 5,
    rowIndex: 6,
    administration: 'إدارة كوم حمادة التعليمية',
    schoolName: 'مدرسة كوم حمادة الثانوية العسكرية',
    schoolCode: '180401',
    category: 'أجهزة العرض والطباعة',
    device: 'جهاز عرض ضوئي Data Show (بروجكتور)',
    faultDate: '2026-09-03',
    ticketNumber: 'TK-2026-0901',
    receiverName: 'م. أشرف عبد السلام',
    count: 1,
    notes: 'انطفاء مفاجئ للمبة البروجكتور بقاعة التطوير وتحتاج استبدال.',
    createdAt: '2026-09-03T08:00:00',
    userEmail: 'admin@tdc.moe.gov.eg',
  },
];

/**
 * Service Implementation mirroring Code.gs
 */
class GoogleAppsScriptBackend {
  constructor() {
    this.setupSheets();
  }

  /**
   * setupSheets: Ensures all required sheets exist with correct structure.
   */
  public setupSheets(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else {
      // Update any legacy user object with the specified user name
      try {
        const currentUsers: UserAccount[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        let modified = false;
        currentUsers.forEach((u) => {
          if (u.username === 'admin' && !u.fullName?.includes('ابراهيم الشيخ')) {
            u.fullName = 'ابراهيم الشيخ (مدير المنظومة)';
            modified = true;
          }
          if (u.username === 'tdc_beheira' && !u.fullName?.includes('ابراهيم الشيخ')) {
            u.fullName = 'ابراهيم الشيخ (مركز التطوير التكنولوجي)';
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(currentUsers));
        }
      } catch (e) {
        console.warn(e);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
      localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(INITIAL_SCHOOLS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAULTS)) {
      localStorage.setItem(STORAGE_KEYS.FAULTS, JSON.stringify(INITIAL_FAULTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DATA)) {
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(INITIAL_DATA));
    }
  }

  /**
   * Reset database back to default initial seed data
   */
  public resetDatabase(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(INITIAL_SCHOOLS));
    localStorage.setItem(STORAGE_KEYS.FAULTS, JSON.stringify(INITIAL_FAULTS));
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(INITIAL_DATA));
  }

  /**
   * checkLogin: Checks username & password against Users sheet.
   * Case-insensitive matching on username.
   */
  public checkLogin(username: string, password: string): Promise<GoogleAppsScriptResponse<UserAccount>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!username || !password) {
            reject(new Error('يرجى إدخال اسم المستخدم وكلمة المرور'));
            return;
          }

          const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
          const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : INITIAL_USERS;

          const trimmedUser = username.trim().toLowerCase();
          const matchedUser = users.find(
            (u) => u.username.trim().toLowerCase() === trimmedUser && u.password === password
          );

          if (matchedUser) {
            const userObj = { ...matchedUser, password: '***' };
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
            resolve({
              success: true,
              message: 'تم تسجيل الدخول بنجاح! مرحباً بكم في منظومة مركز التطوير التكنولوجي بالبحيرة.',
              data: userObj,
            });
          } else {
            reject(new Error('بيانات الدخول غير صحيحة. يرجى التحقق من اسم المستخدم وكلمة المرور.'));
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء التحقق من بيانات الدخول';
          reject(new Error(errMsg));
        }
      }, 350);
    });
  }

  /**
   * getCurrentUser
   */
  public getCurrentUser(): UserAccount | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      if (u.username === 'admin' || u.username === 'tdc_beheira') {
        if (!u.fullName?.includes('ابراهيم الشيخ')) {
          u.fullName = 'ابراهيم الشيخ';
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(u));
        }
      }
      return u;
    } catch {
      return null;
    }
  }

  /**
   * logout
   */
  public logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * getAllMasterData:
   * Returns schools (الإدارة, المدرسة, كود المدرسة) and faults (الفئة, الجهاز) in a single request.
   */
  public getAllMasterData(): Promise<GoogleAppsScriptResponse<MasterDataResponse>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rawSchools = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
          const rawFaults = localStorage.getItem(STORAGE_KEYS.FAULTS);

          const schools: SchoolItem[] = rawSchools ? JSON.parse(rawSchools) : INITIAL_SCHOOLS;
          const faults: FaultItem[] = rawFaults ? JSON.parse(rawFaults) : INITIAL_FAULTS;

          resolve({
            success: true,
            message: 'تم تحميل البيانات المرجعية بنجاح.',
            data: { schools, faults },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'فشل في تحميل البيانات المرجعية من النظام';
          reject(new Error(errMsg));
        }
      }, 250);
    });
  }

  /**
   * saveOrUpdateData:
   * If rowIndex is missing or <= 1 -> Add new row in Data sheet.
   * If rowIndex > 1 -> Update the existing row at that position.
   * Validates mandatory fields and simulates Cairo time email notification with try/catch.
   */
  public saveOrUpdateData(formData: FaultFormData): Promise<GoogleAppsScriptResponse<FaultRecord>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mandatory fields validation
          if (!formData.administration?.trim()) {
            reject(new Error('يرجى اختيار الإدارة التعليمية'));
            return;
          }
          if (!formData.schoolName?.trim()) {
            reject(new Error('يرجى اختيار المدرسة'));
            return;
          }
          if (!formData.schoolCode?.trim()) {
            reject(new Error('كود المدرسة مطلوب'));
            return;
          }
          if (!formData.category?.trim()) {
            reject(new Error('يرجى تحديد فئة العطل'));
            return;
          }
          if (!formData.device?.trim()) {
            reject(new Error('يرجى تحديد الجهاز المعطل'));
            return;
          }
          if (!formData.faultDate?.trim()) {
            reject(new Error('تاريخ العطل إلزامي'));
            return;
          }
          if (!formData.ticketNumber?.trim()) {
            reject(new Error('يرجى إدخال رقم التيكت (رقم البلاغ)'));
            return;
          }
          if (!formData.receiverName?.trim()) {
            reject(new Error('يرجى إدخال اسم متلقي البلاغ'));
            return;
          }

          const countVal = Number(formData.count);
          if (isNaN(countVal) || countVal < 1) {
            reject(new Error('العدد يجب أن يكون رقماً صحيحاً 1 على الأقل'));
            return;
          }

          const rawData = localStorage.getItem(STORAGE_KEYS.DATA);
          let records: FaultRecord[] = rawData ? JSON.parse(rawData) : [...INITIAL_DATA];

          const currentUser = this.getCurrentUser();
          const userEmail = currentUser ? `${currentUser.username}@tdc.moe.gov.eg` : 'admin@tdc.moe.gov.eg';

          let resultRecord: FaultRecord;
          const isUpdate = typeof formData.rowIndex === 'number' && formData.rowIndex > 1;

          if (isUpdate) {
            // Find existing record matching rowIndex
            const targetIndex = records.findIndex((r) => r.rowIndex === formData.rowIndex);
            if (targetIndex === -1) {
              reject(new Error(`لم يتم العثور على سجل العطل في الصف رقم ${formData.rowIndex}`));
              return;
            }

            const existing = records[targetIndex];
            resultRecord = {
              ...existing,
              ...formData,
              count: countVal,
              rowIndex: formData.rowIndex!,
              updatedAt: new Date().toISOString(),
              userEmail,
            };

            records[targetIndex] = resultRecord;
          } else {
            // New Entry: Row index is (records.length + 2) because row 1 is header
            const nextRowIndex = records.length > 0 ? Math.max(...records.map((r) => r.rowIndex)) + 1 : 2;
            const nextSeq = records.length + 1;

            resultRecord = {
              ...formData,
              seq: nextSeq,
              rowIndex: nextRowIndex,
              count: countVal,
              createdAt: new Date().toISOString(),
              userEmail,
            };

            records.push(resultRecord);
          }

          localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(records));

          // Simulate automatic email notification (separate try/catch so failure never blocks saving)
          try {
            this.sendEmailNotification({
              actionType: isUpdate ? 'تحديث بيانات عطل' : 'تسجيل بلاغ عطل جديد',
              record: resultRecord,
              userEmail,
            });
          } catch (emailErr) {
            console.warn('Mail notification notice:', emailErr);
          }

          resolve({
            success: true,
            message: isUpdate
              ? `تم تحديث بيانات العطل بنجاح في شيت Data (الصف رقم ${resultRecord.rowIndex}).`
              : `تم تسجيل وحفظ العطل بنجاح برقم تيكت [${resultRecord.ticketNumber}].`,
            data: resultRecord,
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ البيانات في شيت Google Sheets';
          reject(new Error(errMsg));
        }
      }, 450);
    });
  }

  /**
   * searchBySchoolCode:
   * Exact match on school code. Returns matching records with their actual rowIndex for editing.
   */
  public searchBySchoolCode(code: string): Promise<GoogleAppsScriptResponse<FaultRecord[]>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!code || !code.trim()) {
            reject(new Error('يرجى إدخال كود المدرسة للبحث'));
            return;
          }

          const rawData = localStorage.getItem(STORAGE_KEYS.DATA);
          const records: FaultRecord[] = rawData ? JSON.parse(rawData) : [...INITIAL_DATA];

          const cleanCode = code.trim();
          const results = records.filter((r) => r.schoolCode.trim() === cleanCode);

          resolve({
            success: true,
            message: results.length > 0
              ? `تم العثور على ${results.length} بلاغ(ات) لمدرسة بكود [${cleanCode}].`
              : `لا توجد بلاغات مسجلة لكود المدرسة [${cleanCode}].`,
            data: results,
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء البحث في الشيت';
          reject(new Error(errMsg));
        }
      }, 300);
    });
  }

  /**
   * getReportData:
   * mode === 'school': filters by (administration + schoolName)
   * mode === 'administration': filters by administration only
   */
  public getReportData(
    mode: 'school' | 'administration',
    administration: string,
    schoolName?: string
  ): Promise<GoogleAppsScriptResponse<{ records: FaultRecord[]; summary: ReportSummary }>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rawData = localStorage.getItem(STORAGE_KEYS.DATA);
          const records: FaultRecord[] = rawData ? JSON.parse(rawData) : [...INITIAL_DATA];

          let filtered: FaultRecord[] = [];

          const isAllAdmins = !administration || administration === 'all' || administration === 'جميع الإدارات' || administration === 'جميع الإدارات التعليمية';
          const isAllSchools = !schoolName || schoolName === 'all' || schoolName === 'جميع المدارس' || schoolName === 'جميع مدارس الإدارة';

          if (isAllAdmins) {
            filtered = records;
          } else if (mode === 'school' && !isAllSchools) {
            filtered = records.filter(
              (r) => r.administration === administration && r.schoolName === schoolName
            );
          } else {
            filtered = records.filter((r) => r.administration === administration);
          }

          const totalTickets = filtered.length;
          const totalDevices = filtered.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

          resolve({
            success: true,
            message: `تم توليد التقرير بنجاح: ${totalTickets} بلاغ، بإجمالي ${totalDevices} جهاز.`,
            data: {
              records: filtered,
              summary: { totalTickets, totalDevices },
            },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء إعداد التقرير من شيت البيانات';
          reject(new Error(errMsg));
        }
      }, 350);
    });
  }

  /**
   * Delete a fault record by rowIndex
   */
  public deleteRecord(rowIndex: number): Promise<GoogleAppsScriptResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rawData = localStorage.getItem(STORAGE_KEYS.DATA);
          const records: FaultRecord[] = rawData ? JSON.parse(rawData) : [...INITIAL_DATA];

          const updated = records.filter((r) => r.rowIndex !== rowIndex);
          localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(updated));

          resolve({
            success: true,
            message: 'تم حذف البلاغ بنجاح من شيت البيانات.',
            data: null,
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'فشل حذف السجل';
          reject(new Error(errMsg));
        }
      }, 250);
    });
  }

  /**
   * Inspect all sheets as raw data for transparency
   */
  public getAllSheetsRaw(): {
    users: UserAccount[];
    schools: SchoolItem[];
    faults: FaultItem[];
    data: FaultRecord[];
  } {
    return {
      users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
      schools: JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOLS) || '[]'),
      faults: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAULTS) || '[]'),
      data: JSON.parse(localStorage.getItem(STORAGE_KEYS.DATA) || '[]'),
    };
  }

  /**
   * Simulated email notification mirroring MailApp.sendEmail in GAS
   */
  private sendEmailNotification(params: {
    actionType: string;
    record: FaultRecord;
    userEmail: string;
  }): void {
    const cairoTime = new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo',
      dateStyle: 'full',
      timeStyle: 'medium',
    }).format(new Date());

    console.info(`[MailApp.sendEmail] إلى: tdc.beheira.admin@moe.edu.eg`);
    console.info(`موضوع: [${params.actionType}] تيكت: ${params.record.ticketNumber} - ${params.record.schoolName}`);
    console.info(`الوقت بتوقيت القاهرة: ${cairoTime}`);
    console.info(`المنفذ: ${params.userEmail}`);
    console.info(`الجهاز: ${params.record.device} (العدد: ${params.record.count})`);
  }
}

export const gasBackend = new GoogleAppsScriptBackend();

/**
 * Expose window.google.script.run emulation
 * This allows exact Google Apps Script frontend syntax:
 * google.script.run
 *   .withSuccessHandler(callback)
 *   .withFailureHandler(errCallback)
 *   .saveOrUpdateData(formData);
 */
if (typeof window !== 'undefined') {
  class GoogleScriptRunner {
    private successCb: (result: unknown) => void = () => {};
    private failureCb: (error: Error) => void = () => {};

    public withSuccessHandler(cb: (result: unknown) => void): this {
      this.successCb = cb;
      return this;
    }

    public withFailureHandler(cb: (error: Error) => void): this {
      this.failureCb = cb;
      return this;
    }

    public checkLogin(username: string, password: string): void {
      gasBackend
        .checkLogin(username, password)
        .then((res) => this.successCb(res))
        .catch((err) => this.failureCb(err));
    }

    public getAllMasterData(): void {
      gasBackend
        .getAllMasterData()
        .then((res) => this.successCb(res))
        .catch((err) => this.failureCb(err));
    }

    public saveOrUpdateData(formData: FaultFormData): void {
      gasBackend
        .saveOrUpdateData(formData)
        .then((res) => this.successCb(res))
        .catch((err) => this.failureCb(err));
    }

    public searchBySchoolCode(code: string): void {
      gasBackend
        .searchBySchoolCode(code)
        .then((res) => this.successCb(res))
        .catch((err) => this.failureCb(err));
    }

    public getReportData(mode: 'school' | 'administration', administration: string, schoolName?: string): void {
      gasBackend
        .getReportData(mode, administration, schoolName)
        .then((res) => this.successCb(res))
        .catch((err) => this.failureCb(err));
    }

    public setupSheets(): void {
      try {
        gasBackend.setupSheets();
        this.successCb({ success: true, message: 'تمت تهيئة الشيتات بنجاح' });
      } catch (err: unknown) {
        this.failureCb(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }

  // Register on window
  (window as unknown as { google: { script: { run: GoogleScriptRunner } } }).google = {
    script: {
      get run() {
        return new GoogleScriptRunner();
      },
    },
  };
}

/**
 * The complete, authentic Code.gs file for Google Apps Script deployment!
 * Users can view or copy this code directly into script.google.com!
 */
export const GOOGLE_APPS_SCRIPT_CODE_GS = `/**
 * مركز التطوير التكنولوجي - مديرية التربية والتعليم بمحافظة البحيرة
 * نظام إدارة ومتابعة أعطال الأجهزة بالمدارس
 * Backend Script: Code.gs
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const ADMIN_EMAIL = "tdc.beheira.admin@moe.edu.eg";

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('مركز التطوير التكنولوجي - نظام إدارة أعطال الأجهزة')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * تهيئة الشيتات تلقائياً برؤوس الأعمدة المطلوبة
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // شيت Users
  let usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['username', 'password', 'role', 'fullName']);
    usersSheet.appendRow(['admin', '123', 'مدير المنظومة', 'أحمد محمود (مدير النظام)']);
    usersSheet.appendRow(['tdc_beheira', '123', 'مسؤول الدعم الفني', 'م. إبراهيم رضوان']);
  }
  
  // شيت Schools
  let schoolsSheet = ss.getSheetByName('Schools');
  if (!schoolsSheet) {
    schoolsSheet = ss.insertSheet('Schools');
    schoolsSheet.appendRow(['الإدارة', 'المدرسة', 'كود المدرسة']);
    schoolsSheet.appendRow(['إدارة بندر دمنهور التعليمية', 'مدرسة دمنهور الثانوية العسكرية بنين', '180101']);
    schoolsSheet.appendRow(['إدارة بندر دمنهور التعليمية', 'مدرسة دمنهور الثانوية بنات', '180102']);
    schoolsSheet.appendRow(['إدارة كفر الدوار التعليمية', 'مدرسة كفر الدوار الثانوية بنين', '180201']);
    schoolsSheet.appendRow(['إدارة إيتاي البارود التعليمية', 'مدرسة إيتاي البارود الثانوية المشتركة', '180301']);
  }
  
  // شيت Faults
  let faultsSheet = ss.getSheetByName('Faults');
  if (!faultsSheet) {
    faultsSheet = ss.insertSheet('Faults');
    faultsSheet.appendRow(['الفئة', 'الجهاز']);
    faultsSheet.appendRow(['الشاشات التفاعلية', 'شاشة بروميثيان Promethean 75 بوصة']);
    faultsSheet.appendRow(['أجهزة التابلت المدرسي', 'تابلت سامسونج Galaxy Tab A7']);
    faultsSheet.appendRow(['السيرفرات والشبكات', 'سيرفر المدرسة الرئيسي']);
    faultsSheet.appendRow(['معامل التطوير والأوساط', 'جهاز حاسب آلي مكتبي PC']);
    faultsSheet.appendRow(['أجهزة العرض والطباعة', 'جهاز عرض ضوئي Data Show']);
  }
  
  // شيت Data
  let dataSheet = ss.getSheetByName('Data');
  if (!dataSheet) {
    dataSheet = ss.insertSheet('Data');
    dataSheet.appendRow([
      'م', 'الإدارة', 'المدرسة', 'كود المدرسة', 
      'الفئة', 'الجهاز المعطل', 'تاريخ العطل', 
      'رقم التيكت', 'متلقي البلاغ', 'العدد', 'ملاحظات'
    ]);
  }
  
  return { success: true, message: 'تم تهيئة الشيتات بنجاح' };
}

/**
 * تسجيل الدخول بمقارنة غير حساسة لحالة الأحرف في اسم المستخدم
 */
function checkLogin(username, password) {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    const data = sheet.getDataRange().getValues();
    
    const userSearch = String(username).trim().toLowerCase();
    
    for (let i = 1; i < data.length; i++) {
      const u = String(data[i][0]).trim().toLowerCase();
      const p = String(data[i][1]).trim();
      
      if (u === userSearch && p === String(password).trim()) {
        return {
          success: true,
          username: data[i][0],
          fullName: data[i][3] || data[i][0]
        };
      }
    }
    
    throw new Error('بيانات الدخول غير صحيحة. يرجى التحقق من اسم المستخدم وكلمة المرور.');
  } catch (err) {
    throw new Error(err.message || 'حدث خطأ في خادم النظام');
  }
}

/**
 * جلب البيانات المرجعية دفعة واحدة (المدارس والأعطال)
 */
function getAllMasterData() {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // المدارس
    const schoolsSheet = ss.getSheetByName('Schools');
    const sData = schoolsSheet.getDataRange().getValues();
    const schools = [];
    for (let i = 1; i < sData.length; i++) {
      if (sData[i][0] && sData[i][1]) {
        schools.push({
          administration: String(sData[i][0]).trim(),
          schoolName: String(sData[i][1]).trim(),
          schoolCode: String(sData[i][2]).trim()
        });
      }
    }
    
    // الأعطال المرجعية
    const faultsSheet = ss.getSheetByName('Faults');
    const fData = faultsSheet.getDataRange().getValues();
    const faults = [];
    for (let i = 1; i < fData.length; i++) {
      if (fData[i][0] && fData[i][1]) {
        faults.push({
          category: String(fData[i][0]).trim(),
          device: String(fData[i][1]).trim()
        });
      }
    }
    
    return {
      success: true,
      schools: schools,
      faults: faults
    };
  } catch (err) {
    throw new Error('فشل جلب البيانات المرجعية: ' + err.message);
  }
}

/**
 * حفظ أو تحديث عطل
 */
function saveOrUpdateData(formData) {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Data');
    
    // التحقق من الحقول الإلزامية
    if (!formData.administration || !formData.schoolName || !formData.schoolCode ||
        !formData.category || !formData.device || !formData.faultDate ||
        !formData.ticketNumber || !formData.receiverName) {
      throw new Error('يرجى ملء جميع الحقول الإلزامية المطلوبة.');
    }
    
    const count = parseInt(formData.count, 10) || 1;
    const isUpdate = formData.rowIndex && parseInt(formData.rowIndex, 10) > 1;
    let targetRow;
    let seq;
    
    if (isUpdate) {
      targetRow = parseInt(formData.rowIndex, 10);
      seq = sheet.getRange(targetRow, 1).getValue() || (targetRow - 1);
    } else {
      targetRow = sheet.getLastRow() + 1;
      seq = targetRow - 1;
    }
    
    const rowValues = [
      seq,
      formData.administration,
      formData.schoolName,
      String(formData.schoolCode),
      formData.category,
      formData.device,
      formData.faultDate,
      String(formData.ticketNumber),
      formData.receiverName,
      count,
      formData.notes || ''
    ];
    
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    
    // إرسال إشعار بريد إلكتروني تلقائي
    try {
      const userEmail = Session.getActiveUser().getEmail() || "مستخدم مسجل";
      const cairoDate = Utilities.formatDate(new Date(), "Africa/Cairo", "yyyy-MM-dd HH:mm:ss");
      const action = isUpdate ? "تحديث بيانات عطل" : "تسجيل بلاغ عطل جديد";
      
      const emailBody = 
        "مركز التطوير التكنولوجي - مديرية التربية والتعليم بالبحيرة\\n" +
        "==================================================\\n" +
        "نوع العملية: " + action + "\\n" +
        "المستخدم المنفّذ: " + userEmail + "\\n" +
        "التوقيت (القاهرة): " + cairoDate + "\\n\\n" +
        "تفاصيل البلاغ:\\n" +
        "- الإدارة التعليمية: " + formData.administration + "\\n" +
        "- المدرسة: " + formData.schoolName + " (كود: " + formData.schoolCode + ")\\n" +
        "- الفئة: " + formData.category + "\\n" +
        "- الجهاز: " + formData.device + "\\n" +
        "- العدد المعطل: " + count + "\\n" +
        "- رقم التيكت: " + formData.ticketNumber + "\\n" +
        "- متلقي البلاغ: " + formData.receiverName + "\\n" +
        "- تاريخ العطل: " + formData.faultDate + "\\n" +
        "- ملاحظات: " + (formData.notes || "لا توجد") + "\\n";
        
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: "[" + action + "] " + formData.schoolName + " - تيكت: " + formData.ticketNumber,
        body: emailBody
      });
    } catch(mailErr) {
      Logger.log("Mail error: " + mailErr.message);
    }
    
    return {
      success: true,
      message: isUpdate ? 'تم تحديث بيانات العطل بنجاح' : 'تم تسجيل العطل بنجاح',
      rowIndex: targetRow
    };
  } catch (err) {
    throw new Error('فشل الحفظ: ' + err.message);
  }
}

/**
 * البحث بكود المدرسة وتضمين رقم الصف الفعلي (rowIndex)
 */
function searchBySchoolCode(code) {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Data');
    const data = sheet.getDataRange().getValues();
    
    const searchCode = String(code).trim();
    const results = [];
    
    for (let i = 1; i < data.length; i++) {
      const rowCode = String(data[i][3]).trim();
      if (rowCode === searchCode) {
        let dateVal = data[i][6];
        if (dateVal instanceof Date) {
          dateVal = Utilities.formatDate(dateVal, "Africa/Cairo", "yyyy-MM-dd");
        }
        
        results.push({
          rowIndex: i + 1, // رقم الصف الفعلي في الشيت
          seq: data[i][0],
          administration: data[i][1],
          schoolName: data[i][2],
          schoolCode: rowCode,
          category: data[i][4],
          device: data[i][5],
          faultDate: String(dateVal),
          ticketNumber: String(data[i][7]),
          receiverName: data[i][8],
          count: parseInt(data[i][9], 10) || 1,
          notes: data[i][10] || ''
        });
      }
    }
    
    return { success: true, results: results };
  } catch (err) {
    throw new Error('فشل البحث: ' + err.message);
  }
}

/**
 * تقارير الأعطال (مدرسة أو إدارة تعليمية)
 */
function getReportData(mode, administration, schoolName) {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Data');
    const data = sheet.getDataRange().getValues();
    
    const filtered = [];
    let totalDevices = 0;
    
    for (let i = 1; i < data.length; i++) {
      const admin = String(data[i][1]).trim();
      const school = String(data[i][2]).trim();
      
      let match = false;
      if (mode === 'school') {
        match = (admin === String(administration).trim()) && (school === String(schoolName).trim());
      } else {
        match = (admin === String(administration).trim());
      }
      
      if (match) {
        let dateVal = data[i][6];
        if (dateVal instanceof Date) {
          dateVal = Utilities.formatDate(dateVal, "Africa/Cairo", "yyyy-MM-dd");
        }
        
        const count = parseInt(data[i][9], 10) || 1;
        totalDevices += count;
        
        filtered.push({
          rowIndex: i + 1,
          seq: data[i][0],
          administration: data[i][1],
          schoolName: data[i][2],
          schoolCode: String(data[i][3]),
          category: data[i][4],
          device: data[i][5],
          faultDate: String(dateVal),
          ticketNumber: String(data[i][7]),
          receiverName: data[i][8],
          count: count,
          notes: data[i][10] || ''
        });
      }
    }
    
    return {
      success: true,
      records: filtered,
      summary: {
        totalTickets: filtered.length,
        totalDevices: totalDevices
      }
    };
  } catch (err) {
    throw new Error('فشل استخراج التقرير: ' + err.message);
  }
}
`;
