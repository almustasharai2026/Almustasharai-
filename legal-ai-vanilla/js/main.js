// Main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Load saved preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark');
            darkModeToggle.textContent = 'الوضع الفاتح';
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.textContent = isDark ? 'الوضع الفاتح' : 'الوضع المظلم';
        });
    }

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    const defaultRTL = localStorage.getItem('isRTL') !== 'false';
    const currentRTL = defaultRTL ? 'rtl' : 'ltr';

    function applyLanguage(isRTL) {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = isRTL ? 'ar' : 'en';

        const file = isRTL ? '/lang/ar.json' : '/lang/en.json';
        fetch(file)
            .then(res => res.json())
            .then(data => {
                document.title = data.appTitle || document.title;
                const heading = document.querySelector('h1');
                if (heading) heading.textContent = data.askAdvisor || heading.textContent;
            });

        if (langToggle) {
            langToggle.textContent = isRTL ? 'English' : 'العربية';
        }
    }

    if (langToggle) {
        applyLanguage(defaultRTL);

        langToggle.addEventListener('click', function() {
            const currentRTL = document.documentElement.dir === 'rtl';
            const nextRTL = !currentRTL;
            applyLanguage(nextRTL);
            localStorage.setItem('isRTL', nextRTL);
        });
    }
});
});