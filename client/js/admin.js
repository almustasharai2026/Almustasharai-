if(!window.location.pathname.endsWith('admin.html')) throw 0;

const usersTableBody = document.querySelector('#users-table tbody');
const requestsTableBody = document.querySelector('#requests-table tbody');
const adminMsg = document.getElementById('admin-msg');
const statusFilter = document.getElementById('status-filter');

function getUserData(){
  return JSON.parse(localStorage.getItem('userData') || 'null');
}

async function apiRequest(path, options = {}) {
  const current = getUserData();
  if (!current || !current.token) {
    window.location.href = 'login.html';
    return null;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${current.token}`,
      ...(options.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'خطأ في الشبكة');
  return data;
}

async function loadStats() {
  try {
    const stats = await apiRequest('/admin/stats');
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-revenue').textContent = stats.totalRevenue;
    document.getElementById('pending-requests').textContent = stats.pendingRequests;
    document.getElementById('accepted-requests').textContent = stats.acceptedRequests;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadUsers() {
  try {
    const users = await apiRequest('/admin/users');
    usersTableBody.innerHTML = '';
    users.forEach(user => {
      usersTableBody.innerHTML += `
        <tr>
          <td>${user.id}</td>
          <td>${user.email}</td>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>${user.balance}</td>
        </tr>
      `;
    });
  } catch (error) {
    adminMsg.innerText = 'خطأ في تحميل المستخدمين: ' + error.message;
  }
}

async function loadRequests(status = '') {
  try {
    const requests = await apiRequest(`/requests?status=${status}`);
    requestsTableBody.innerHTML = '';
    requests.forEach((r) => {
      const screenshotLink = r.screenshot ? `<a href="http://localhost:3000/${r.screenshot}" target="_blank">عرض</a>` : 'لا يوجد';

      const actions = r.status === 'pending' ? `
        <button class="inline-btn" data-action="accept" data-id="${r.id}">قبول</button>
        <button class="inline-btn" data-action="reject" data-id="${r.id}">رفض</button>
      ` : '';

      requestsTableBody.innerHTML += `
        <tr>
          <td>${r.username}</td>
          <td>${r.amount}</td>
          <td>${r.status}</td>
          <td>${screenshotLink}</td>
          <td>${actions}</td>
        </tr>
      `;
    });

    document.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;
        try {
          await apiRequest(`/${action}/${id}`, { method: 'POST' });
          adminMsg.innerText = `تم ${action === 'accept' ? 'القبول' : 'الرفض'} بنجاح`;
          await loadRequests(status);
          await loadStats();
        } catch (err) {
          adminMsg.innerText = err.message;
        }
      });
    });
  } catch (error) {
    adminMsg.innerText = 'خطأ في تحميل الطلبات: ' + error.message;
  }
}

statusFilter.addEventListener('change', () => {
  loadRequests(statusFilter.value);
});

// Initial load
loadStats();
loadUsers();
loadRequests();