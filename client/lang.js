// Language Management System
const translations = {};
let currentLanguage = localStorage.getItem('language') || 'ar';

// Load translation files
async function loadLanguage(lang = 'ar') {
  try {
    const response = await fetch(`lang/${lang}.json`);
    const data = await response.json();
    Object.assign(translations, data);
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update document direction
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    updatePageTexts();
  } catch (error) {
    console.error('Error loading language:', error);
  }
}

// Get translated text
function t(key, defaultValue = key) {
  return translations[key] || defaultValue;
}

// Update all page texts
function updatePageTexts() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLanguage);
  
  // Setup language toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
      loadLanguage(newLang);
      langToggle.textContent = newLang === 'ar' ? '🌐 EN' : '🌐 AR';
    });
    langToggle.textContent = currentLanguage === 'ar' ? '🌐 EN' : '🌐 AR';
  }
});
