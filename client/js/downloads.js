// Template Downloads

function downloadTemplate(templateType, format) {
  showLoading(true);
  
  const templates = {
    contract: {
      ar: { name: 'عقد شراء عقار', content: generateContractAr() },
      en: { name: 'Property Purchase Agreement', content: generateContractEn() }
    },
    lease: {
      ar: { name: 'عقد الإيجار', content: generateLeaseAr() },
      en: { name: 'Lease Agreement', content: generateLeaseEn() }
    },
    partnership: {
      ar: { name: 'عقد الشراكة', content: generatePartnershipAr() },
      en: { name: 'Partnership Agreement', content: generatePartnershipEn() }
    }
  };
  
  const template = templates[templateType];
  if (!template) {
    showToast('قالب غير موجود', 'error');
    return;
  }
  
  const lang = currentLanguage || 'ar';
  const doc = template[lang] || template.ar;
  
  if (format === 'pdf') {
    downloadPDF(doc.name, doc.content);
  } else if (format === 'word') {
    downloadWord(doc.name, doc.content);
  }
  
  showLoading(false);
  showToast('تم تحميل الملف بنجاح', 'success');
}

function downloadPDF(name, content) {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `${name}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadWord(name, content) {
  const docContent = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; line-height: 1.6; margin: 2cm; }
          h1 { text-align: center; margin-bottom: 2cm; }
        </style>
      </head>
      <body>
        <h1>${name}</h1>
        <p>${content.replace(/\n/g, '</p><p>')}</p>
      </body>
    </html>
  `;
  
  const element = document.createElement('a');
  const file = new Blob([docContent], {type: 'application/msword'});
  element.href = URL.createObjectURL(file);
  element.download = `${name}.doc`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Template Content Generators
function generateContractAr() {
  return `عقد شراء عقار

بتاريخ: ................
بين: .................... (الطرف الأول - البائع)
والسيد/السيدة: ...................... (الطرف الثاني - المشتري)

تم الاتفاق على ما يلي:

المادة الأولى: موضوع العقد
يتعهد الطرف الأول ببيع العقار المخصص تحت رقم ................. الواقع بـ .................

المادة الثانية: السعر والشروط
السعر الإجمالي: ................. ريال سعودي
تاريخ التسليم: .................

المادة الثالثة: الالتزامات
يلتزم الطرف الأول بتسليم العقار خالياً من أي التزامات.
يلتزم الطرف الثاني بدفع السعر كاملاً في تاريخ التسليم.

المادة الرابعة: الشروط العامة
هذا العقد يخضع لجميع القوانين واللوائح المعمول بها.

وقع الطرفان:
الطرف الأول: ...................... التوقيع: ................
الطرف الثاني: ...................... التوقيع: ................`;
}

function generateContractEn() {
  return `Property Purchase Agreement

Date: ................
Between: ...................... (First Party - Seller)
And: ...................... (Second Party - Buyer)

The parties agree as follows:

Article 1: Subject Matter
The First Party sells the property under number ................. located at .................

Article 2: Price and Terms
Total Price: ................. SAR
Delivery Date: .................

Article 3: Obligations
The First Party commits to deliver the property free of any liens.
The Second Party commits to pay the full amount on delivery date.

Article 4: General Terms
This agreement is subject to all applicable laws and regulations.

Signed by both parties:
First Party: ...................... Signature: ................
Second Party: ...................... Signature: ................`;
}

function generateLeaseAr() {
  return `عقد الإيجار

بتاريخ: ................
بين المالك: ...................... 
المستأجر: ................

تم الاتفاق على ما يلي:

المادة الأولى: العين المؤجرة
الشقة / المكتب المخصص تحت رقم ................. الواقعة بـ .................

المادة الثانية: مدة الإيجار
مدة الإيجار: ................. سنة
تاريخ البداية: .................
تاريخ النهاية: .................

المادة الثالثة: الأجرة
الأجرة الشهرية: ................. ريال سعودي
تاريخ الدفع: أول كل شهر

المادة الرابعة: الالتزامات
على المستأجر الحفاظ على سلامة العين والقيام بالصيانة الدورية.
على المالك ضمان صلاحية العين للاستخدام.

وقع الطرفان:
المالك: ...................... التوقيع: ................
المستأجر: ...................... التوقيع: ................`;
}

function generateLeaseEn() {
  return `Lease Agreement

Date: ................
Between Landlord: ...................... 
Tenant: ................

The parties agree as follows:

Article 1: Leased Property
Apartment/Office under number ................. located at .................

Article 2: Lease Term
Duration: ................. year(s)
Start Date: .................
End Date: .................

Article 3: Rent
Monthly Rent: ................. SAR
Payment Date: First of each month

Article 4: Obligations
Tenant shall maintain the property in good condition and perform regular maintenance.
Landlord shall ensure the property is suitable for use.

Signed by both parties:
Landlord: ...................... Signature: ................
Tenant: ...................... Signature: ................`;
}

// Additional template generators (simplified)
function generatePartnershipAr() { return 'عقد الشراكة\n\nبين الشركاء...\n\nالشروط والأحكام...'; }
function generatePartnershipEn() { return 'Partnership Agreement\n\nBetween Partners...\n\nTerms and Conditions...'; }
