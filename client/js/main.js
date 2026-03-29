// Core Application Functionality

// Dark Mode Management
function initializeDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = isDarkMode !== null ? isDarkMode : systemPrefersDark;
  
  if (shouldBeDark) {
    document.body.classList.add('dark-mode');
  }
  
  // Setup theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  }
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  container.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => toast.remove(), duration);
  }
  
  return toast;
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Loading Indicator
function showLoading(show = true) {
  const indicator = document.getElementById('loading-indicator');
  if (indicator) {
    indicator.style.display = show ? 'flex' : 'none';
  }
}

// Modal Management
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Tab Switching
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn, [data-tab]');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      if (!tabName) return;
      
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Remove active from all buttons
      const allBtns = document.querySelectorAll('.tab-btn[data-tab]');
      allBtns.forEach(b => b.classList.remove('active'));
      
      // Show selected tab and mark button as active
      const tabContent = document.getElementById(tabName + '-tab');
      if (tabContent) {
        tabContent.classList.add('active');
      }
      this.classList.add('active');
    });
  });
}

// API Helper
async function apiCall(endpoint, method = 'GET', data = null, showLoading = true) {
  try {
    if (showLoading) showLoading(true);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch('/api' + endpoint, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }
    
    return result;
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message, 'error');
    throw error;
  } finally {
    if (showLoading) showLoading(false);
  }
}

// File Upload Helper
async function uploadFile(endpoint, file, additionalData = {}) {
  try {
    showLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional fields
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    const response = await fetch('/api' + endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Upload Error');
    }
    
    return result;
  } catch (error) {
    console.error('Upload Error:', error);
    showToast(error.message, 'error');
    throw error;
  } finally {
    showLoading(false);
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `${days} أيام`;
  if (days < 30) return `${Math.floor(days / 7)} أسابيع`;
  if (days < 365) return `${Math.floor(days  / 30)} أشهر`;
  return date.toLocaleDateString('ar-SA');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  setupTabs();
});
