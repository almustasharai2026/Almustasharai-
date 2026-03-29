// Templates functionality
document.addEventListener('DOMContentLoaded', function() {
    const templateButtons = document.querySelectorAll('.template-btn');
    const templateForm = document.getElementById('template-form');
    const formTitle = document.getElementById('form-title');
    const dynamicForm = document.getElementById('dynamic-form');
    const generateBtn = document.getElementById('generate-btn');
    const generatedDocument = document.getElementById('generated-document');
    const documentContent = document.getElementById('document-content');

    const templates = {
        'employment': {
            title: 'عقد عمل',
            fields: [
                { name: 'employer_name', label: 'اسم صاحب العمل', type: 'text', required: true },
                { name: 'employee_name', label: 'اسم الموظف', type: 'text', required: true },
                { name: 'job_title', label: 'المسمى الوظيفي', type: 'text', required: true },
                { name: 'salary', label: 'الراتب الشهري', type: 'number', required: true },
                { name: 'start_date', label: 'تاريخ البدء', type: 'date', required: true },
                { name: 'end_date', label: 'تاريخ الانتهاء (اختياري)', type: 'date', required: false },
                { name: 'work_hours', label: 'ساعات العمل', type: 'text', required: false }
            ]
        },
        'partnership': {
            title: 'عقد شراكة',
            fields: [
                { name: 'partner1_name', label: 'اسم الشريك الأول', type: 'text', required: true },
                { name: 'partner2_name', label: 'اسم الشريك الثاني', type: 'text', required: true },
                { name: 'business_name', label: 'اسم النشاط التجاري', type: 'text', required: true },
                { name: 'capital', label: 'رأس المال', type: 'number', required: true },
                { name: 'partner1_share', label: 'حصة الشريك الأول (%)', type: 'number', required: true },
                { name: 'partner2_share', label: 'حصة الشريك الثاني (%)', type: 'number', required: true },
                { name: 'business_type', label: 'نوع النشاط', type: 'text', required: true }
            ]
        },
        'lawsuit': {
            title: 'صحيفة دعوى',
            fields: [
                { name: 'court_name', label: 'اسم المحكمة', type: 'text', required: true },
                { name: 'plaintiff_name', label: 'اسم المدعي', type: 'text', required: true },
                { name: 'defendant_name', label: 'اسم المدعى عليه', type: 'text', required: true },
                { name: 'case_subject', label: 'موضوع الدعوى', type: 'textarea', required: true },
                { name: 'claim_amount', label: 'قيمة المطالبة (اختياري)', type: 'number', required: false },
                { name: 'lawyer_name', label: 'اسم المحامي', type: 'text', required: false }
            ]
        },
        'memo': {
            title: 'مذكرة قانونية',
            fields: [
                { name: 'sender_name', label: 'اسم المرسل', type: 'text', required: true },
                { name: 'recipient_name', label: 'اسم المستلم', type: 'text', required: true },
                { name: 'subject', label: 'الموضوع', type: 'text', required: true },
                { name: 'content', label: 'محتوى المذكرة', type: 'textarea', required: true },
                { name: 'date', label: 'التاريخ', type: 'date', required: true },
                { name: 'reference', label: 'المرجع (اختياري)', type: 'text', required: false }
            ]
        }
    };

    // Template selection
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateType = this.dataset.template;
            const template = templates[templateType];
            
            formTitle.textContent = template.title;
            generateForm(template.fields);
            templateForm.style.display = 'block';
            generatedDocument.style.display = 'none';
        });
    });

    function generateForm(fields) {
        dynamicForm.innerHTML = '';
        
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.name);
            
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 4;
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            
            input.id = field.name;
            input.name = field.name;
            if (field.required) {
                input.required = true;
            }
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            dynamicForm.appendChild(formGroup);
        });
    }

    // Generate document
    generateBtn.addEventListener('click', function() {
        const formData = new FormData(dynamicForm);
        const templateType = document.querySelector('.template-btn.active')?.dataset.template || 
                           Array.from(templateButtons).find(btn => btn.style.display !== 'none')?.dataset.template;
        
        if (!templateType) return;
        
        const template = templates[templateType];
        const documentText = generateDocumentText(template, formData);
        
        documentContent.innerHTML = documentText.replace(/\n/g, '<br>');
        generatedDocument.style.display = 'block';
    });

    function generateDocumentText(template, formData) {
        const data = {};
        template.fields.forEach(field => {
            data[field.name] = formData.get(field.name) || '';
        });

        switch(template.title) {
            case 'عقد عمل':
                return `عقد عمل

المادة الأولى: الأطراف
الطرف الأول (صاحب العمل): ${data.employer_name}
الطرف الثاني (الموظف): ${data.employee_name}

المادة الثانية: المسمى الوظيفي
يتم تعيين الطرف الثاني في منصب: ${data.job_title}

المادة الثالثة: الراتب والتعويضات
يتقاضى الطرف الثاني راتباً شهرياً قدره: ${data.salary} ريال سعودي

المادة الرابعة: مدة العقد
يبدأ العقد في تاريخ: ${data.start_date}
${data.end_date ? `ينتهي العقد في تاريخ: ${data.end_date}` : 'عقد غير محدد المدة'}

${data.work_hours ? `المادة الخامسة: ساعات العمل\nساعات العمل: ${data.work_hours}` : ''}

التاريخ: ${new Date().toLocaleDateString('ar')}
                `;
            
            case 'عقد شراكة':
                return `عقد شراكة

المادة الأولى: الأطراف
الشريك الأول: ${data.partner1_name}
الشريك الثاني: ${data.partner2_name}

المادة الثانية: النشاط التجاري
اسم النشاط: ${data.business_name}
نوع النشاط: ${data.business_type}

المادة الثالثة: رأس المال والحصص
إجمالي رأس المال: ${data.capital} ريال سعودي
حصة الشريك الأول: ${data.partner1_share}%
حصة الشريك الثاني: ${data.partner2_share}%

التاريخ: ${new Date().toLocaleDateString('ar')}
                `;
            
            case 'صحيفة دعوى':
                return `صحيفة دعوى

إلى محكمة: ${data.court_name}

المدعي: ${data.plaintiff_name}
المدعى عليه: ${data.defendant_name}

${data.lawyer_name ? `وكيل المدعي: ${data.lawyer_name}` : ''}

موضوع الدعوى:
${data.case_subject}

${data.claim_amount ? `قيمة المطالبة: ${data.claim_amount} ريال سعودي` : ''}

التاريخ: ${new Date().toLocaleDateString('ar')}
                `;
            
            case 'مذكرة قانونية':
                return `مذكرة قانونية

من: ${data.sender_name}
إلى: ${data.recipient_name}

الموضوع: ${data.subject}
${data.reference ? `المرجع: ${data.reference}` : ''}

التاريخ: ${data.date}

المحتوى:
${data.content}

مع خالص التحية،

${data.sender_name}
                `;
            
            default:
                return 'نموذج غير معروف';
        }
    }
});