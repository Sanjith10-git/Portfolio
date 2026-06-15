/* ==========================================
   PORTFOLIO INTERACTIVE SCRIPTS (index.js)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. INTRO SCREEN LOGIC ---
    const startExploringBtn = document.getElementById('startExploringBtn');
    const introScreen = document.getElementById('introScreen');
    
    if (startExploringBtn && introScreen) {
        startExploringBtn.addEventListener('click', () => {
            introScreen.classList.add('fade-out');
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 800); // Matches the 0.8s CSS transition
        });
    }

    // --- 1. INITIAL REVEAL ON LOAD ---
    setTimeout(() => {
        const browserFrame = document.querySelector('.browser-container');
        if (browserFrame) {
            browserFrame.classList.add('active');
        }
    }, 150);

    // --- 2. INTERSECTION OBSERVER FOR SCROLL REVEALS ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // offset bottom trigger slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 3. METRICS COUNTER ANIMATION ---
    const metricsHud = document.getElementById('metricsHud');
    const metricNums = document.querySelectorAll('.metric-num');
    let counted = false;

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                element.textContent = target;
                return;
            }
            // Cubic out easing for natural slowdown
            const progress = elapsedTime / duration;
            const easeProgress = 1 - Math.pow(1 - progress, 3); 
            const currentVal = Math.floor(easeProgress * target);
            element.textContent = currentVal;
            requestAnimationFrame(updateCount);
        };

        requestAnimationFrame(updateCount);
    };

    const metricsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                metricNums.forEach(num => countUp(num));
                counted = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (metricsHud) {
        metricsObserver.observe(metricsHud);
    }

    // --- 4. MOUSE MOVE PARALLAX EFFECTS ---
    const bgTypography = document.getElementById('bgTypography');
    const heroPortraitImg = document.getElementById('heroPortraitImg');
    
    window.addEventListener('mousemove', (e) => {
        // Normalised mouse coordinates (-0.5 to 0.5)
        const mx = (e.clientX / window.innerWidth) - 0.5;
        const my = (e.clientY / window.innerHeight) - 0.5;

        // Parallax background text: drifts up to 45px
        if (bgTypography) {
            bgTypography.style.transform = `translateX(-50%) translate3d(${mx * 60}px, ${my * 60}px, 0)`;
        }

        // Portrait 3D lens effect: moves slightly within its crop frame and scales
        if (heroPortraitImg) {
            heroPortraitImg.style.transform = `scale(1.05) translate3d(${-mx * 25}px, ${-my * 25}px, 0)`;
        }
    });

    // --- 5. INTERACTIVE TESTIMONIALS SLIDER ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    };

    if (slides.length > 0) {
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
    }

    // --- 6. DYNAMIC ACTIVE NAV LINK & URL ADDRESS BAR ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const browserUrl = document.getElementById('browserUrl');

    const updateActiveSection = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset for nav bar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for bottom of page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentSectionId = 'contact';
        }

        // Update active class on nav links
        navItems.forEach(item => {
            item.classList.remove('active');
            // Check if href matches current ID
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.style.color = 'var(--color-text-main)';
                item.style.borderBottom = '1px solid var(--color-text-main)';
            } else {
                item.style.color = '';
                item.style.borderBottom = '';
            }
        });

        // Update browser frame URL address bar dynamically
        if (browserUrl && currentSectionId) {
            browserUrl.textContent = `www.sanjith.design/#${currentSectionId}`;
        } else if (browserUrl) {
            browserUrl.textContent = 'www.sanjith.design';
        }
    };

    window.addEventListener('scroll', updateActiveSection);
    // Trigger once on load to set URL bar correctly
    updateActiveSection();
});
