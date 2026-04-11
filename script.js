// ===========================
// Navigation Functionality
// ===========================

// Sticky Navigation
const navbar = document.getElementById('navbar');
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollToTopBtn.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        scrollToTopBtn.classList.remove('show');
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Active Navigation Links
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Smooth Scroll for Navigation Links
navItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offset = 80; // navbar height
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// ===========================
// Scroll Functions
// ===========================

function scrollToAppointment() {
    const appointmentSection = document.getElementById('appointment');
    const offset = 80;
    const targetPosition = appointmentSection.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    const offset = 80;
    const targetPosition = servicesSection.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Scroll to Top
scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===========================
// Appointment Form
// ===========================

const appointmentForm = document.getElementById('appointmentForm');
const successMessage = document.getElementById('successMessage');

// Set minimum date to today
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

appointmentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = {};
    
    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });
    
    // Validate form
    if (validateForm(appointmentData)) {
        // Simulate form submission
        console.log('Appointment Data:', appointmentData);
        
        // Show success message
        appointmentForm.style.display = 'none';
        successMessage.classList.add('show');
        
        // In a real application, you would send this data to your backend
        // Example:
        // fetch('/api/appointments', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(appointmentData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     appointmentForm.style.display = 'none';
        //     successMessage.classList.add('show');
        // })
        // .catch(error => {
        //     alert('Error submitting appointment. Please try again.');
        // });
    }
});

function validateForm(data) {
    // Check required fields
    if (!data.fullName || !data.email || !data.phone || !data.date || !data.time || !data.doctor || !data.service) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone (basic validation for Indian numbers)
    const phoneRegex = /^[0-9]{10}$/;
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (!phoneRegex.test(phoneDigits)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }
    
    // Validate date (should not be in the past)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date for your appointment.');
        return false;
    }
    
    return true;
}

function resetForm() {
    appointmentForm.reset();
    appointmentForm.style.display = 'block';
    successMessage.classList.remove('show');
}

// ===========================
// Animations on Scroll
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .feature-item, .contact-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===========================
// Service Cards Interaction
// ===========================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // In a real application, this could navigate to a detailed service page
        console.log('Service clicked:', card.querySelector('h3').textContent);
    });
});

// ===========================
// Utility Functions
// ===========================

// Format phone number as user types
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Disable Sundays in date picker (optional - can be customized)
dateInput?.addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();
    
    // Optionally check if selected day is Sunday (0) or any other day you want to block
    // if (dayOfWeek === 0) {
    //     alert('We are closed on Sundays. Please select another date.');
    //     e.target.value = '';
    // }
});

// ===========================
// Counter Animation for Stats
// ===========================

function animateCounter(element, target, duration = 2000) {
    const original = element.textContent.trim();
    const isPercent = original.includes('%');
    const suffix = isPercent ? '%' : '+';
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }
    }, 16);
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.hero-stats-bar .stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                const number = parseInt(text.replace(/\D/g, ''), 10);
                if (!isNaN(number)) {
                    animateCounter(stat, number, 2000);
                }
            });
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.35 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ===========================
// Loading Animation
// ===========================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================
// Console Message
// ===========================

console.log('%cGaytri Dental Hospital & Face Trauma Center', 'color: #0096ff; font-size: 20px; font-weight: bold;');
console.log('%cWebsite by Antigravity AI', 'color: #00c8b4; font-size: 14px;');
