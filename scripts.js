function toggleMenu() {
            const nav = document.querySelector('.nav-links');
            const toggle = document.querySelector('.menu-toggle');
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        }
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = '#1a1a1a';
                navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = '#0d0d0d';
                navbar.style.boxShadow = 'none';
            }
        });
