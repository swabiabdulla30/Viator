/**
 * VIATOR – Effects Module
 * Lightweight 3D Tilt and Motion Effects
 */

const Effects = {
    init() {
        this.initParallax();
        this.initCursorFollower();
        this.initTilt();
        this.initScrollReveal();
        this.initHeroSlider();
        this.initMobileNav();
        this.initStickyNav();
    },

    /**
     * Mobile Menu Toggle Logic
     */
    initMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!hamburger || !mobileNav) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    },

    /**
     * Sticky Navbar Effect
     */
    initStickyNav() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    },

    /**
     * Dynamic Hero Background Slider
     * Rotates images every 3s and syncs titles.
     */
    initHeroSlider() {
        const hero = document.querySelector('.hero-editorial');
        const titleEl = document.querySelector('.featured-title');
        if (!hero || !titleEl) return;

        const slides = [
            { img: 'assets/p3.png', title: 'Kyoto, Japan' },
            { img: 'assets/p1.png', title: 'Machu Picchu, Peru' },
            { img: 'assets/p2.png', title: 'Hanoi, Vietnam' },
            { img: 'assets/p4.png', title: 'Serengeti, Tanzania' },
            { img: 'assets/p5.png', title: 'Santorini, Greece' },
            { img: 'assets/p6.png', title: 'Amalfi Coast, Italy' }
        ];

        let index = 0;

        setInterval(() => {
            index = (index + 1) % slides.length;
            const slide = slides[index];
            
            // Apply fade-out style effect via transition
            hero.style.backgroundImage = `url('${slide.img}')`;
            
            // Sync Title with a small delay for the fade
            titleEl.style.opacity = '0';
            setTimeout(() => {
                titleEl.textContent = slide.title;
                titleEl.style.opacity = '1';
            }, 400);
        }, 3000);
    },

    /**
     * Cursor Glow/Spotlight effect
     */
    initCursorFollower() {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        window.addEventListener('mousemove', e => {
            requestAnimationFrame(() => {
                glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        });
    },

    /**
     * Minimal Parallax (can be added back if needed for editorial style headers)
     */
    initParallax() {
        // Removed heavy Vanta/WebGL for editorial redesign.
        // We can add subtle background shifts here if needed.
    },


    /**
     * Subtle 3D Tilt effect for cards
     */
    initTilt() {
        const cards = document.querySelectorAll('.exp-card, .feature-card, .auth-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Fine-tuned tilt intensity (low values for subtlety)
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    },

    /**
     * Soft reveal animation on scroll
     */
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section-title, .exp-card, .feature-card').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Effects.init());
