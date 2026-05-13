// Digital Solutions Consulting - Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // === MOBILE MENU TOGGLE ===
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');

            // Animate hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');

                // Reset hamburger icon
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // === SMOOTH SCROLLING FOR ANCHOR LINKS ===
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === ACTIVE NAVIGATION LINK ON SCROLL ===
    const sections = document.querySelectorAll('section[id]');

    function activateNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', activateNavOnScroll);

    // === FORM VALIDATION AND SUBMISSION ===
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Basic validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const service = document.getElementById('service');
            const message = document.getElementById('message');

            let isValid = true;

            // Validate name
            if (name && name.value.trim() === '') {
                showError(name, 'Please enter your name');
                isValid = false;
            }

            // Validate email
            if (email && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate service selection
            if (service && service.value === '') {
                showError(service, 'Please select a service');
                isValid = false;
            }

            // Validate message
            if (message && message.value.trim() === '') {
                showError(message, 'Please describe your project');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                // If using Netlify Forms, the form will submit automatically
                // Show success message (optional)
                console.log('Form is valid and ready to submit');
            }
        });

        // Remove error styling on input
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary-red)';
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });

            input.addEventListener('blur', function() {
                const hasError = this.parentElement.querySelector('.error-message');
                if (!hasError) {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        });
    }

    // === HELPER FUNCTIONS ===

    function showError(input, message) {
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling
        input.style.borderColor = 'var(--primary-red)';

        // Create and insert error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--primary-red)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';

        input.parentElement.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // === INTERSECTION OBSERVER FOR ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll('.service-card, .framework-step, .value-card, .case-study, .faq-item');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // === WORD FADE + TYPEWRITER (Hero) ===
    (function initHeroAnimations() {
        const heroTitle    = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroTitle) return;

        heroTitle.classList.add('words-ready');
        let wordCount = 0;

        function wrapWords(container, isSpan) {
            const words = container.textContent.trim().split(/\s+/).filter(Boolean);
            if (!isSpan) {
                // Replace text node
                const frag = document.createDocumentFragment();
                words.forEach((word, i) => {
                    if (i > 0) frag.appendChild(document.createTextNode(' '));
                    const s = document.createElement('span');
                    s.className = 'word';
                    s.style.setProperty('--i', wordCount++);
                    s.textContent = word;
                    frag.appendChild(s);
                });
                frag.appendChild(document.createTextNode(' '));
                container.replaceWith(frag);
            } else {
                container.innerHTML = '';
                words.forEach((word, i) => {
                    if (i > 0) container.appendChild(document.createTextNode(' '));
                    const s = document.createElement('span');
                    s.className = 'word';
                    s.style.setProperty('--i', wordCount++);
                    s.textContent = word;
                    container.appendChild(s);
                });
            }
        }

        Array.from(heroTitle.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                wrapWords(node, false);
            } else if (node.nodeName === 'SPAN' && node.classList.contains('gradient-text')) {
                wrapWords(node, true);
            }
        });

        // Typewriter on subtitle
        if (heroSubtitle) {
            const text = heroSubtitle.textContent.trim();
            heroSubtitle.style.animation = 'none';
            heroSubtitle.style.opacity   = '1';
            heroSubtitle.innerHTML = '<span class="tw-cursor"></span>';
            const cursor    = heroSubtitle.querySelector('.tw-cursor');
            const startAt   = (wordCount - 1) * 110 + 80 + 700;
            let charI = 0;
            setTimeout(() => {
                const id = setInterval(() => {
                    if (charI < text.length) {
                        heroSubtitle.insertBefore(document.createTextNode(text[charI++]), cursor);
                    } else {
                        clearInterval(id);
                        setTimeout(() => cursor.remove(), 2800);
                    }
                }, 55);
            }, startAt);
        }
    })();

    // === HERO CURSOR SPOTLIGHT ===
    (function initSpotlight() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const spot = document.createElement('div');
        spot.className = 'hero-spotlight';
        hero.appendChild(spot);
        hero.addEventListener('mouseenter', () => { spot.style.opacity = '1'; });
        hero.addEventListener('mouseleave', () => { spot.style.opacity = '0'; });
        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            spot.style.left = (e.clientX - r.left) + 'px';
            spot.style.top  = (e.clientY - r.top)  + 'px';
        });
    })();

    // === STAT COUNTERS ===
    (function initCounters() {
        const els = document.querySelectorAll('.stat-number');
        if (!els.length) return;
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                const el  = entry.target;
                const raw = el.textContent.trim();
                const num = parseInt(raw.replace(/\D/g, ''), 10);
                const sfx = raw.replace(/\d/g, '');
                if (isNaN(num)) return;
                const dur = 1500;
                const t0  = performance.now();
                (function tick(now) {
                    const p = Math.min((now - t0) / dur, 1);
                    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * num) + sfx;
                    if (p < 1) requestAnimationFrame(tick);
                })(t0);
            });
        }, { threshold: 0.6 });
        els.forEach(el => io.observe(el));
    })();

    // === SCROLL TO TOP BUTTON ===
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // === CONSOLE MESSAGE ===
    console.log('%c Digital Solutions Consulting ', 'background: linear-gradient(135deg, rgb(251, 57, 66), rgb(224, 150, 37)); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Agile. Simple. Adaptable. ', 'color: rgb(252, 213, 120); font-size: 14px;');
    console.log('Website built with modern web technologies.');

});

// === PREVENT FORM RESUBMISSION ON PAGE REFRESH ===
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
