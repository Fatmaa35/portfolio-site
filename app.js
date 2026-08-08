// --- Firebase Integration ---
console.log("Haberler v1.2 yüklendi - Bilim & Teknoloji modu aktif.");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAaN1p5gEkLGtevAk1xuM8GH0OrVPshuYY",
    authDomain: "portfoy-site-4886b.firebaseapp.com",
    projectId: "portfoy-site-4886b",
    storageBucket: "portfoy-site-4886b.firebasestorage.app",
    messagingSenderId: "647354226396",
    appId: "1:647354226396:web:912ee0fe278570abb7c619",
    measurementId: "G-LHQ4RZ91SQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// --- Form Submission Logic ---
const contactForm = document.querySelector('#contact-form');
const toastContainer = document.querySelector('#toast-container');

// Toast Function
function showToast(message, type = 'success') {
    if (!toastContainer) return; // Prevent errors on pages without a toast container
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? 'bx-check-circle' : 'bx-error-circle';
    
    toast.innerHTML = `
        <i class='bx ${icon}'></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after animation finishes
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Simple Email Validation
function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Honeypot Check (Anti-Spam)
        const honeypot = document.querySelector('#honeypot').value;
        if (honeypot) {
            console.log("Spam detected!");
            return;
        }

        // 2. Client-side Validation Highlights
        const emailInput = document.querySelector('#email');
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            emailInput.classList.add('input-error');
            showToast("Geçerli bir e-posta adresi giriniz.", "error");
            return;
        } else {
            emailInput.classList.remove('input-error');
        }

        // 3. UI Loading State
        const submitBtn = document.querySelector('#submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        btnText.style.display = 'none';

        // Get Form Data
        const formData = {
            name: document.querySelector('#name').value.trim(),
            email: email,
            phone: document.querySelector('#phone').value.trim(),
            subject: document.querySelector('#subject').value.trim(),
            message: document.querySelector('#message').value.trim(),
            createdAt: serverTimestamp()
        };

        try {
            // Firestore'a kaydet
            await addDoc(collection(db, "contacts"), formData);

            showToast("Mesajınız gönderildi, teşekkürler");
            contactForm.reset();
        } catch (error) {
            console.error("Hata oluştu: ", error);
            showToast("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.", "error");
        } finally {
            // Restore UI State
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
        }
    });
}

// --- Responsive Menu Toggle ---
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.nav-bar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    // Linke tıklandığında menüyü kapat
    const navLinks = navbar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        });
    });

    // Sayfa kaydırıldığında menüyü kapat
    window.addEventListener('scroll', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
}

// --- Portfolio Quest ---
// A lightweight, local-only progress tracker that encourages visitors to explore the portfolio.
const questStorageKey = 'fatma-kaplan-portfolio-quest-v2';
const isEnglish = document.documentElement.lang === 'en';
const questCopy = isEnglish ? {
    title: 'Portfolio Quest',
    intro: 'Explore three parts of the portfolio.',
    project: 'Explore a project',
    blog: 'Read a blog post',
    contact: 'Reach the contact section',
    complete: 'Quest complete! Let’s build something together.',
    unlocked: 'New achievement unlocked!',
    toggleOpen: 'Open portfolio quest',
    toggleClose: 'Close portfolio quest'
} : {
    title: 'Portföy Keşfi',
    intro: 'Portföyün üç bölümünü keşfet.',
    project: 'Bir proje incele',
    blog: 'Bir blog yazısı oku',
    contact: 'İletişim bölümüne ulaş',
    complete: 'Keşif tamamlandı! Birlikte bir şeyler üretelim.',
    unlocked: 'Yeni rozet açıldı!',
    toggleOpen: 'Portföy keşfini aç',
    toggleClose: 'Portföy keşfini kapat'
};

function getQuestProgress() {
    try {
        return JSON.parse(localStorage.getItem(questStorageKey)) || {};
    } catch {
        return {};
    }
}

function saveQuestProgress(progress) {
    try {
        localStorage.setItem(questStorageKey, JSON.stringify(progress));
    } catch {
        // The portfolio still works when the visitor disables local storage.
    }
}

function setupPortfolioQuest() {
    if (!document.querySelector('#home')) return;

    const quest = document.createElement('aside');
    quest.className = 'portfolio-quest is-collapsed';
    quest.setAttribute('aria-label', questCopy.title);
    quest.innerHTML = `
        <button class="quest-toggle" type="button" aria-expanded="true">
            <span class="quest-title"><i class='bx bx-joystick'></i><span class="quest-label">${questCopy.title}</span></span>
            <span class="quest-score"><strong data-quest-count>0</strong>/3 <i class='bx bx-chevron-down'></i></span>
        </button>
        <div class="quest-panel">
            <p>${questCopy.intro}</p>
            <div class="quest-progress" aria-hidden="true"><span data-quest-progress></span></div>
            <ul class="quest-list">
                <li data-quest="project"><i class='bx bx-circle'></i><span>${questCopy.project}</span></li>
                <li data-quest="blog"><i class='bx bx-circle'></i><span>${questCopy.blog}</span></li>
                <li data-quest="contact"><i class='bx bx-circle'></i><span>${questCopy.contact}</span></li>
            </ul>
            <p class="quest-complete" data-quest-complete aria-live="polite"></p>
        </div>`;
    document.body.appendChild(quest);

    const toggle = quest.querySelector('.quest-toggle');
    const render = () => {
        const progress = getQuestProgress();
        const completed = Object.values(progress).filter(Boolean).length;
        quest.querySelector('[data-quest-count]').textContent = completed;
        quest.querySelector('[data-quest-progress]').style.width = `${(completed / 3) * 100}%`;

        quest.querySelectorAll('[data-quest]').forEach((item) => {
            const done = Boolean(progress[item.dataset.quest]);
            item.classList.toggle('is-complete', done);
            item.querySelector('i').className = done ? 'bx bx-check-circle' : 'bx bx-circle';
        });

        const completeMessage = quest.querySelector('[data-quest-complete]');
        completeMessage.textContent = completed === 3 ? questCopy.complete : '';
        completeMessage.classList.toggle('is-visible', completed === 3);
    };

    const recordQuest = (step) => {
        const progress = getQuestProgress();
        if (progress[step]) return;

        progress[step] = true;
        saveQuestProgress(progress);
        render();
        showToast(questCopy.unlocked);
    };

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', questCopy.toggleOpen);
    toggle.addEventListener('click', () => {
        const isCollapsed = quest.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', String(!isCollapsed));
        toggle.setAttribute('aria-label', isCollapsed ? questCopy.toggleOpen : questCopy.toggleClose);
    });

    document.querySelectorAll('.prj-details-btn').forEach((button) => {
        button.addEventListener('click', () => recordQuest('project'));
    });

    document.querySelectorAll('.blog-card a[href]').forEach((link) => {
        link.addEventListener('click', () => recordQuest('blog'));
    });

    const contactSection = document.querySelector('#contact');
    if (contactSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                recordQuest('contact');
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(contactSection);
    }

    render();
}

setupPortfolioQuest();

// --- Visitor Path ---
const visitorRoleStorageKey = 'fatma-kaplan-visitor-role-v2';
const visitorPathCopy = isEnglish ? {
    question: 'What would you like to see?',
    hint: 'Choose a route and the portfolio will highlight the most relevant areas.',
    recruiter: 'Recruiter',
    client: 'Potential client',
    student: 'Student',
    recruiterMessage: 'Start with selected projects, then explore experience and education.',
    clientMessage: 'See how ideas turn into practical solutions, then get in touch.',
    studentMessage: 'Explore learning notes, tools, and project journeys.',
    recruiterCta: 'View experience',
    clientCta: 'Start a conversation',
    studentCta: 'Read the blog'
} : {
    question: 'Neyi görmek istiyorsun?',
    hint: 'Bir rota seç; portföy senin için en ilgili alanları öne çıkarsın.',
    recruiter: 'İşe alımcıyım',
    client: 'Potansiyel müşteriyim',
    student: 'Öğrenciyim',
    recruiterMessage: 'Öne çıkan projelerle başla, ardından deneyim ve eğitime göz at.',
    clientMessage: 'Fikirlerin pratik çözümlere nasıl dönüştüğünü gör, sonra iletişime geç.',
    studentMessage: 'Öğrenme notlarını, araçları ve proje yolculuklarını keşfet.',
    recruiterCta: 'Deneyimleri gör',
    clientCta: 'İletişime geç',
    studentCta: 'Blogu oku'
};

function setupVisitorPath() {
    const description = document.querySelector('.home-content .description');
    if (!description) return;

    const visitorPath = document.createElement('div');
    visitorPath.className = 'visitor-path';
    visitorPath.setAttribute('aria-labelledby', 'visitor-path-title');
    visitorPath.innerHTML = `
        <p class="visitor-path-question" id="visitor-path-title">${visitorPathCopy.question}</p>
        <p class="visitor-path-hint">${visitorPathCopy.hint}</p>
        <div class="visitor-path-options" role="group" aria-label="${visitorPathCopy.question}">
            <button type="button" data-role="recruiter"><i class='bx bx-briefcase-alt-2'></i>${visitorPathCopy.recruiter}</button>
            <button type="button" data-role="client"><i class='bx bx-message-rounded-dots'></i>${visitorPathCopy.client}</button>
            <button type="button" data-role="student"><i class='bx bx-book-open'></i>${visitorPathCopy.student}</button>
        </div>
        <div class="visitor-path-result" aria-live="polite" hidden>
            <p data-role-message></p>
            <a class="visitor-path-cta" data-role-cta href="#projects"></a>
        </div>
        <button type="button" class="portfolio-tour-launch"><i class='bx bx-compass'></i>${isEnglish ? 'Start the 30-second tour' : '30 saniyelik turu başlat'}</button>`;
    description.insertAdjacentElement('afterend', visitorPath);
    const portfolioQuest = document.querySelector('.portfolio-quest');
    const educationSection = document.querySelector('#education');
    if (portfolioQuest && educationSection) {
        educationSection.insertAdjacentElement('beforebegin', portfolioQuest);
    }

    const roleDetails = {
        recruiter: { message: visitorPathCopy.recruiterMessage, cta: visitorPathCopy.recruiterCta, target: '#resume', sections: ['#projects', '#resume'] },
        client: { message: visitorPathCopy.clientMessage, cta: visitorPathCopy.clientCta, target: '#contact', sections: ['#projects', '#contact'] },
        student: { message: visitorPathCopy.studentMessage, cta: visitorPathCopy.studentCta, target: '#blog', sections: ['#blog', '#projects'] }
    };

    const renderRole = (role) => {
        const detail = roleDetails[role];
        if (!detail) return;

        document.body.dataset.visitorRole = role;
        document.querySelectorAll('.role-highlight').forEach((section) => section.classList.remove('role-highlight'));
        detail.sections.forEach((selector) => document.querySelector(selector)?.classList.add('role-highlight'));
        visitorPath.querySelector('[data-role-message]').textContent = detail.message;
        const cta = visitorPath.querySelector('[data-role-cta]');
        cta.textContent = detail.cta;
        cta.href = detail.target;
        visitorPath.querySelector('.visitor-path-result').hidden = false;

        visitorPath.querySelectorAll('[data-role]').forEach((button) => {
            const selected = button.dataset.role === role;
            button.classList.toggle('is-selected', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
    };

    visitorPath.querySelectorAll('[data-role]').forEach((button) => {
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
            const role = button.dataset.role;
            try {
                localStorage.setItem(visitorRoleStorageKey, role);
            } catch {
                // The selected route remains active for this visit without local storage.
            }
            renderRole(role);
        });
    });

    try {
        renderRole(localStorage.getItem(visitorRoleStorageKey));
    } catch {
        // A visitor can choose a route even if browser storage is unavailable.
    }
}

// --- Accessibility Controls ---
const accessibilityStorageKey = 'fatma-kaplan-accessibility-v2';
const accessibilityCopy = isEnglish ? {
    open: 'Accessibility settings',
    close: 'Close accessibility settings',
    title: 'Accessibility',
    light: 'Light theme',
    motion: 'Reduce motion'
} : {
    open: 'Erişilebilirlik ayarlarını aç',
    close: 'Erişilebilirlik ayarlarını kapat',
    title: 'Erişilebilirlik',
    light: 'Açık tema',
    motion: 'Hareketleri azalt'
};

function setupAccessibilityControls() {
    let preferences = {};
    try {
        preferences = JSON.parse(localStorage.getItem(accessibilityStorageKey)) || {};
    } catch {
        preferences = {};
    }

    const reducedMotion = typeof preferences.reducedMotion === 'boolean'
        ? preferences.reducedMotion
        : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lightTheme = preferences.theme === 'light';
    document.body.classList.toggle('light-theme', lightTheme);
    document.body.classList.toggle('reduce-motion', reducedMotion);

    const controls = document.createElement('aside');
    controls.className = 'accessibility-widget';
    controls.innerHTML = `
        <button class="accessibility-toggle" type="button" aria-expanded="false" aria-label="${accessibilityCopy.open}">
            <i class='bx bx-universal-access'></i>
        </button>
        <div class="accessibility-panel" hidden>
            <p>${accessibilityCopy.title}</p>
            <label class="accessibility-option">
                <span><i class='bx bx-sun'></i>${accessibilityCopy.light}</span>
                <input type="checkbox" data-preference="theme" role="switch" ${lightTheme ? 'checked' : ''}>
            </label>
            <label class="accessibility-option">
                <span><i class='bx bx-wind'></i>${accessibilityCopy.motion}</span>
                <input type="checkbox" data-preference="motion" role="switch" ${reducedMotion ? 'checked' : ''}>
            </label>
        </div>`;
    document.body.appendChild(controls);

    const toggle = controls.querySelector('.accessibility-toggle');
    const panel = controls.querySelector('.accessibility-panel');
    toggle.addEventListener('click', () => {
        const isOpen = panel.hidden;
        panel.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? accessibilityCopy.close : accessibilityCopy.open);
    });

    controls.querySelectorAll('[data-preference]').forEach((input) => {
        input.addEventListener('change', () => {
            if (input.dataset.preference === 'theme') {
                preferences.theme = input.checked ? 'light' : 'dark';
                document.body.classList.toggle('light-theme', input.checked);
            } else {
                preferences.reducedMotion = input.checked;
                document.body.classList.toggle('reduce-motion', input.checked);
            }
            try {
                localStorage.setItem(accessibilityStorageKey, JSON.stringify(preferences));
            } catch {
                // The preference still applies during the current visit.
            }
        });
    });
}

setupVisitorPath();

// --- Guided Portfolio Tour ---
const tourCopy = isEnglish ? {
    step: 'Stop',
    next: 'Next stop',
    finish: 'Finish tour',
    projects: 'Selected projects',
    projectsText: 'See how problems are turned into practical solutions and which tools support each project.',
    experience: 'Experience',
    experienceText: 'Get a quick view of the learning journey, internships, and areas of focus.',
    contact: 'Let’s connect',
    contactText: 'If there is a project or idea to discuss, this is the fastest way to get in touch.',
    complete: 'Tour complete — thanks for exploring the portfolio!'
} : {
    step: 'Durak',
    next: 'Sonraki durak',
    finish: 'Turu bitir',
    projects: 'Öne çıkan projeler',
    projectsText: 'Problemlerin pratik çözümlere nasıl dönüştüğünü ve projelerdeki araçları incele.',
    experience: 'Deneyim yolculuğu',
    experienceText: 'Öğrenme sürecine, staj deneyimlerine ve odak alanlarına kısa bir bakış at.',
    contact: 'Bağlantı kuralım',
    contactText: 'Konuşmak istediğin bir fikir ya da proje varsa en hızlı yol buradan iletişime geçmek.',
    complete: 'Tur tamamlandı — portföyü keşfettiğin için teşekkürler!'
};

function setupPortfolioTour() {
    const launchButton = document.querySelector('.portfolio-tour-launch');
    if (!launchButton) return;

    const steps = [
        { selector: '#projects', title: tourCopy.projects, text: tourCopy.projectsText },
        { selector: '#resume', title: tourCopy.experience, text: tourCopy.experienceText },
        { selector: '#contact', title: tourCopy.contact, text: tourCopy.contactText }
    ];
    const tourCard = document.createElement('aside');
    tourCard.className = 'portfolio-tour-card';
    tourCard.setAttribute('aria-live', 'polite');
    let currentStep = 0;

    const clearTourHighlights = () => {
        document.querySelectorAll('.is-tour-stop').forEach((section) => section.classList.remove('is-tour-stop'));
    };

    const showStep = () => {
        const step = steps[currentStep];
        const section = document.querySelector(step.selector);
        const heading = section?.querySelector('.heading');
        if (!section || !heading) return;

        clearTourHighlights();
        section.classList.add('is-tour-stop');
        tourCard.innerHTML = `
            <p class="tour-count">${tourCopy.step} ${currentStep + 1}/${steps.length}</p>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
            <button type="button" class="tour-next">${currentStep === steps.length - 1 ? tourCopy.finish : tourCopy.next}<i class='bx bx-right-arrow-alt'></i></button>`;
        heading.insertAdjacentElement('afterend', tourCard);
        section.scrollIntoView({ behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth', block: 'start' });

        tourCard.querySelector('.tour-next').addEventListener('click', () => {
            if (currentStep === steps.length - 1) {
                clearTourHighlights();
                tourCard.remove();
                launchButton.focus();
                showToast(tourCopy.complete);
                return;
            }
            currentStep += 1;
            showStep();
        });
    };

    launchButton.addEventListener('click', () => {
        currentStep = 0;
        showStep();
    });
}

setupPortfolioTour();
setupAccessibilityControls();
