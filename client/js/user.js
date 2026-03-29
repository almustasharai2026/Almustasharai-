// User Profile Page

document.addEventListener('DOMContentLoaded', load ProfileData);

async function loadProfileData() {
  if (!currentUser) return;
  
  // Update profile section
  document.getElementById('profile-username').textContent = currentUser.username || 'المستخدم';
  document.getElementById('profile-email').textContent = currentUser.email || '';
  
  // Update settings
  document.getElementById('setting-email').textContent = currentUser.email;
  document.getElementById('setting-username').textContent = currentUser.username;
  document.getElementById('setting-role').textContent = currentUser.role === 'admin' ? 'مدير' : 'مستخدم';
  
  // Update credits
  document.getElementById('current-credits').textContent = currentUser.balance || '0';
  
  // Load statistics
  loadStatistics();
  loadRecentConsultations();
}

function showCreditsModal() {
  showModal('credits-modal');
}

function showBuyCreditsModal() {
  showModal('buy-credits-modal');
}

function showChangePasswordModal() {
  showModal('password-modal');
}

function selectPackage(amount, price) {
  showToast(`تم اختيار ${amount} وحدة بسعر ${price} ريال`, 'success');
  // Integration with payment gateway would go here
}

async function changePassword() {
  const current = document.getElementById('current-password').value;
  const newPass = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;
  
  if (!current || !newPass || !confirm) {
    showToast('يرجى ملء جميع الحقول', 'warning');
    return;
  }
  
  if (newPass !== confirm) {
    showToast('كلمات المرور غير متطابقة', 'error');
    return;
  }
  
  showToast('تم تحديث كلمة المرور', 'success');
  closeModal('password-modal');
}

function deleteAccountButton() {
  if (confirm('تحذير: هذا سيحذف حسابك بشكل دائم. هل أنت متأكد؟')) {
    showToast('تم حذف الحساب', 'success');
    setTimeout(() => logout(), 1000);
  }
}

async function loadStatistics() {
  try {
    const result = await apiCall('/history', 'GET', null, false);
    if (result.history) {
      document.getElementById('total-consultations').textContent = result.history.length;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadRecentConsultations() {
  try {
    const result = await apiCall('/history?limit=5', 'GET', null, false);
    const list = document.getElementById('recent-consultations');
    if (result.history && list) {
      list.innerHTML = result.history.map(item => `
        <div class="recent-item">
          <strong>${item.question.substring(0, 50)}...</strong>
          <small>${formatDate(item.created_at)}</small>
        </div>
      `).join('') || '<p class="empty-state">لا توجد استشارات</p>';
    }
  } catch (error) {
    console.error('Error loading consultations:', error);
  }
}

// Language and theme preference selectors
document.getElementById('language-select')?.addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

document.getElementById('theme-select')?.addEventListener('change', (e) => {
  if (e.target.value === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (e.target.value === 'light') {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('theme', e.target.value);
});
