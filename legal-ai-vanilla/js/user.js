// User dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentBalance = document.getElementById('current-balance');
    const paymentRequestsList = document.getElementById('payment-requests-list');
    const consultationHistory = document.getElementById('consultation-history');

    // Load user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (currentBalance) {
        currentBalance.textContent = userData.balance || 0;
    }

    // Load payment requests
    loadPaymentRequests();

    // Load consultation history
    loadConsultationHistory();

    async function loadPaymentRequests() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const res = await fetch('/api/requests', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            const data = await res.json();
            const requests = data.requests || [];
            const userRequests = requests.filter(req => req.user_id === userData.id);

            if (!userRequests.length) {
                paymentRequestsList.innerHTML = '<p>لا توجد طلبات دفع</p>';
                return;
            }

            paymentRequestsList.innerHTML = userRequests.map(request => `
            <div class="payment-request-item">
                <div class="request-info">
                    <strong>المبلغ: ${request.amount} جنيه</strong>
                    <span>الحالة: ${getStatusText(request.status)}</span>
                    <span>التاريخ: ${new Date(request.created_at).toLocaleDateString('ar')}</span>
                </div>
                ${request.status === 'pending' ? '<div class="status-pending">قيد المراجعة</div>' : ''}
                ${request.status === 'accepted' ? '<div class="status-accepted">تم القبول</div>' : ''}
                ${request.status === 'rejected' ? '<div class="status-rejected">تم الرفض</div>' : ''}
            </div>
        `).join('');
        } catch (error) {
            paymentRequestsList.innerHTML = '<p>فشل جلب طلبات الدفع</p>';
        }
    }

    async function loadConsultationHistory() {
        try {
            const res = await fetch(`http://localhost:3000/history/${userData.username}`);
            const userHistory = await res.json();

            if (!userHistory.length) {
                consultationHistory.innerHTML = '<p>لا توجد استشارات سابقة</p>';
                return;
            }

            consultationHistory.innerHTML = userHistory.reverse().map(item => `
            <div class="consultation-item">
                <h3>${item.question}</h3>
                <p>الشخصية: ${getPersonaName(item.role)}</p>
                <p>التاريخ: ${new Date(item.createdAt).toLocaleDateString('ar')}</p>
                <details>
                    <summary>عرض الإجابة</summary>
                    <div class="response-content">${item.response.replace(/\n/g, '<br>')}</div>
                </details>
            </div>
        `).join('');
        } catch (error) {
            consultationHistory.innerHTML = '<p>فشل جلب تاريخ الاستشارات</p>';
        }
    }

        if (userRequests.length === 0) {
            paymentRequestsList.innerHTML = '<p>لا توجد طلبات دفع</p>';
            return;
        }

        paymentRequestsList.innerHTML = userRequests.map(request => `
            <div class="payment-request-item">
                <div class="request-info">
                    <strong>المبلغ: ${request.amount} جنيه</strong>
                    <span>الحالة: ${getStatusText(request.status)}</span>
                    <span>التاريخ: ${new Date(request.timestamp).toLocaleDateString('ar')}</span>
                </div>
                ${request.status === 'pending' ? '<div class="status-pending">قيد المراجعة</div>' : ''}
                ${request.status === 'accepted' ? '<div class="status-accepted">تم القبول</div>' : ''}
                ${request.status === 'rejected' ? '<div class="status-rejected">تم الرفض</div>' : ''}
            </div>
        `).join('');
    }

    function loadConsultationHistory() {
        const history = JSON.parse(localStorage.getItem('consultationHistory') || '[]');
        const userHistory = history.filter(item => item.user === userData.username);

        if (userHistory.length === 0) {
            consultationHistory.innerHTML = '<p>لا توجد استشارات سابقة</p>';
            return;
        }

        consultationHistory.innerHTML = userHistory.reverse().map(item => `
            <div class="consultation-item">
                <h3>${item.question}</h3>
                <p>الشخصية: ${getPersonaName(item.persona)}</p>
                <p>التاريخ: ${new Date(item.timestamp).toLocaleDateString('ar')}</p>
                <details>
                    <summary>عرض الإجابة</summary>
                    <div class="response-content">${item.response.replace(/\n/g, '<br>')}</div>
                </details>
            </div>
        `).join('');
    }

    function getStatusText(status) {
        switch(status) {
            case 'pending': return 'قيد المراجعة';
            case 'accepted': return 'مقبول';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    }

    function getPersonaName(persona) {
        const personas = {
            'legal-advisor': 'مستشار قانوني',
            'lawyer': 'محامي',
            'judge': 'قاضي',
            'corporate-lawyer': 'محامي شركات',
            'criminal-lawyer': 'محامي جنائي',
            'family-lawyer': 'محامي أسرة',
            'contract-specialist': 'أخصائي عقود',
            'legal-researcher': 'باحث قانوني',
            'appeal-expert': 'خبير استئناف'
        };
        return personas[persona] || persona;
    }
});