if(!window.location.pathname.endsWith('requests.html')) throw 0;

const reqAmount = document.getElementById('req-amount');
const requestBtn = document.getElementById('send-request-btn');
const requestMsg = document.getElementById('request-msg');
const tableBody = document.querySelector('#requests-table tbody');

function getUserData(){
  return JSON.parse(localStorage.getItem('userData') || 'null');
}

const currentUser = getUserData();
if (currentUser && currentUser.user && currentUser.user.role === 'admin') {
  document.getElementById('admin-link').style.display = 'inline';
}

async function apiRequest(path, options = {}) {
  const current = getUserData();
  if (!current || !current.token) {
    window.location.href = 'login.html';
    return null;
  }

  const res = await fetch(`http://localhost:3000${path}`, {
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

async function loadRequests() {
  try {
    const data = await apiRequest('/requests');
    tableBody.innerHTML = '';
    const isAdmin = getUserData()?.user?.role === 'admin';

    data.forEach((r) => {
      let actions = '';
      if (isAdmin && r.status === 'pending') {
        actions = `
          <button class="inline-btn" data-action="accept" data-id="${r.id}">قبول</button>
          <button class="inline-btn" data-action="reject" data-id="${r.id}">رفض</button>
        `;
      }

      const screenshotLink = r.screenshot ? `<a href="http://localhost:3000/${r.screenshot}" target="_blank">عرض</a>` : 'لا يوجد';

      tableBody.innerHTML += `
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
          requestMsg.innerText = `تم ${action === 'accept' ? 'القبول' : 'الرفض'} بنجاح`;
          await loadRequests();
        } catch (err) {
          requestMsg.innerText = err.message;
        }
      });
    });
  } catch (e) {
    requestMsg.innerText = e.message || 'خطأ في تحميل الطلبات';
  }
}

requestBtn.addEventListener('click', async () => {
  const amount = reqAmount.value.trim();
  if (!amount || Number(amount) <= 0) {
    requestMsg.innerText = 'أدخل مبلغًا صالحًا';
    return;
  }

  const formData = new FormData();
  formData.append('amount', amount);

  // Optional screenshot
  const screenshotInput = document.getElementById('req-screenshot');
  if (screenshotInput && screenshotInput.files[0]) {
    formData.append('screenshot', screenshotInput.files[0]);
  }

  try {
    await apiRequest('/request', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
    requestMsg.innerText = 'تم إرسال الطلب بنجاح';
    reqAmount.value = '';
    if (screenshotInput) screenshotInput.value = '';
    await loadRequests();
  } catch (err) {
    requestMsg.innerText = err.message;
  }
});

loadRequests();
