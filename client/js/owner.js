// Admin Dashboard

document.addEventListener('DOMContentLoaded', loadAdminData);

async function loadAdminData() {
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }
  
  loadStats();
  setupAdminTabs();
  loadUsers();
  loadConsultations();
  loadRequests();
}

async function loadStats() {
  try {
    // Mock stats - would be real from API
    document.getElementById('stat-total-users').textContent = '42';
    document.getElementById('stat-total-consultations').textContent = '156';
    document.getElementById('stat-pending-requests').textContent = '8';
    document.getElementById('stat-total-revenue').textContent = '5,200 ر.س';
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function setupAdminTabs() {
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(tab + '-tab').classList.add('active');
      this.classList.add('active');
    });
  });
}

async function loadUsers() {
  try {
    // Mock users data
    const tbody = document.getElementById('users-table').querySelector('tbody');
    tbody.innerHTML = `
      <tr><td>1</td><td>user1@example.com</td><td>محمد</td><td>مستخدم</td><td>10</td><td>
        <button class="btn-small" onclick="addCredits(1)">إضافة رصيد</button>
      </td></tr>
      <tr><td>2</td><td>user2@example.com</td><td>فاطمة</td><td>مستخدم</td><td>25</td><td>
        <button class="btn-small" onclick="addCredits(2)">إضافة رصيد</button>
      </td></tr>
    `;
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadConsultations() {
  try {
    // Mock consultations
    const tbody = document.getElementById('consultations-table').querySelector('tbody');
    tbody.innerHTML = `
      <tr><td>محمد</td><td>محامي</td><td>ما هي حقوقي...</td><td>اليوم</td><td>
        <button class="btn-small">عرض</button>
      </td></tr>
    `;
  } catch (error) {
    console.error('Error loading consultations:', error);
  }
}

async function loadRequests() {
  try {
    // Mock requests
    const tbody = document.getElementById('requests-table').querySelector('tbody');
    tbody.innerHTML = `
      <tr><td>محمد</td><td>100 ر.س</td><td><span class="badge" style="background: #fbbf24;">معلق</span></td><td>أمس</td><td>
        <button class="btn-small" onclick="approvePayment(1)">موافقة</button>
      </td></tr>
    `;
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

function addCredits(userId) {
  showModal('add-credits-modal');
  document.getElementById('credits-user-id').value = `المستخدم ${userId}`;
}

function addCreditsSubmit() {
  const amount = document.getElementById('credits-amount').value;
  const reason = document.getElementById('credits-reason').value;
  
  if (!amount) {
    showToast('يرجى إدخال المبلغ', 'warning');
    return;
  }
  
  showToast(`تم إضافة ${amount} وحدة رصيد`, 'success');
  closeModal('add-credits-modal');
}

function approvePayment(requestId) {
  showModal('approve-request-modal');
}

function approveRequest() {
  showToast('تمت الموافقة على الطلب', 'success');
  closeModal('approve-request-modal');
  loadRequests();
}

function rejectRequest() {
  showToast('تم رفض الطلب', 'success');
  closeModal('approve-request-modal');
  loadRequests();
}
