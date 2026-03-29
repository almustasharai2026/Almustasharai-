// Authentication Management

let currentUser = null;
const mockUsersKey = 'mockUsers';
const resetCodeKey = 'authResetCode';
const phoneCodeKey = 'phoneVerificationCode';

const defaultAdmin = {
  id: 1,
  email: 'owner@law.com',
  password: 'owner',
  username: 'قائد النظام',
  role: 'admin',
  phone: '+966500000000',
  balance: 999999,
  avatar: ''
};

// Utility / mock DB
function getMockUsers() {
  const raw = localStorage.getItem(mockUsersKey);
  let users = [];
  try { users = raw ? JSON.parse(raw) : []; } catch (e) { users = []; }
  if (!Array.isArray(users)) users = [];
  if (users.length === 0) {
    users = [defaultAdmin, { id: 2, email: 'user@law.com', password: 'user', username: 'مستخدم جديد', role: 'user', phone: '+966500000001', balance: 10, avatar: '' }];
    localStorage.setItem(mockUsersKey, JSON.stringify(users));
  }
  return users;
}

function setMockUsers(users) {
  localStorage.setItem(mockUsersKey, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getMockUsers().find(u => u.email.toLowerCase() === (email || '').toLowerCase());
}

function findUserByPhone(phone) {
  return getMockUsers().find(u => u.phone === phone);
}

function saveSession(user) {
  localStorage.setItem('token', `mock-token-${Date.now()}`);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('lastLogin', new Date().toISOString());
  currentUser = user;
}

function redirectByRole(user) {
  if (user.role === 'admin' || user.role === 'owner') {
    window.location.href = 'owner.html';
  } else {
    window.location.href = 'user.html';
  }
}

function setMessage(element, text, type = 'success') {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
  element.classList.remove('hidden');
}

function clearMessage(element) {
  if (!element) return;
  element.textContent = '';
  element.className = 'message hidden';
}

function isEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isPhone(value) {
  return /^\+?\d{7,15}$/.test(value);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setupAuthPages();
  checkAuth();
  setupLogout();
  checkAdminAccess();
  setupThemeToggle();
  setupLanguage();
});

function setupAuthPages() {
  if (window.location.pathname.includes('login.html')) {
    initLoginPage();
  }
  if (window.location.pathname.includes('register.html')) {
    initRegisterPage();
  }
}

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  const publicPages = ['login.html', 'register.html'];
  const isPublicPage = publicPages.some(path => window.location.pathname.includes(path));

  if (token && user) {
    currentUser = JSON.parse(user);
    updateUserUI();
    if (isPublicPage) {
      redirectByRole(currentUser);
      return;
    }
  } else if (!isPublicPage) {
    window.location.href = 'login.html';
  }
}

function updateUserUI() {
  if (!currentUser) return;
  const usernameEls = document.querySelectorAll('.user-name');
  const balanceEls = document.querySelectorAll('.user-balance');
  usernameEls.forEach(el => (el.textContent = currentUser.username || currentUser.email));
  balanceEls.forEach(el => (el.textContent = currentUser.balance || 0));
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', () => {
    if (confirm(t('logout_confirm', 'هل أنت متأكد؟'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      currentUser = null;
      window.location.href = 'login.html';
    }
  });
}

function checkAdminAccess() {
  const isAdminPage = window.location.pathname.includes('owner.html');
  if (isAdminPage && currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
    showToast(t('no_access', 'ليس لديك صلاحية الوصول'), 'error');
    setTimeout(() => (window.location.href = 'index.html'), 1200);
  }
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', current);
    btn.textContent = current === 'dark' ? '☀️' : '🌙';
  });
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    btn.textContent = '🌙';
  }
}

function setupLanguage() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;
  langToggle.addEventListener('click', () => {
    const current = localStorage.getItem('language') || 'ar';
    const next = current === 'ar' ? 'en' : 'ar';
    loadLanguage(next);
    langToggle.textContent = next === 'ar' ? '🌐 EN' : '🌐 AR';
  });
  const currentLang = localStorage.getItem('language') || 'ar';
  langToggle.textContent = currentLang === 'ar' ? '🌐 EN' : '🌐 AR';
}

// Main actions
function initLoginPage() {
  const methodEmail = document.getElementById('method-email');
  const methodPhone = document.getElementById('method-phone');
  const emailFields = document.getElementById('email-fields');
  const phoneFields = document.getElementById('phone-fields');
  const forgotLink = document.getElementById('forgot-link');

  methodEmail.addEventListener('click', () => {
    methodEmail.classList.add('active');
    methodPhone.classList.remove('active');
    emailFields.classList.remove('hidden');
    phoneFields.classList.add('hidden');
  });

  methodPhone.addEventListener('click', () => {
    methodPhone.classList.add('active');
    methodEmail.classList.remove('active');
    phoneFields.classList.remove('hidden');
    emailFields.classList.add('hidden');
  });

  document.getElementById('send-code-btn').addEventListener('click', () => {
    const phone = document.getElementById('login-phone').value.trim();
    if (!isPhone(phone)) return setMessage(document.getElementById('login-message'), t('enter_valid_phone', 'أدخل رقم هاتف صالح'), 'error');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem(phoneCodeKey, code);
    sessionStorage.setItem('phoneToAuthenticate', phone);
    setMessage(document.getElementById('login-message'), t('verification_code_sent', 'تم إرسال رمز التحقق') + `: ${code}`, 'success');
  });

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneActive = !emailFields.classList.contains('hidden');

    if (phoneActive) {
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!isEmail(email) || !password) {
        return setMessage(document.getElementById('login-message'), t('fill_valid_email_password', 'الرجاء إدخال بريد إلكتروني وكلمة مرور صالحين'), 'error');
      }

      const user = findUserByEmail(email);
      if (!user || user.password !== password) {
        return setMessage(document.getElementById('login-message'), t('invalid_credentials', 'البريد أو كلمة المرور غير صحيحة'), 'error');
      }

      saveSession(user);
      setMessage(document.getElementById('login-message'), t('login_success', 'تم تسجيل الدخول بنجاح'), 'success');
      setTimeout(() => redirectByRole(user), 900);
    } else {
      const phone = document.getElementById('login-phone').value.trim();
      const code = document.getElementById('login-code').value.trim();
      const savedCode = sessionStorage.getItem(phoneCodeKey);
      if (!isPhone(phone) || !code) {
        return setMessage(document.getElementById('login-message'), t('fill_phone_code', 'الرجاء إدخال رقم الهاتف ورمز التحقق'), 'error');
      }
      if (code !== savedCode) {
        return setMessage(document.getElementById('login-message'), t('incorrect_code', 'رمز التحقق غير صحيح'), 'error');
      }
      let user = findUserByPhone(phone);
      if (!user) {
        user = { id: Date.now(), email: '', username: phone, phone, password: '', role: 'user', balance: 10, avatar: '' };
        const users = getMockUsers();
        users.push(user); setMockUsers(users);
      }
      saveSession(user);
      setMessage(document.getElementById('login-message'), t('phone_login_success', 'تم الدخول بنجاح عبر الهاتف'), 'success');
      setTimeout(() => redirectByRole(user), 900);
    }
  });

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-forgot').classList.remove('hidden');
  });

  ['oauth-google', 'oauth-facebook', 'oauth-yahoo'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.preventDefault(); socialLogin(id.replace('oauth-', ''));
    });
  });
}

function initRegisterPage() {
  const form = document.getElementById('register-form');
  const fileInput = document.getElementById('register-avatar');
  const preview = document.getElementById('avatar-preview');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const avatar = preview.src || '';

    if (!isEmail(email)) {
      return setMessage(document.getElementById('register-message'), t('enter_valid_email', 'أدخل بريدًا إلكترونيًا صالحًا'), 'error');
    }
    if (!isPhone(phone)) {
      return setMessage(document.getElementById('register-message'), t('enter_valid_phone', 'أدخل رقم هاتف صالحًا'), 'error');
    }
    if (!password || password.length < 6) {
      return setMessage(document.getElementById('register-message'), t('password_short', 'كلمة المرور قصيرة جداً'), 'error');
    }
    if (password !== confirmPassword) {
      return setMessage(document.getElementById('register-message'), t('passwords_not_match', 'كلمتا المرور غير متطابقتين'), 'error');
    }

    const existEmail = findUserByEmail(email);
    if (existEmail) {
      return setMessage(document.getElementById('register-message'), t('email_exists', 'البريد الإلكتروني مسجل بالفعل'), 'error');
    }
    const existPhone = findUserByPhone(phone);
    if (existPhone) {
      return setMessage(document.getElementById('register-message'), t('phone_exists', 'رقم الهاتف مسجل بالفعل'), 'error');
    }

    const users = getMockUsers();
    const newUser = {
      id: Date.now(),
      email,
      username: email.split('@')[0],
      password,
      phone,
      role: 'user',
      balance: 10,
      avatar
    };
    users.push(newUser);
    setMockUsers(users);

    setMessage(document.getElementById('register-message'), t('register_success', 'تم إنشاء حسابك بنجاح'), 'success');
    saveSession(newUser);

    setTimeout(() => redirectByRole(newUser), 900);
  });

  ['oauth-google', 'oauth-facebook', 'oauth-yahoo'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.preventDefault(); socialLogin(id.replace('oauth-', ''));
    });
  });

  document.getElementById('forgot-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'login.html';
  });
}

function socialLogin(provider) {
  const providerEmail = `${provider}@example.com`;
  let user = findUserByEmail(providerEmail);

  if (!user) {
    const users = getMockUsers();
    user = {
      id: Date.now(),
      email: providerEmail,
      username: provider,
      password: provider + '123',
      phone: '',
      role: 'user',
      balance: 10,
      avatar: ''
    };
    users.push(user);
    setMockUsers(users);
  }

  saveSession(user);
  showToast(t('oauth_login_success', 'تم تسجيل الدخول عبر الخدمة بنجاح'), 'success');
  setTimeout(() => redirectByRole(user), 800);
}

// Forgot password flow
if (window.location.pathname.includes('login.html')) {
  const forgotForm = document.getElementById('forgot-form');
  if (!forgotForm) return;

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = document.getElementById('forgot-identifier').value.trim();
    const statusEl = document.getElementById('forgot-status');
    if (!identifier) {
      setMessage(statusEl, t('provide_email_phone', 'أدخل البريد الإلكتروني أو الهاتف'), 'error');
      return;
    }

    let user = null;
    if (isEmail(identifier)) user = findUserByEmail(identifier);
    if (isPhone(identifier)) user = findUserByPhone(identifier);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem(resetCodeKey, code);
    localStorage.setItem('resetIdentifier', identifier);

    setMessage(statusEl, t('reset_link_sent', 'تم إرسال رابط إعادة التعيين') + ` (${identifier}) ${t('use_code', 'رمز التحقق')} ${code}`, 'success');
    document.getElementById('forgot-verify').classList.remove('hidden');
  });

  const verifyForm = document.getElementById('verify-form');
  verifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = document.getElementById('verify-code').value.trim();
    const stored = localStorage.getItem(resetCodeKey);
    const statusEl = document.getElementById('forgot-status');

    if (entered !== stored) {
      setMessage(statusEl, t('incorrect_code', 'رمز التحقق غير صحيح'), 'error');
      return;
    }
    setMessage(statusEl, t('code_verified', 'تم التحقق من الرمز'), 'success');
    document.getElementById('reset-password-form').classList.remove('hidden');
  });

  const resetForm = document.getElementById('reset-password-form');
  resetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('new-password').value.trim();
    const confirmPass = document.getElementById('confirm-password').value.trim();
    const statusEl = document.getElementById('reset-status');
    if (newPass.length < 6) {
      return setMessage(statusEl, t('password_short', 'كلمة المرور قصيرة جداً'), 'error');
    }
    if (newPass !== confirmPass) {
      return setMessage(statusEl, t('passwords_not_match', 'كلمتا المرور غير متطابقتين'), 'error');
    }

    const identifier = localStorage.getItem('resetIdentifier');
    const users = getMockUsers();
    let userIndex = -1;
    userIndex = users.findIndex(u => u.email === identifier || u.phone === identifier);

    if (userIndex >= 0) {
      users[userIndex].password = newPass;
      setMockUsers(users);
      setMessage(statusEl, t('password_reset_success', 'تم تحديث كلمة المرور بنجاح'), 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    } else {
      setMessage(statusEl, t('user_not_found', 'المستخدم غير موجود'), 'error');
    }
  });
}

// Existing toast helper from main.js exists



