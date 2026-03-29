// Payment requests handler for both users and owner dashboard
const STORAGE_KEY_REQUESTS = 'paymentRequests';

function getRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_REQUESTS) || '[]');
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
}

function addRequest(request) {
  const requests = getRequests();
  requests.push(request);
  saveRequests(requests);
}

function updateRequestStatus(id, status) {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return;

  requests[idx].status = status;
  requests[idx].updatedAt = new Date().toISOString();

  if (status === 'accepted') {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    // update specific user: if owner updates other user, we must locate that user by username cache
    if (userData.username === requests[idx].username) {
      if (userData.balance !== Infinity) { userData.balance = Number(userData.balance || 0) + Number(requests[idx].credits || 0); }
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  saveRequests(requests);
}

function renderOwnerRequestsTable() {
  const tableBody = document.querySelector('#requests-table tbody');
  if (!tableBody) return;
  const requests = getRequests();

  tableBody.innerHTML = '';
  if (!requests.length) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد طلبات</td></tr>';
    return;
  }

  requests.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.username}</td>
      <td>${request.amount}</td>
      <td>0201130031531</td>
      <td>${request.fileName || 'لا يوجد'}</td>
      <td>${request.status}</td>
      <td>${new Date(request.createdAt).toLocaleString('ar')}</td>
      <td>
        <button class="accept" data-id="${request.id}">قبول</button>
        <button class="reject" data-id="${request.id}">رفض</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  tableBody.querySelectorAll('.accept').forEach(btn => {
    btn.addEventListener('click', () => {
      updateRequestStatus(Number(btn.dataset.id), 'accepted');
      renderOwnerRequestsTable();
      window.location.reload();
    });
  });

  tableBody.querySelectorAll('.reject').forEach(btn => {
    btn.addEventListener('click', () => {
      updateRequestStatus(Number(btn.dataset.id), 'rejected');
      renderOwnerRequestsTable();
    });
  });
}

function renderOwnerStats() {
  const totalUsersEl = document.getElementById('total-users');
  const totalConsultationsEl = document.getElementById('total-consultations');
  const pendingPaymentsEl = document.getElementById('pending-payments');

  const history = JSON.parse(localStorage.getItem('consultationHistory') || '[]');
  const uniqueUsers = new Set(history.map(h => h.user)).size;
  const pendingCount = getRequests().filter(r => r.status === 'pending').length;

  if (totalUsersEl) totalUsersEl.textContent = uniqueUsers;
  if (totalConsultationsEl) totalConsultationsEl.textContent = history.length;
  if (pendingPaymentsEl) pendingPaymentsEl.textContent = pendingCount;
}

function renderUserPaymentRequests() {
  const paymentRequestsList = document.getElementById('payment-requests-list');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  if (!paymentRequestsList || !userData.username) return;

  const requests = getRequests().filter(r => r.username === userData.username);
  if (!requests.length) {
    paymentRequestsList.innerHTML = '<p>لا توجد طلبات دفع</p>';
    return;
  }

  paymentRequestsList.innerHTML = requests.map(request => `
    <div class="payment-request-item">
      <strong>المبلغ: ${request.amount}</strong><br />
      الحالة: ${request.status}<br />
      التاريخ: ${new Date(request.createdAt).toLocaleDateString('ar')}
    </div>
  `).join('');
}

function setupRequestsPageHandler() {
  const planButton = document.getElementById('submit-plan');
  if (!planButton) return;

  planButton.addEventListener('click', () => {
    const username = document.getElementById('username-plan').value.trim();
    const amount = Number(document.getElementById('amount-plan').value);
    const plan = document.getElementById('plan-select').value;
    const screenshot = document.getElementById('screenshot-plan').files[0];

    if (!username || !amount || !screenshot) {
      alert('يرجى ملء جميع الحقول ورفع لقطة الشاشة');
      return;
    }

    const request = {
      id: Date.now(),
      username,
      plan,
      amount,
      credits: amount,
      fileName: screenshot.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addRequest(request);
    alert('تم إرسال الطلب للمالك بنجاح!');

    if (document.getElementById('payment-success')) {
      document.getElementById('payment-success').style.display = 'block';
    }

    document.getElementById('username-plan').value = '';
    document.getElementById('amount-plan').value = '';
    document.getElementById('screenshot-plan').value = '';

    renderUserPaymentRequests();
  });
}

function initRequestsModule() {
  if (window.location.pathname.endsWith('owner.html')) {
    renderOwnerRequestsTable();
    renderOwnerStats();
  }

  if (window.location.pathname.endsWith('user.html')) {
    renderUserPaymentRequests();
  }

  setupRequestsPageHandler();
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initRequestsModule);
}
