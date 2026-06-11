document.addEventListener('DOMContentLoaded', () => {
    // Обновление года в футере
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- ЛОГИКА ГЕНЕРАТОРА (index.html) ---
    const output = document.getElementById('password-output');
    const lengthRange = document.getElementById('length-range');
    const lengthVal = document.getElementById('length-val');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (lengthRange && output) {
        lengthRange.addEventListener('input', () => lengthVal.textContent = lengthRange.value);

        generateBtn.addEventListener('click', () => {
            const len = parseInt(lengthRange.value);
            let chars = '';
            if (document.getElementById('chk-upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (document.getElementById('chk-lower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (document.getElementById('chk-numbers').checked) chars += '0123456789';
            if (document.getElementById('chk-symbols').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (chars === '') { alert('Выберите хотя бы один тип символов'); return; }

            if (document.getElementById('chk-ambiguous').checked) {
                chars = chars.replace(/[0Ol1I]/g, '');
            }

            // ПР: Использование криптографического API
            const array = new Uint32Array(len);
            crypto.getRandomValues(array);
            let pass = '';
            for (let i = 0; i < len; i++) {
                pass += chars[array[i] % chars.length];
            }
            output.value = pass;
            updateStrength(pass);
        });

        copyBtn.addEventListener('click', () => {
            if (output.value) {
                navigator.clipboard.writeText(output.value);
                copyBtn.textContent = '✅';
                setTimeout(() => copyBtn.textContent = '📋', 1500);
            }
        });

        function updateStrength(pass) {
            let score = 0;
            if (pass.length >= 8) score++;
            if (pass.length >= 12) score++;
            if (/[A-Z]/.test(pass)) score++;
            if (/[a-z]/.test(pass)) score++;
            if (/[0-9]/.test(pass)) score++;
            if (/[^A-Za-z0-9]/.test(pass)) score++;

            let pct = Math.min(100, (score / 6) * 100);
            strengthBar.style.width = pct + '%';
            strengthBar.style.background = pct < 40 ? '#e74c3c' : pct < 70 ? '#f39c12' : '#27ae60';
            strengthText.textContent = `Надёжность: ${pct < 40 ? 'Низкая' : pct < 70 ? 'Средняя' : 'Высокая'}`;
        }
    }

    // --- ЛОГИКА ГАЛЕРЕИ (gallery.html) ---
    const imgCountEl = document.getElementById('img-count');
    const totalLikesEl = document.getElementById('total-likes');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    if (imgCountEl) {
        imgCountEl.textContent = cards.length;
        let totalLikes = 0;

        // ПР3: Лайки и счётчик
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const countSpan = this.querySelector('.count');
                let current = parseInt(countSpan.textContent);
                if (this.classList.contains('active')) {
                    current--; totalLikes--;
                    this.classList.remove('active');
                } else {
                    current++; totalLikes++;
                    this.classList.add('active');
                }
                countSpan.textContent = current;
                totalLikesEl.textContent = totalLikes;
            });
        });

        // ПР3: Фильтрация
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                cards.forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
                });
            });
        });
    }

    // --- ЛОГИКА ФОРМЫ (contacts.html) ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            alert('Форма успешно отправлена! (демонстрация)');
            form.reset();
        });
    }
});