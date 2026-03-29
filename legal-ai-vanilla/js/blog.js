// Blog and Articles Management
document.addEventListener('DOMContentLoaded', function() {
    const writeSection = document.getElementById('write-section');
    const newArticleBtn = document.getElementById('new-article-btn');
    const cancelWriteBtn = document.getElementById('cancel-write');
    const articleForm = document.getElementById('article-form');
    const articlesListElement = document.getElementById('articles-list');
    const searchInput = document.getElementById('blog-search');
    const categorySelect = document.getElementById('blog-category');

    // Default articles
    const defaultArticles = [
        {
            id: 1,
            title: 'حقوقك كموظف في السعودية',
            category: 'عمل',
            author: 'د. أحمد القاضي',
            date: '2026-03-20',
            content: 'شرح مفصل لحقوق الموظف في السعودية وفقاً لنظام العمل المعدل...',
            tags: ['عمل', 'حقوق', 'قوانين']
        },
        {
            id: 2,
            title: 'أنواع العقود التجارية',
            category: 'تجارة',
            author: 'أ. فاطمة الغامدي',
            date: '2026-03-18',
            content: 'دليل شامل لأنواع العقود التجارية والفرق بينها...',
            tags: ['عقود', 'تجارة', 'قانون تجاري']
        },
        {
            id: 3,
            title: 'شراء عقار: خطوات آمنة',
            category: 'عقارات',
            author: 'م. محمد السعيد',
            date: '2026-03-15',
            content: 'إرشادات عملية وقانونية عند شراء عقار جديد...',
            tags: ['عقارات', 'شراء', 'توثيق']
        },
        {
            id: 4,
            title: 'تأسيس شركة ذات مسؤولية محدودة',
            category: 'شركات',
            author: 'د. علي الرشيد',
            date: '2026-03-12',
            content: 'خطوات تأسيس شركة محدودة وتسجيلها قانونياً...',
            tags: ['شركات', 'تأسيس', 'إجراءات']
        }
    ];

    // Load articles from localStorage or use defaults
    let articles = JSON.parse(localStorage.getItem('articles')) || defaultArticles;

    // Check user role
    const userRole = localStorage.getItem('userRole') || 'guest';
    if (userRole === 'admin' || userRole === 'lawyer') {
        newArticleBtn.style.display = 'block';
    }

    // Show write section
    newArticleBtn.addEventListener('click', function() {
        writeSection.style.display = 'block';
        newArticleBtn.style.display = 'none';
    });

    // Cancel write
    cancelWriteBtn.addEventListener('click', function() {
        writeSection.style.display = 'none';
        newArticleBtn.style.display = 'block';
        articleForm.reset();
    });

    // Submit article
    articleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newArticle = {
            id: articles.length + 1,
            title: document.getElementById('article-title').value,
            category: document.getElementById('article-category').value,
            author: localStorage.getItem('userName') || 'مستخدم مجهول',
            date: new Date().toISOString().split('T')[0],
            content: document.getElementById('article-content').value,
            tags: document.getElementById('article-tags').value.split(',').map(t => t.trim())
        };

        articles.unshift(newArticle);
        localStorage.setItem('articles', JSON.stringify(articles));

        // Reset form
        articleForm.reset();
        writeSection.style.display = 'none';
        newArticleBtn.style.display = 'block';

        // Refresh display
        filterArticles();
        alert('تم نشر المقالة بنجاح!');
    });

    // Render articles
    function renderArticles(articlesToRender) {
        if (articlesToRender.length === 0) {
            articlesListElement.innerHTML = '<p class="no-articles">لا توجد مقالات حالياً</p>';
            return;
        }

        articlesListElement.innerHTML = articlesToRender.map(article => `
            <article class="article-card">
                <div class="article-header">
                    <h2 class="article-title">${article.title}</h2>
                    <span class="article-category">${article.category}</span>
                </div>
                <div class="article-meta">
                    <span class="article-author">بقلم: ${article.author}</span>
                    <span class="article-date">${new Date(article.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <p class="article-content">${article.content}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="article-actions">
                    <button class="btn-read-more" data-article-id="${article.id}">اقرأ المزيد</button>
                    ${userRole === 'admin' ? `<button class="btn-delete-article" data-article-id="${article.id}">حذف</button>` : ''}
                </div>
            </article>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.btn-read-more').forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = this.dataset.articleId;
                const article = articles.find(a => a.id == articleId);
                if (article) {
                    showFullArticle(article);
                }
            });
        });

        document.querySelectorAll('.btn-delete-article').forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = this.dataset.articleId;
                if (confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
                    articles = articles.filter(a => a.id != articleId);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    filterArticles();
                }
            });
        });
    }

    // Filter articles
    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryTerm = categorySelect.value;

        const filtered = articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                                article.content.toLowerCase().includes(searchTerm) ||
                                article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesCategory = !categoryTerm || article.category === categoryTerm;
            return matchesSearch && matchesCategory;
        });

        renderArticles(filtered);
    }

    // Show full article
    function showFullArticle(article) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h1>${article.title}</h1>
                <div class="article-modal-meta">
                    <span>${article.author}</span>
                    <span>${new Date(article.date).toLocaleDateString('ar-SA')}</span>
                    <span>${article.category}</span>
                </div>
                <div class="article-full-content">
                    ${article.content}
                </div>
                <div class="article-full-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" id="share-article">مشاركة</button>
                    <button class="btn-secondary" id="print-article">طباعة</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal
        document.querySelector('.modal-close').addEventListener('click', function() {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });

        // Share article
        document.getElementById('share-article').addEventListener('click', function() {
            const text = `${article.title} - المستشار AI`;
            if (navigator.share) {
                navigator.share({ title: 'المستشار AI', text: text });
            } else {
                alert('لا يدعم المتصفح المشاركة');
            }
        });

        // Print article
        document.getElementById('print-article').addEventListener('click', function() {
            window.print();
        });
    }

    // Event listeners
    searchInput.addEventListener('input', filterArticles);
    categorySelect.addEventListener('change', filterArticles);

    // Initial render
    renderArticles(articles);
});
