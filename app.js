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

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Sayfa kaydırıldığında menüyü kapat
window.onscroll = () => {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


