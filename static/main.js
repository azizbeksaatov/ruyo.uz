// Language toggle
document.addEventListener('DOMContentLoaded', function() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.lang === 'uz') {
                document.body.classList.add('uz-active');
            } else {
                document.body.classList.remove('uz-active');
            }
        });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const q = this.value.trim();
                if (q) window.location.href = '/search/?q=' + encodeURIComponent(q);
            }
        });
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const q = searchInput.value.trim();
                if (q) window.location.href = '/search/?q=' + encodeURIComponent(q);
            });
        }
    }
});
