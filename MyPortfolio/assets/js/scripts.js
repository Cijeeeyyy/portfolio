/**
 * Modern Portfolio JavaScript
 * Features: SPA Navigation, Animations, Interactions
 */

// Global State
const state = {
    currentSection: 'home',
    currentSlide: {},
    lightboxSlider: null,
    lightboxIndex: 0,
    isMenuOpen: false,
    isDarkMode: true
};

// Typing Animation Configuration
const typingConfig = {
    strings: [
        'Web Developer',
        'AI Enthusiast',
        'Problem Solver',
        'Full Stack Developer',
        'Innovation Seeker'
    ],
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000,
    loop: true
};

// DOM Elements
const elements = {
    header: document.getElementById('header'),
    nav: document.getElementById('nav'),
    hamburger: document.getElementById('hamburger'),
    themeToggle: document.getElementById('theme-toggle'),
    scrollProgress: document.getElementById('scroll-progress'),
    particles: document.getElementById('particles'),
    typingText: document.getElementById('typing-text'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    toast: document.getElementById('toast')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initNavigation();
    initScrollEffects();
    initThemeToggle();
    initSkillBars();
    initCounters();
    initSliders();
    initLightbox();
});

// Particle Animation
function initParticles() {
    if (!elements.particles) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        elements.particles.appendChild(particle);
    }
}

// Typing Animation
function initTypingAnimation() {
    if (!elements.typingText) return;

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = typingConfig.typeSpeed;

    function type() {
        const currentString = typingConfig.strings[stringIndex];

        if (isDeleting) {
            elements.typingText.textContent = currentString.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = typingConfig.backSpeed;
        } else {
            elements.typingText.textContent = currentString.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = typingConfig.typeSpeed;
        }

        if (!isDeleting && charIndex === currentString.length) {
            isDeleting = true;
            typingSpeed = typingConfig.backDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % typingConfig.strings.length;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// Navigation
function initNavigation() {
    // Hamburger Menu
    elements.hamburger?.addEventListener('click', toggleMenu);

    // Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateTo(section);

            if (state.isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const section = href.substring(1);
                navigateTo(section);
            }
        });
    });
}

function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    elements.hamburger?.classList.toggle('active', state.isMenuOpen);
    elements.nav?.classList.toggle('active', state.isMenuOpen);
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function navigateTo(sectionId) {
    // Update active states
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    state.currentSection = sectionId;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update page title
    updatePageTitle(sectionId);

    // Trigger animations for new section
    setTimeout(() => {
        animateSection(sectionId);
    }, 100);
}

function updatePageTitle(section) {
    const titles = {
        home: 'Clark Jake N. Demition | Web Developer',
        about: 'About Me | Clark Jake N. Demition',
        internship: 'Experience | Clark Jake N. Demition',
        projects: 'Projects | Clark Jake N. Demition',
        contact: 'Contact | Clark Jake N. Demition'
    };
    document.title = titles[section] || titles.home;
}

function animateSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Animate skill bars if in about section
    if (sectionId === 'about') {
        initSkillBars();
    }

    // Animate counters if in home section
    if (sectionId === 'home') {
        initCounters();
    }
}

// Scroll Effects
function initScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateScrollProgress() {
    if (!elements.scrollProgress) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    elements.scrollProgress.style.width = progress + '%';
}

function updateHeader() {
    if (!elements.header) return;

    const scrolled = window.scrollY > 50;
    elements.header.classList.toggle('scrolled', scrolled);
}

// Theme Toggle
function initThemeToggle() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.isDarkMode = !document.body.classList.contains('light-mode');

    elements.themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('light-mode', !state.isDarkMode);

    // Save preference
    localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');

    showToast(state.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    state.isDarkMode = false;
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Image Sliders
function initSliders() {
    // Initialize slider states
    document.querySelectorAll('.project-image-slider').forEach(slider => {
        const sliderId = slider.id;
        state.currentSlide[sliderId] = 0;

        // Auto-play sliders
        setInterval(() => {
            if (state.lightboxSlider !== sliderId) {
                changeSlide(sliderId, 1);
            }
        }, 5000);
    });
}

function changeSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.dot');
    const totalSlides = images.length;

    let currentIndex = state.currentSlide[sliderId] || 0;
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

    // Update images
    images.forEach((img, index) => {
        img.classList.toggle('active', index === currentIndex);
    });

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    state.currentSlide[sliderId] = currentIndex;
}

function goToSlide(sliderId, index) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.dot');

    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    state.currentSlide[sliderId] = index;
}

// Lightbox
function initLightbox() {
    // Close on background click
    elements.lightbox?.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!elements.lightbox?.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxChange(-1);
        if (e.key === 'ArrowRight') lightboxChange(1);
    });
}

function openLightbox(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider || !elements.lightbox) return;

    state.lightboxSlider = sliderId;
    state.lightboxIndex = state.currentSlide[sliderId] || 0;

    const images = slider.querySelectorAll('.slider-image');
    const currentImage = images[state.lightboxIndex];

    if (currentImage) {
        elements.lightboxImg.src = currentImage.src;
        elements.lightboxImg.alt = currentImage.alt;
        updateLightboxCounter(images.length);
        elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    elements.lightbox?.classList.remove('active');
    document.body.style.overflow = '';
    state.lightboxSlider = null;
}

function lightboxChange(direction) {
    if (!state.lightboxSlider) return;

    const slider = document.getElementById(state.lightboxSlider);
    const images = slider.querySelectorAll('.slider-image');
    const total = images.length;

    state.lightboxIndex = (state.lightboxIndex + direction + total) % total;

    const newImage = images[state.lightboxIndex];
    elements.lightboxImg.style.opacity = '0';

    setTimeout(() => {
        elements.lightboxImg.src = newImage.src;
        elements.lightboxImg.alt = newImage.alt;
        elements.lightboxImg.style.opacity = '1';
        updateLightboxCounter(total);
    }, 200);
}

function updateLightboxCounter(total) {
    const currentEl = document.getElementById('lightbox-current');
    const totalEl = document.getElementById('lightbox-total');

    if (currentEl) currentEl.textContent = state.lightboxIndex + 1;
    if (totalEl) totalEl.textContent = total;
}

// Toast Notification
function showToast(message) {
    if (!elements.toast) return;

    const messageEl = document.getElementById('toast-message');
    if (messageEl) messageEl.textContent = message;

    elements.toast.classList.add('active');

    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 3000);
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Add fade-in animation
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.quick-nav-card, .skill-card, .timeline-item, .experience-card, .project-card-featured, .contact-info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(el);
});

// Performance: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    if (window.innerWidth > 768 && state.isMenuOpen) {
        toggleMenu();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Preload images for better performance
function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
    });
}

// Initialize preloading after page load
window.addEventListener('load', preloadImages);

// Export functions for global access
window.navigateTo = navigateTo;
window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxChange = lightboxChange;
window.showToast = showToast;