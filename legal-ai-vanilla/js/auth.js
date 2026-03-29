// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'خطأ في تسجيل الدخول');
                }

                const data = await res.json();
                const userData = {
                    role: data.user.role,
                    username: data.user.username,
                    balance: data.user.balance,
                    email,
                    token: data.token
                };

                localStorage.setItem('userData', JSON.stringify(userData));

                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Check authentication on page load
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (!userData && window.location.pathname !== '/login.html') {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
});