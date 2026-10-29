// =========================================
// FIREBASE SDK IMPORTS
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =========================================
// FIREBASE CONFIGURATION
// =========================================
const firebaseConfig = {
    apiKey: "AIzaSyBrp094UwyRERt6JhYg0TJeOpbDM_6skDg",
    authDomain: "ultra-chat-app-c690d.firebaseapp.com",
    projectId: "ultra-chat-app-c690d",
    storageBucket: "ultra-chat-app-c690d.firebasestorage.app",
    messagingSenderId: "662870367782",
    appId: "1:662870367782:web:ec1822465ad5f7e81650e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =========================================
// DOM ELEMENTS
// =========================================
const certInput = document.getElementById('certInput');
const verifyBtn = document.getElementById('verifyBtn');
const loading = document.getElementById('loading');
const resultSuccess = document.getElementById('resultSuccess');
const resultError = document.getElementById('resultError');

// =========================================
// VERIFY CERTIFICATE FUNCTION
// =========================================
async function verifyCertificate() {
    const certId = certInput.value.trim().toUpperCase();

    // Reset UI
    resultSuccess.classList.add('hidden');
    resultError.classList.add('hidden');
    loading.classList.add('hidden');

    // Empty check
    if (!certId) {
        certInput.focus();
        certInput.style.borderColor = '#ef4444';
        setTimeout(() => { certInput.style.borderColor = ''; }, 1500);
        return;
    }

    // Show loading
    loading.classList.remove('hidden');
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        // Fetch from Firestore
        const certRef = doc(db, "certificates", certId);
        const certSnap = await getDoc(certRef);

        // Small delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));

        loading.classList.add('hidden');

        if (certSnap.exists()) {
            const cert = certSnap.data();

            // Status check
            if (cert.status && cert.status.toLowerCase() !== "valid") {
                showError();
                return;
            }

            // Populate ALL fields
            document.getElementById('rName').textContent = cert.studentName || "—";
            document.getElementById('rEmail').textContent = cert.studentEmail || "—";
            document.getElementById('rEnrollment').textContent = cert.enrollmentNo || "—";
            document.getElementById('rId').textContent = cert.certId || certId;
            document.getElementById('rCourse').textContent = cert.courseName || "—";
            document.getElementById('rCourseDetails').textContent = cert.courseDetails || "—";
            document.getElementById('rDuration').textContent = cert.duration || "—";
            
            // Academic details
            const examScore = cert.examScore !== undefined ? cert.examScore : "—";
            const totalScore = cert.totalExamScore !== undefined ? cert.totalExamScore : "—";
            document.getElementById('rScore').textContent = 
                examScore !== "—" && totalScore !== "—" 
                    ? `${examScore} / ${totalScore}` 
                    : "—";
            
            document.getElementById('rPercentage').textContent = 
                cert.percentage !== undefined ? `${cert.percentage}%` : "—";
            document.getElementById('rGrade').textContent = cert.grade || "—";
            
            const labsCompleted = cert.practicalLabsCompleted !== undefined ? cert.practicalLabsCompleted : "—";
            const labsTotal = cert.practicalLabsTotal !== undefined ? cert.practicalLabsTotal : "—";
            document.getElementById('rLabs').textContent = 
                labsCompleted !== "—" && labsTotal !== "—" 
                    ? `${labsCompleted} / ${labsTotal}` 
                    : "—";
            
            // Issue details
            document.getElementById('rDate').textContent = cert.issueDate || "—";
            document.getElementById('rInstructor').textContent = cert.instructor || "—";
            document.getElementById('rRemarks').textContent = cert.remarks || "—";

            // Show success
            resultSuccess.classList.remove('hidden');
            resultSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } else {
            showError();
        }

    } catch (error) {
        console.error("Firebase Error:", error);
        loading.classList.add('hidden');
        showError();
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = '<i class="fas fa-shield-halved"></i> Verify';
    }
}

// =========================================
// SHOW ERROR
// =========================================
function showError() {
    resultError.classList.remove('hidden');
    resultError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// =========================================
// EVENT LISTENERS
// =========================================
verifyBtn.addEventListener('click', verifyCertificate);

certInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyCertificate();
});

certInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// URL se auto-verify (QR code / share link support)
const urlParams = new URLSearchParams(window.location.search);
const autoCertId = urlParams.get('certId');
if (autoCertId) {
    certInput.value = autoCertId.toUpperCase();
    setTimeout(verifyCertificate, 500);
}

console.log("✅ Jay Computer Academy - Firebase Connected");