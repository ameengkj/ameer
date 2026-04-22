import { DataStore } from './data_store.js';

const app = {
    init() {
        this.renderPublicSearch();
        window.app = this;
        lucide.createIcons();
    },

    showToast(msg, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`;
        toast.innerHTML = `<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    renderPublicSearch() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="fade-in max-w-2xl mx-auto text-center space-y-8">
                <div class="space-y-4">
                    <h2 class="text-4xl font-black text-slate-900">متابعة الطالب</h2>
                    <p class="text-gray-500">أدخل رقم هوية الطالب لاستعراض بطاقة الأداء والسجل التعليمي</p>
                </div>

                <div class="glass-card p-8">
                    <div class="flex flex-col md:flex-row gap-4">
                        <input type="number" id="nid-search" placeholder="رقم هوية الطالب..." class="input-field">
                        <button onclick="app.handleSearch()" class="btn-primary whitespace-nowrap">
                            <i data-lucide="search" class="w-5 h-5"></i>
                            بحث عن البيانات
                        </button>
                    </div>
                </div>

                <div id="search-result-area" class="mt-8"></div>
            </div>
        `;
        lucide.createIcons();
    },

    handleSearch() {
        const nid = document.getElementById('nid-search').value;
        if (!nid) return this.showToast('الرجاء إدخال رقم الهوية', 'error');

        const student = DataStore.findStudentByNid(nid);
        const resultArea = document.getElementById('search-result-area');
        
        if (!student) {
            resultArea.innerHTML = `
                <div class="glass-card p-12 text-center text-gray-400">
                    <i data-lucide="user-x" class="w-16 h-16 mx-auto mb-4 opacity-20"></i>
                    <p class="text-lg">عذراً، لم يتم العثور على طالب بهذا الرقم</p>
                </div>
            `;
        } else {
            this.renderStudentCard(student, resultArea);
        }
        lucide.createIcons();
    },

    renderStudentCard(student, container) {
        container.innerHTML = `
            <div class="fade-in space-y-6 text-right">
                <div class="glass-card student-card-gradient p-8">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div class="space-y-2">
                            <span class="px-3 py-1 bg-orange-100 text-[#FF6B00] text-xs font-bold rounded-full">${student.level || 'غير محدد'}</span>
                            <h3 class="text-3xl font-bold text-slate-900">${student.name}</h3>
                            <p class="text-gray-500 flex items-center gap-2">
                                <i data-lucide="fingerprint" class="w-4 h-4"></i> ${student.nid}
                            </p>
                        </div>
                        <div class="flex gap-4">
                            <div class="text-center p-4 bg-white rounded-2xl shadow-sm border border-orange-50">
                                <div class="text-2xl font-black text-[#FF6B00]">${student.stats.attendanceRate}%</div>
                                <div class="text-xs text-gray-400">نسبة الحضور</div>
                            </div>
                            <div class="text-center p-4 bg-white rounded-2xl shadow-sm border border-orange-50">
                                <div class="text-2xl font-black text-slate-900">${student.behavior || 'جيد'}</div>
                                <div class="text-xs text-gray-400">السلوك العام</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        <div class="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <h4 class="font-bold mb-4 flex items-center gap-2">
                                <i data-lucide="book-open" class="text-blue-500"></i> آخر إنجاز مسجل
                            </h4>
                            <div class="text-lg font-semibold text-slate-800">
                                سورة ${student.lastSurah || 'لا يوجد'} (${student.lastAyah || '0'})
                            </div>
                        </div>
                        <div class="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <h4 class="font-bold mb-4 flex items-center gap-2">
                                <i data-lucide="phone" class="text-green-500"></i> تواصل ولي الأمر
                            </h4>
                            <div class="text-lg font-semibold text-slate-800">${student.phone || 'غير مسجل'}</div>
                        </div>
                    </div>
                </div>

                <div class="glass-card p-8">
                    <h4 class="text-xl font-bold mb-6 flex items-center gap-2">
                        <i data-lucide="history" class="text-[#FF6B00]"></i> سجل الإنجازات الأخيرة
                    </h4>
                    <div class="space-y-4">
                        ${student.logs.length > 0 ? student.logs.map(log => `
                            <div class="p-4 rounded-2xl border border-gray-50 bg-white flex justify-between items-center">
                                <div>
                                    <div class="font-bold">حفظ: ${log.surahFrom} (${log.ayahFrom} - ${log.ayahTo})</div>
                                    <div class="text-sm text-gray-400 italic">${log.note || 'بدون ملاحظات'}</div>
                                </div>
                                <div class="text-xs font-medium text-gray-400">${log.date}</div>
                            </div>
                        `).join('') : '<p class="text-gray-400 text-center py-4">لا يوجد سجلات متاحة حالياً</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    showLogin() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="fade-in max-w-md mx-auto py-12">
                <div class="glass-card p-10 space-y-8">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="lock" class="w-8 h-8"></i>
                        </div>
                        <h2 class="text-2xl font-bold">تسجيل دخول المحفظ</h2>
                        <p class="text-gray-400 text-sm mt-2">يرجى إدخال كلمة المرور للوصول للوحة التحكم</p>
                    </div>

                    <div class="space-y-4">
                        <input type="password" id="admin-pass" placeholder="كلمة المرور..." class="input-field">
                        <button onclick="app.handleLogin()" class="btn-primary w-full">دخول</button>
                        <button onclick="app.renderPublicSearch()" class="btn-secondary w-full">عودة للخلف</button>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    handleLogin() {
        const pass = document.getElementById('admin-pass').value;
        if (pass === '1234') {
            this.showDashboard();
            this.showToast('تم تسجيل الدخول بنجاح');
        } else {
            this.showToast('كلمة المرور غير صحيحة', 'error');
        }
    },

    showDashboard() {
        const authActions = document.getElementById('auth-actions');
        authActions.innerHTML = `
            <button onclick="window.location.reload()" class="text-red-500 font-bold">خروج</button>
        `;

        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="fade-in max-w-4xl mx-auto space-y-8">
                <div class="flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-bold">لوحة تحكم المحفظ</h2>
                        <p class="text-gray-500">استيراد وتحديث بيانات الطلاب</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="glass-card p-8 space-y-6">
                        <div class="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <i data-lucide="file-up" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">استيراد ملف JSON</h3>
                            <p class="text-gray-500 text-sm mt-1">قم برفع الملف المصدر من نظام الإدارة</p>
                        </div>
                        <input type="file" id="file-input" class="hidden" accept=".json">
                        <button onclick="document.getElementById('file-input').click()" class="btn-primary w-full">اختيار ملف</button>
                    </div>

                    <div class="glass-card p-8 space-y-6">
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <i data-lucide="clipboard-list" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">لصق نص البيانات</h3>
                            <p class="text-gray-500 text-sm mt-1">قم بلصق الكود المشفر هنا مباشرة</p>
                        </div>
                        <button onclick="app.handlePasteImport()" class="btn-secondary w-full">لصق ودمج</button>
                    </div>
                </div>

                <div class="glass-card p-6 bg-orange-50 border-orange-100">
                    <div class="flex gap-4">
                        <i data-lucide="info" class="text-orange-500"></i>
                        <p class="text-sm text-orange-800 leading-relaxed">
                            ملاحظة: عملية الاستيراد لن تقوم بمسح البيانات الحالية. سيتم دمج سجلات الطلاب الجديدة وتحديث بيانات الطلاب الحاليين فقط (على أساس رقم الهوية).
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (DataStore.merge(data)) {
                        this.showToast('تم تحديث قاعدة البيانات بنجاح');
                    }
                } catch (err) {
                    this.showToast('تنسيق الملف غير صالح', 'error');
                }
            };
            reader.readAsText(file);
        };
        lucide.createIcons();
    },

    async handlePasteImport() {
        const input = prompt('قم بلصق كود البيانات هنا:');
        if (!input) return;
        try {

            let data;
            try {
                const decoded = decodeURIComponent(escape(atob(input)));
                data = JSON.parse(decoded);
            } catch {
                data = JSON.parse(input);
            }

            if (DataStore.merge(data)) {
                this.showToast('تم دمج البيانات المنسوخة');
            }
        } catch (err) {
            this.showToast('الكود المدخل غير صالح', 'error');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
