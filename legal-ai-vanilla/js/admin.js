// Admin dashboard functionality
window.addEventListener('DOMContentLoaded', function() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  if (userData.role !== 'owner') {
    alert('غير مصرح لك بالوصول إلى هذه الصفحة');
    window.location.href = 'index.html';
    return;
  }

  // In requests.js we render stats and table, so nothing else needed here.
});
    const currentUserRole = localStorage.getItem('userRole') || 'client';
    const currentUserName = localStorage.getItem('userName') || 'مستخدم';

    // Add admin header with user role
    const container = document.querySelector('.container');
    if (container) {
        const adminHeader = document.createElement('div');
        adminHeader.className = 'admin-header';
        adminHeader.innerHTML = `
            <div class="current-user-info">
                <div class="user-role-badge" style="background: ${ROLE_PERMISSIONS[currentUserRole].color}">
                    ${ROLE_PERMISSIONS[currentUserRole].name}
                </div>
                <span class="user-name">${currentUserName}</span>
            </div>
        `;
        container.insertBefore(adminHeader, container.firstChild);
    }

    // Render admin dashboard based on role
    renderAdminDashboard(currentUserRole);
});

function renderAdminDashboard(userRole) {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    
    // Update dashboard content based on role
    const adminContent = document.querySelector('.container');
    if (!adminContent) return;

    // Add role-specific sections
    if (rolePermissions.permissions.includes('manage_users')) {
        addUserManagementSection();
    }

    if (rolePermissions.permissions.includes('manage_forms')) {
        addFormManagementSection();
    }

    if (rolePermissions.permissions.includes('view_reports')) {
        addReportsSection();
    }
}

function addUserManagementSection() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('.user-management')) return;

    const section = document.createElement('div');
    section.className = 'user-management admin-section';
    section.innerHTML = `
        <h2>إدارة المستخدمين</h2>
        <div class="management-controls">
            <button class="btn-primary" id="add-user-btn">إضافة مستخدم جديد</button>
            <button class="btn-secondary" id="export-users-btn">تصدير المستخدمين</button>
        </div>
        <div class="users-table-container">
            <table class="management-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الدور</th>
                        <th>حالة النشاط</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody id="users-table-body">
                    <!-- Users will be loaded here -->
                </tbody>
            </table>
        </div>
    `;

    container.appendChild(section);

    // Add sample users
    loadSampleUsers();
}

function loadSampleUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    const sampleUsers = [
        { name: 'أحمد محمد', email: 'ahmed@law.com', role: 'lawyer', active: true },
        { name: 'فاطمة علي', email: 'fatima@law.com', role: 'consultant', active: true },
        { name: 'محمد حسن', email: 'mohamed@law.com', role: 'client', active: false },
        { name: 'نور الدين', email: 'nour@company.com', role: 'corporate', active: true },
        { name: 'ليلى الشرقي', email: 'layla@gov.com', role: 'government', active: true }
    ];

    tbody.innerHTML = sampleUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge" style="background: ${ROLE_PERMISSIONS[user.role].color}">
                    ${ROLE_PERMISSIONS[user.role].name}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.active ? 'active' : 'inactive'}">
                    ${user.active ? 'نشط' : 'غير نشط'}
                </span>
            </td>
            <td>
                <button class="btn-action edit">تعديل</button>
                <button class="btn-action delete">حذف</button>
            </td>
        </tr>
    `).join('');
}

function addFormManagementSection() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('.form-management')) return;

    const section = document.createElement('div');
    section.className = 'form-management admin-section';
    section.innerHTML = `
        <h2>إدارة النماذج</h2>
        <div class="management-controls">
            <button class="btn-primary" id="add-form-btn">إضافة نموذج جديد</button>
            <button class="btn-secondary" id="bulk-approve-btn">موافقة جماعية</button>
        </div>
        <div class="forms-stats">
            <div class="stat-item">
                <h3>النماذج المعتمدة</h3>
                <p class="stat-value">65</p>
            </div>
            <div class="stat-item">
                <h3>قيد المراجعة</h3>
                <p class="stat-value">8</p>
            </div>
            <div class="stat-item">
                <h3>مرفوضة</h3>
                <p class="stat-value">2</p>
            </div>
            <div class="stat-item">
                <h3>التنزيلات الكلية</h3>
                <p class="stat-value">12,450</p>
            </div>
        </div>
    `;

    container.appendChild(section);
}

function addReportsSection() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('.reports-section')) return;

    const section = document.createElement('div');
    section.className = 'reports-section admin-section';
    section.innerHTML = `
        <h2>التقارير والإحصائيات</h2>
        <div class="reports-controls">
            <select id="report-type">
                <option value="">اختر نوع التقرير</option>
                <option value="users">تقرير المستخدمين</option>
                <option value="forms">تقرير النماذج</option>
                <option value="consultations">تقرير الاستشارات</option>
                <option value="downloads">تقرير التنزيلات</option>
            </select>
            <select id="report-period">
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذا العام</option>
                <option value="custom">مخصص</option>
            </select>
            <button class="btn-primary" id="generate-report-btn">إنشاء التقرير</button>
            <button class="btn-secondary" id="export-report-btn">تصدير التقرير</button>
        </div>
        <div class="report-output" id="report-output">
            <!-- Report will be generated here -->
        </div>
    `;

    container.appendChild(section);

    // Add event listeners
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    document.getElementById('export-report-btn').addEventListener('click', exportReport);
}

function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const reportPeriod = document.getElementById('report-period').value;
    const reportOutput = document.getElementById('report-output');

    if (!reportType) {
        alert('يرجى اختيار نوع التقرير');
        return;
    }

    let reportContent = `
        <div class="report-header">
            <h3>تقرير ${reportType === 'users' ? 'المستخدمين' : reportType === 'forms' ? 'النماذج' : reportType === 'consultations' ? 'الاستشارات' : 'التنزيلات'}</h3>
            <p>الفترة: ${reportPeriod}</p>
            <p>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        <div class="report-content">
            <p>تم إنشاء التقرير بنجاح. يتضمن البيانات التالية:</p>
            <ul>
                <li>العدد الكلي: ${Math.floor(Math.random() * 1000)}</li>
                <li>النمو: ${Math.floor(Math.random() * 100)}%</li>
                <li>معدل الاستخدام: ${Math.floor(Math.random() * 100)}%</li>
                <li>التقييم: ${(Math.random() * 5).toFixed(1)}/5</li>
            </ul>
        </div>
    `;

    reportOutput.innerHTML = reportContent;
}

function exportReport() {
    const reportOutput = document.getElementById('report-output').innerText;
    if (!reportOutput) {
        alert('يرجى إنشاء التقرير أولاً');
        return;
    }

    const blob = new Blob([reportOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export roles for use in other scripts
window.USER_ROLES = USER_ROLES;
window.ROLE_PERMISSIONS = ROLE_PERMISSIONS;
