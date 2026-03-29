// Government Forms Data with 50+ official templates
const governmentForms = [
    // عقود - 10 نماذج
    { id: 1, name: 'عقد بيع عقار', category: 'عقود', type: 'word', desc: 'نموذج معتمد لعقد بيع العقار' },
    { id: 2, name: 'عقد إيجار سكني', category: 'عقود', type: 'word', desc: 'عقد إيجار سكني سارٍ النفاذ' },
    { id: 3, name: 'عقد الشغل والعمل', category: 'عقود', type: 'word', desc: 'نموذج عقد عمل حسب نظام العمل' },
    { id: 4, name: 'عقد الوكالة', category: 'عقود', type: 'word', desc: 'وثيقة توكيل معتمدة' },
    { id: 5, name: 'عقد قرض آدمي', category: 'عقود', type: 'word', desc: 'نموذج عقد قرض شخصي' },
    { id: 6, name: 'عقد هبة', category: 'عقود', type: 'word', desc: 'عقد تبرع وهبة السلع' },
    { id: 7, name: 'عقد بيع منقولات', category: 'عقود', type: 'word', desc: 'نموذج بيع سيارة أو منقول' },
    { id: 8, name: 'عقد إيجار تجاري', category: 'عقود', type: 'word', desc: 'عقد إيجار للمحلات والمتاجر' },
    { id: 9, name: 'عقد شراكة', category: 'عقود', type: 'word', desc: 'اتفاقية شراكة تجارية' },
    { id: 10, name: 'عقد بيع حصة', category: 'عقود', type: 'word', desc: 'نموذج نقل الحصة الشركية' },

    // شركات - 12 نموذج
    { id: 11, name: 'نموذج تسجيل شركة ذات مسؤولية محدودة', category: 'شركات', type: 'word', desc: 'استمارة تسجيل الشركة' },
    { id: 12, name: 'عقد تأسيس شركة مساهمة عامة', category: 'شركات', type: 'word', desc: 'وثائق تأسيس الشركة' },
    { id: 13, name: 'عقد تأسيس شركة مساهمة مغلقة', category: 'شركات', type: 'word', desc: 'عقد مساهمة خاصة' },
    { id: 14, name: 'عقد تأسيس شراكة عادية', category: 'شركات', type: 'word', desc: 'شراكة عامة' },
    { id: 15, name: 'عقد تأسيس شراكة بسيطة', category: 'شركات', type: 'word', desc: 'شراكة بسيطة منتهية' },
    { id: 16, name: 'نظام للشركة', category: 'شركات', type: 'word', desc: 'اللائحة الأساسية للشركة' },
    { id: 17, name: 'محضر اجتماع الجمعية العمومية', category: 'شركات', type: 'word', desc: 'تقرير الاجتماع الشركي' },
    { id: 18, name: 'محضر مجلس الإدارة', category: 'شركات', type: 'word', desc: 'وثيقة اجتماع الإدارة' },
    { id: 19, name: 'شهادة تسجيل شركة', category: 'شركات', type: 'word', desc: 'شهادة من السجل التجاري' },
    { id: 20, name: 'استبيان المراجعة الداخلية', category: 'شركات', type: 'word', desc: 'نموذج التدقيق الداخلي' },
    { id: 21, name: 'نموذج استثمار أجنبي', category: 'شركات', type: 'word', desc: 'طلب استثمار أجنبي' },
    { id: 22, name: 'نموذج تصفية شركة', category: 'شركات', type: 'word', desc: 'وثائق إنهاء وتصفية الشركة' },

    // عمل - 10 نماذج
    { id: 23, name: 'شهادة خبرة عمل', category: 'عمل', type: 'word', desc: 'نموذج شهادة العمل' },
    { id: 24, name: 'نموذج طلب إجازة', category: 'عمل', type: 'word', desc: 'استمارة الإجازة الموظفة' },
    { id: 25, name: 'نموذج تقييم الموظف', category: 'عمل', type: 'word', desc: 'استبيان تقييم الأداء' },
    { id: 26, name: 'اتفاقية عدم المنافسة', category: 'عمل', type: 'word', desc: 'عقد حماية براءة الاختراع' },
    { id: 27, name: 'نموذج الشكوى الوظيفية', category: 'عمل', type: 'word', desc: 'استمارة الشكوى الداخلية' },
    { id: 28, name: 'استمارة الحضور والغياب', category: 'عمل', type: 'word', desc: 'سجل الدوام الموظفين' },
    { id: 29, name: 'نموذج طلب علاوة راتب', category: 'عمل', type: 'word', desc: 'طلب زيادة الراتب' },
    { id: 30, name: 'عقد العامل المؤقت', category: 'عمل', type: 'word', desc: 'عقد عمل مؤقت' },
    { id: 31, name: 'نموذج الإنذار الوظيفي', category: 'عمل', type: 'word', desc: 'استمارة الإنذار' },
    { id: 32, name: 'شهادة إنهاء الخدمة', category: 'عمل', type: 'word', desc: 'نموذج الفصل من الوظيفة' },

    // عقارات - 10 نماذج
    { id: 33, name: 'نموذج عقد شراء عقار', category: 'عقارات', type: 'word', desc: 'وثيقة شراء العقار المعتمدة' },
    { id: 34, name: 'نموذج استأجار عقار تجاري', category: 'عقارات', type: 'word', desc: 'عقد إيجار محل تجاري' },
    { id: 35, name: 'نموذج إيجار شقة سكنية', category: 'عقارات', type: 'word', desc: 'عقد إيجار دار سكنية' },
    { id: 36, name: 'نموذج رهن عقاري', category: 'عقارات', type: 'word', desc: 'وثيقة الرهن والتوثيق' },
    { id: 37, name: 'نموذج نقل ملكية عقار', category: 'عقارات', type: 'word', desc: 'استمارة نقل الملكية' },
    { id: 38, name: 'نموذج تأجير غرف في عمارة', category: 'عقارات', type: 'word', desc: 'عقد إيجار غرفة' },
    { id: 39, name: 'نموذج عقد الإيجار بدون أثاث', category: 'عقارات', type: 'word', desc: 'عقد إيجار مفروش' },
    { id: 40, name: 'نموذج فسخ عقد الإيجار', category: 'عقارات', type: 'word', desc: 'وثيقة إنهاء الإيجار' },
    { id: 41, name: 'نموذج تقدير المتروك العقاري', category: 'عقارات', type: 'word', desc: 'تقييم العقار المتروك' },
    { id: 42, name: 'نموذج إيجار أرض زراعية', category: 'عقارات', type: 'word', desc: 'عقد إيجار الأرض' },

    // أحوال شخصية - 8 نماذج
    { id: 43, name: 'نموذج عقد نكاح', category: 'أسرة', type: 'word', desc: 'عقد الزواج الشرعي' },
    { id: 44, name: 'نموذج طلب الطلاق', category: 'أسرة', type: 'word', desc: 'طلب التطليق' },
    { id: 45, name: 'نموذج توكيل زوجة', category: 'أسرة', type: 'word', desc: 'وكالة الزوجة' },
    { id: 46, name: 'نموذج عقد الوصاية', category: 'أسرة', type: 'word', desc: 'اتفاقية الولاية' },
    { id: 47, name: 'نموذج طلب الحضانة', category: 'أسرة', type: 'word', desc: 'طلب حضانة الأطفال' },
    { id: 48, name: 'نموذج عقد كفالة يتيم', category: 'أسرة', type: 'word', desc: 'اتفاقية الكفالة' },
    { id: 49, name: 'نموذج طلب نفقة', category: 'أسرة', type: 'word', desc: 'طلب النفقة' },
    { id: 50, name: 'نموذج اتفاق على التراضي', category: 'أسرة', type: 'word', desc: 'عقد تسوية عائلية' },

    // تجارة - 6 نماذج
    { id: 51, name: 'نموذج فاتورة ضريبية', category: 'تجارة', type: 'word', desc: 'فاتورة البيع النظامية' },
    { id: 52, name: 'نموذج عقد توكيل تجاري', category: 'تجارة', type: 'word', desc: 'وكالة تجارية' },
    { id: 53, name: 'نموذج دفتر اليوميات', category: 'تجارة', type: 'word', desc: 'السجل المحاسبي' },
    { id: 54, name: 'نموذج كشف الحساب', category: 'تجارة', type: 'word', desc: 'بيان الحساب البنكي' },
    { id: 55, name: 'نموذج عقد استبدال بضاعة', category: 'تجارة', type: 'word', desc: 'اتفاقية الاستبدال' },
    { id: 56, name: 'نموذج إذن استلام البضاعة', category: 'تجارة', type: 'word', desc: 'شهادة الاستلام' },

    // ضرائب - 4 نماذج
    { id: 57, name: 'نموذج طلب رقم ضريبي', category: 'ضرائب', type: 'word', desc: 'استمارة التسجيل الضريبي' },
    { id: 58, name: 'نموذج إقرار ضريبي', category: 'ضرائب', type: 'word', desc: 'التصريح الضريبي السنوي' },
    { id: 59, name: 'نموذج شهادة ضريبية', category: 'ضرائب', type: 'word', desc: 'شهادة الخلو الضريبي' },
    { id: 60, name: 'نموذج طلب إرجاع ضريبي', category: 'ضرائب', type: 'word', desc: 'طلب استرجاع الضريبة' },

    // إجراءات قانونية - 5 نماذج
    { id: 61, name: 'نموذج لائحة دعوى قضائية', category: 'إجراءات', type: 'word', desc: 'استمارة الدعوى القضائية' },
    { id: 62, name: 'نموذج تظلم إداري', category: 'إجراءات', type: 'word', desc: 'طلب الاعتراض الإداري' },
    { id: 63, name: 'نموذج طلب خبرة قضائية', category: 'إجراءات', type: 'word', desc: 'طلب خبير قضائي' },
    { id: 64, name: 'نموذج إقرار شهادة', category: 'إجراءات', type: 'word', desc: 'إثبات الشهادة' },
    { id: 65, name: 'نموذج طلب حجز تحفظي', category: 'إجراءات', type: 'word', desc: 'طلب الحجز' }
];

// Initialize Forms Page
document.addEventListener('DOMContentLoaded', function() {
    const formsGrid = document.getElementById('forms-grid');
    const searchInput = document.getElementById('forms-search');
    const categorySelect = document.getElementById('forms-category');

    // Render all forms
    function renderForms(forms) {
        formsGrid.innerHTML = '';
        forms.forEach(form => {
            const formCard = document.createElement('div');
            formCard.className = 'form-card';
            formCard.innerHTML = `
                <h3>${form.name}</h3>
                <p class="form-category">${form.category}</p>
                <p class="form-desc">${form.desc}</p>
                <div class="form-actions">
                    <button class="btn-download-form" data-form-id="${form.id}" data-form-name="${form.name}">
                        تحميل ${form.type.toUpperCase()}
                    </button>
                    <button class="btn-preview-form" data-form-id="${form.id}">معاينة</button>
                </div>
            `;
            formsGrid.appendChild(formCard);
        });

        // Add event listeners to download buttons
        document.querySelectorAll('.btn-download-form').forEach(btn => {
            btn.addEventListener('click', function() {
                downloadForm(this.dataset.formId, this.dataset.formName, 'word');
            });
        });

        // Add event listeners to preview buttons
        document.querySelectorAll('.btn-preview-form').forEach(btn => {
            btn.addEventListener('click', function() {
                previewForm(this.dataset.formId);
            });
        });
    }

    // Filter forms
    function filterForms() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryTerm = categorySelect.value;

        let filtered = governmentForms.filter(form => {
            const matchesSearch = form.name.includes(searchTerm) || form.desc.includes(searchTerm);
            const matchesCategory = !categoryTerm || form.category === categoryTerm;
            return matchesSearch && matchesCategory;
        });

        renderForms(filtered);
    }

    // Download form
    function downloadForm(formId, formName, type) {
        const form = governmentForms.find(f => f.id == formId);
        if (!form) return;

        // Mock download functionality
        const content = `
────────────────────────────────────────
نموذج: ${form.name}
الفئة: ${form.category}
الوصف: ${form.desc}
────────────────────────────────────────

الاستخدام:
اطبع هذا النموذج على ورقة A4 وقم بملء البيانات المطلوبة.

ملاحظات مهمة:
1. استخدم حبراً أسود أو أزرق فقط
2. تأكد من وضوح الكتابة
3. احفظ نسخة من الوثيقة الموقّعة
4. استشر محامياً قبل التوقيع على أي وثيقة قانونية

التاريخ: ${new Date().toLocaleDateString('ar-SA')}
────────────────────────────────────────
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formName}.${type === 'word' ? 'docx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`نموذج ${formName} تم تحميله بنجاح`);
    }

    // Preview form
    function previewForm(formId) {
        const form = governmentForms.find(f => f.id == formId);
        if (!form) return;

        alert(`
معاينة النموذج:
${form.name}

الفئة: ${form.category}
الوصف: ${form.desc}

النموذج جاهز للتحميل والاستخدام الفوري.
    `);
    }

    // Event listeners
    searchInput.addEventListener('input', filterForms);
    categorySelect.addEventListener('change', filterForms);

    // Initial render
    renderForms(governmentForms);
});
