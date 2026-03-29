// Payment functionality
document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.select-plan');
    const paymentForm = document.getElementById('payment-form');
    const paymentSubmitForm = document.getElementById('payment-submit-form');
    const selectedAmount = document.getElementById('selected-amount');
    const paymentSuccess = document.getElementById('payment-success');

    // Select plan
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const amount = planCard.dataset.amount;
            selectedAmount.textContent = amount;
            paymentForm.style.display = 'block';
            paymentSuccess.style.display = 'none';
        });
    });

    // Submit payment
    paymentSubmitForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const amount = selectedAmount.textContent;
        const screenshot = document.getElementById('screenshot').files[0];

        if (!username || !screenshot) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
            const screenshotData = e.target.result;

            try {
                const res = await fetch('http://localhost:3000/request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username,
                        amount: Number(amount),
                        screenshot: screenshotData
                    })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'فشل إرسال الطلب');
                }

                const data = await res.json();
                console.log('Request saved:', data);

                paymentForm.style.display = 'none';
                paymentSuccess.style.display = 'block';

                // Reset form
                paymentSubmitForm.reset();

                // Refresh owner/user pages via requests.js view
                if (window.location.pathname.endsWith('user.html') || window.location.pathname.endsWith('owner.html')) {
                    window.location.reload();
                }
            } catch (error) {
                alert(error.message);
            }
        };
        reader.readAsDataURL(screenshot);
    });
});