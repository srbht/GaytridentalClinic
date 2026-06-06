// ===========================
// Navigation Functionality
// ===========================

// Sticky Navigation
const navbar = document.getElementById('navbar');
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        document.body.classList.add('nav-scrolled');
        scrollToTopBtn.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        document.body.classList.remove('nav-scrolled');
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
        window.__lastBooking = appointmentData;

        // Deliver the booking to the hospital via WhatsApp (no backend required)
        sendBookingToWhatsApp(appointmentData);

        // Show success message
        appointmentForm.style.display = 'none';
        successMessage.classList.add('show');
    }
});

// Hospital WhatsApp number (international format, no '+' or spaces)
const HOSPITAL_WHATSAPP = '918601011987';
const HOSPITAL_EMAIL = 'support@gayatridentalhospital.com';

function readableLabel(selectEl, value) {
    if (!selectEl) return value;
    const opt = Array.from(selectEl.options).find(o => o.value === value);
    return opt ? opt.textContent.trim() : value;
}

function buildBookingMessage(data) {
    const doctorLabel = readableLabel(document.getElementById('doctor'), data.doctor);
    const serviceLabel = readableLabel(document.getElementById('service'), data.service);
    const timeLabel = readableLabel(document.getElementById('time'), data.time);

    const lines = [
        'New Appointment Request — Gayatri Dental Hospital',
        '',
        `Name: ${data.fullName}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Preferred date: ${data.date}`,
        `Preferred time: ${timeLabel}`,
        `Doctor: ${doctorLabel}`,
        `Service: ${serviceLabel}`
    ];
    if (data.message && data.message.trim()) {
        lines.push(`Message: ${data.message.trim()}`);
    }
    return lines.join('\n');
}

function sendBookingToWhatsApp(data) {
    const text = encodeURIComponent(buildBookingMessage(data));
    const url = `https://wa.me/${HOSPITAL_WHATSAPP}?text=${text}`;
    window.open(url, '_blank', 'noopener');
}

function sendBookingByEmail() {
    // Optional fallback: re-send the last booking by email
    const data = window.__lastBooking;
    if (!data) return;
    const subject = encodeURIComponent('Appointment Request — Gayatri Dental Hospital');
    const body = encodeURIComponent(buildBookingMessage(data));
    window.location.href = `mailto:${HOSPITAL_EMAIL}?subject=${subject}&body=${body}`;
}

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
// Service detail modal (Learn more)
// ===========================

const SERVICE_FORM_VALUE = {
    general: 'general',
    cosmetic: 'cosmetic',
    'oral-surgery': 'surgery',
    maxillofacial: 'maxillofacial',
    trauma: 'trauma',
    pediatric: 'pediatric',
    orthodontics: 'orthodontics',
    'root-canal': 'root-canal'
};

const SERVICE_DETAILS = {
    general: {
        title: 'General Dentistry',
        image: 'images/services/general.jpg',
        alt: 'Dental examination tools and clinical setup (illustrative photo)',
        html: `
            <p>Day-to-day care that keeps your teeth and gums healthy—and catches problems while they are small and easier to treat.</p>
            <h3>What we offer</h3>
            <ul>
                <li><strong>Check-ups &amp; exams</strong> — full mouth assessment, early decay and gum screening.</li>
                <li><strong>Professional cleaning (scaling)</strong> — tartar removal and polishing for fresher breath.</li>
                <li><strong>Fillings</strong> — tooth-coloured or silver options, matched to your tooth and budget.</li>
                <li><strong>Preventive advice</strong> — brushing technique, diet tips, fluoride and sealants where useful.</li>
                <li><strong>Pain relief</strong> — same-visit care when you have toothache or swelling (as slots allow).</li>
            </ul>
            <h3>Visit frequency</h3>
            <p>Most adults do well with a check-up and cleaning every <strong>6 months</strong>; we may suggest a different interval if you have gum disease or heavy tartar.</p>
            <h3>At Gayatri Dental</h3>
            <p>We explain findings in plain language (Hindi/English as you prefer), use modern diagnostic aids, and coordinate with our surgeons if you need more than routine care.</p>
        `
    },
    cosmetic: {
        title: 'Cosmetic Dentistry',
        image: 'images/services/cosmetic.jpg',
        alt: 'Smile and dental aesthetics (illustrative photo)',
        html: `
            <p>Treatments focused on the <strong>look</strong> of your smile—shade, shape, alignment of visible teeth—while keeping oral health in mind.</p>
            <h3>Popular options</h3>
            <ul>
                <li><strong>Teeth whitening</strong> — in-office or take-home kits under supervision for safer, even results.</li>
                <li><strong>Veneers / bonding</strong> — cover chips, gaps, or heavy stains on front teeth.</li>
                <li><strong>Smile design</strong> — planning shade and shape before we touch the tooth.</li>
                <li><strong>Replacement of old fillings</strong> — tooth-coloured restorations in the smile zone.</li>
            </ul>
            <h3>Before you start</h3>
            <p>We check for decay, gum health, and bite issues first—cosmetic work lasts longer on a healthy foundation.</p>
            <h3>Expectations</h3>
            <p>We discuss limits of each option, how many visits are needed, and how to maintain results at home.</p>
        `
    },
    'oral-surgery': {
        title: 'Oral Surgery',
        image: 'images/services/oral-surgery.jpg',
        alt: 'Sterile surgical environment (illustrative photo)',
        html: `
            <p>Procedures inside the mouth that need <strong>local anaesthesia</strong> or deeper sedation, done with sterile technique and proper post-op instructions.</p>
            <h3>Common procedures</h3>
            <ul>
                <li><strong>Wisdom tooth removal</strong> — simple or surgical extraction depending on position.</li>
                <li><strong>Dental implants</strong> — planning and placement in coordination with restorative phase.</li>
                <li><strong>Biopsy / lesion removal</strong> — when advised after examination.</li>
                <li><strong>Exposure &amp; orthodontic bonding</strong> — for impacted teeth, when referred.</li>
            </ul>
            <h3>Before surgery</h3>
            <p>We review medical history, medicines, and X-rays; fasting or medicine changes are explained clearly when needed.</p>
            <h3>After care</h3>
            <p>You receive written instructions, emergency contact, and follow-up timing to reduce pain, swelling, and dry socket risk.</p>
        `
    },
    maxillofacial: {
        title: 'Maxillofacial Surgery',
        image: 'images/services/maxillofacial.jpg',
        alt: 'Clinical surgical setting (illustrative photo)',
        html: `
            <p>Specialised surgery of the <strong>jaws, face, and mouth</strong>—often for complex bite problems, cysts/tumours, jaw fractures, or orthognathic (jaw alignment) planning.</p>
            <h3>When it is needed</h3>
            <ul>
                <li>Severe jaw mismatch affecting bite, speech, or breathing.</li>
                <li>Facial or jaw fractures and certain infections.</li>
                <li>Removal or management of some pathology after imaging.</li>
                <li>Support for obstructive sleep apnoea in selected cases (as part of a full plan).</li>
            </ul>
            <h3>How we work</h3>
            <p>Assessment includes clinical exam and imaging (OPG / CBCT when indicated). Plans are discussed with you—and with orthodontists or other specialists when required.</p>
            <h3>At our hospital</h3>
            <p>Gayatri Dental combines <strong>oral &amp; maxillofacial</strong> expertise with hospital infrastructure for safer, coordinated care.</p>
        `
    },
    trauma: {
        title: 'Face Trauma Care',
        image: 'images/services/trauma.jpg',
        alt: 'First aid and clinical care supplies (illustrative photo)',
        html: `
            <p>Urgent and planned care after <strong>facial injury</strong>—cuts, dental trauma (broken/knocked teeth), jaw injury, or soft-tissue damage from accidents or assaults.</p>
            <h3>Emergency priorities</h3>
            <ul>
                <li>Control bleeding, protect the airway, and stabilise serious injury.</li>
                <li>Save knocked-out teeth: store in milk/saline and reach a dentist <strong>as soon as possible</strong>.</li>
                <li>Immobilise jaw if fracture suspected; avoid chewing.</li>
            </ul>
            <h3>What we provide</h3>
            <ul>
                <li>Laceration repair and soft-tissue management where within our scope.</li>
                <li>Dental splinting, fracture assessment, and referral pathway if higher care is needed.</li>
                <li>Coordination with imaging and medical colleagues for complex cases.</li>
            </ul>
            <h3>Call first</h3>
            <p>For life-threatening emergencies, use <strong>local emergency services</strong>. For facial/dental trauma that needs urgent dental/maxillofacial attention, contact our reception or emergency line.</p>
        `
    },
    pediatric: {
        title: 'Pediatric Dentistry',
        image: 'images/services/pediatric.jpg',
        alt: 'Child-friendly dental care (illustrative photo)',
        html: `
            <p>Dental care for <strong>infants, children, and teens</strong>—gentle pace, behaviour guidance, and prevention so adult teeth get the best start.</p>
            <h3>Services</h3>
            <ul>
                <li>First dental visit (often by age 1 or when first tooth appears).</li>
                <li>Cleaning, fluoride, and sealants on molars to prevent cavities.</li>
                <li>Fillings and pulp care for baby teeth when needed.</li>
                <li>Habit counselling (thumb/pacifier), sport guards, and growth checks.</li>
            </ul>
            <h3>Our approach</h3>
            <p>We use <strong>tell-show-do</strong>, short appointments for young children, and involve parents in home care routines.</p>
            <h3>Safety</h3>
            <p>Strict sterilisation, appropriate X-ray use only when needed, and options discussed with guardians before treatment.</p>
        `
    },
    orthodontics: {
        title: 'Orthodontics',
        image: 'images/services/orthodontics.jpg',
        alt: 'Dental alignment and braces-related care (illustrative photo)',
        html: `
            <p>Straightening teeth and correcting <strong>bite (occlusion)</strong> using braces, wires, or clear aligners—planned for function as well as appearance.</p>
            <h3>Treatment types</h3>
            <ul>
                <li><strong>Fixed braces</strong> — metal or ceramic brackets with wires.</li>
                <li><strong>Clear aligners</strong> — where suitable for mild–moderate crowding (case-dependent).</li>
                <li><strong>Retention</strong> — retainers after active treatment to limit relapse.</li>
            </ul>
            <h3>Process</h3>
            <p>Records (photos, models or scans, X-rays), diagnosis, estimated duration, and visit frequency are explained before you commit.</p>
            <h3>With surgery</h3>
            <p>Severe jaw mismatch may need <strong>combined orthodontic + surgical</strong> planning—we coordinate with maxillofacial surgery when indicated.</p>
        `
    },
    'root-canal': {
        title: 'Root Canal Treatment (RCT)',
        image: 'images/services/root-canal.jpg',
        alt: 'Dental treatment and instruments (illustrative photo)',
        html: `
            <p><strong>Endodontic therapy</strong> removes infected or inflamed pulp from inside the tooth, cleans and shapes the canals, then seals them—so you can keep your natural tooth instead of extracting it.</p>
            <h3>When RCT is advised</h3>
            <ul>
                <li>Deep decay reaching the nerve, or a cracked tooth with pulp damage.</li>
                <li>Severe pain to hot/cold, lingering ache, or abscess on the gum.</li>
                <li>Sometimes before placing a crown on a heavily filled tooth.</li>
            </ul>
            <h3>What to expect</h3>
            <ul>
                <li>Usually done under <strong>local anaesthesia</strong>; the tooth is numbed.</li>
                <li>One or more visits depending on infection and tooth type.</li>
                <li>After RCT, a <strong>crown</strong> is often recommended on back teeth to prevent fracture.</li>
            </ul>
            <h3>Comfort</h3>
            <p>We work at your pace, explain each step, and discuss pain control and follow-up so you know what is normal after the visit.</p>
        `
    }
};

let serviceModalCurrentKey = null;
const serviceModal = document.getElementById('serviceModal');
const serviceModalTitle = document.getElementById('serviceModalTitle');
const serviceModalContent = document.getElementById('serviceModalContent');
const serviceModalImg = document.getElementById('serviceModalImg');
const serviceModalBackdrop = document.getElementById('serviceModalBackdrop');
const serviceModalClose = document.getElementById('serviceModalClose');
const serviceModalClose2 = document.getElementById('serviceModalClose2');
const serviceModalBook = document.getElementById('serviceModalBook');

function openServiceModal(key) {
    const detail = SERVICE_DETAILS[key];
    if (!detail || !serviceModal) return;
    serviceModalCurrentKey = key;
    serviceModalTitle.textContent = detail.title;
    serviceModalContent.innerHTML = detail.html;
    serviceModalImg.src = detail.image;
    serviceModalImg.alt = detail.alt;
    serviceModal.classList.add('is-open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('service-modal-open');
    serviceModalClose.focus();
}

function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('service-modal-open');
    serviceModalImg.removeAttribute('src');
    serviceModalCurrentKey = null;
}

function bookServiceFromModal() {
    const key = serviceModalCurrentKey;
    const formVal = key ? SERVICE_FORM_VALUE[key] : '';
    closeServiceModal();
    if (formVal) {
        const sel = document.getElementById('service');
        if (sel) sel.value = formVal;
    }
    scrollToAppointment();
}

serviceModalBackdrop?.addEventListener('click', closeServiceModal);
serviceModalClose?.addEventListener('click', closeServiceModal);
serviceModalClose2?.addEventListener('click', closeServiceModal);
serviceModalBook?.addEventListener('click', bookServiceFromModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal?.classList.contains('is-open')) {
        closeServiceModal();
    }
});

const serviceCards = document.querySelectorAll('.service-card[data-service]');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const key = card.getAttribute('data-service');
        if (key) openServiceModal(key);
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const key = card.getAttribute('data-service');
            if (key) openServiceModal(key);
        }
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

console.log('%cGayatri Dental Hospital & Face Trauma Center', 'color: #0096ff; font-size: 20px; font-weight: bold;');
console.log('%cWebsite by Antigravity AI', 'color: #00c8b4; font-size: 14px;');
