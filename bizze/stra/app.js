import { db } from './firebase-config.js';
// Import Firestore functions here later when you are ready to fetch live dashboard data
// import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SESSION & ROLE VERIFICATION ---
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userRole = sessionStorage.getItem("userRole");
    const userBranch = sessionStorage.getItem("userBranch");
    const userName = sessionStorage.getItem("userName");

    // If the user is not logged in, immediately kick them back to the login screen
    if (isLoggedIn !== "true") {
        window.location.href = "login.html";
        return; // Stop running the rest of the script
    }

import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 4. LIVE APPOINTMENT BOARD (Real-time updates) ---
const liveAppointmentsList = document.getElementById('live-appointments-list');

if (liveAppointmentsList) {
    // Determine the date to query (e.g., today's date). Hardcoded here to match our booking mockup.
    const todayStr = "24 Nov 2025"; 
    
    // Build query: Filter by today's date. If user is Staff, also filter by their specific Branch.
    let baseQuery;
    if (userRole === "Staff") {
        baseQuery = query(
            collection(db, "appointments"), 
            where("PreferredDate", "==", todayStr),
            where("Branch", "==", userBranch)
        );
    } else {
        // Admin sees all branches
        baseQuery = query(
            collection(db, "appointments"), 
            where("PreferredDate", "==", todayStr)
        );
    }

    // Set up the real-time listener
    onSnapshot(baseQuery, (snapshot) => {
        liveAppointmentsList.innerHTML = ''; // Clear loading text
        
        if (snapshot.empty) {
            liveAppointmentsList.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-light);">No appointments scheduled for today.</td></tr>`;
            return;
        }

        snapshot.forEach((doc) => {
            const apt = doc.data();
            
            // Determine status badge color
            let statusColor = "#8c93a1"; // Default Pending
            if (apt.Status === "Confirmed") statusColor = "#5b84e3";
            if (apt.Status === "Checked In") statusColor = "#faad14";
            if (apt.Status === "Completed") statusColor = "#52c41a";
            if (apt.Status === "Cancelled") statusColor = "#ff4d4f";

            const row = document.createElement('tr');
            row.style.borderBottom = "1px solid #edf1f7";
            row.innerHTML = `
                <td style="padding: 12px 10px; font-weight: 500;">${apt.PreferredTime}</td>
                <td style="padding: 12px 10px;">
                    ${apt.PatientName}<br>
                    <span style="font-size: 10px; color: var(--text-light);">${apt.Branch}</span>
                </td>
                <td style="padding: 12px 10px;">${apt.Therapist}</td>
                <td style="padding: 12px 10px;">
                    <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">
                        ${apt.Status}
                    </span>
                </td>
            `;
            liveAppointmentsList.appendChild(row);
        });
    }, (error) => {
        console.error("Error fetching live appointments:", error);
        liveAppointmentsList.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #ff4d4f;">Error loading data.</td></tr>`;
    });
}

    // --- 2. UPDATE UI BASED ON USER DATA ---
    // Update the "Good morning!" name based on the logged-in user
    const greetingNameEl = document.querySelector('.greeting h2');
    if (greetingNameEl && userName) {
        greetingNameEl.innerText = userName;
    }

    // Apply specific restrictions based on Role
    if (userRole === "Staff") {
        console.log(`Staff access granted. Restricted to branch: ${userBranch}`);
        // Example: document.getElementById('admin-settings-button').style.display = 'none';
    } else if (userRole === "Admin") {
        console.log("Admin access granted. Full access across all branches.");
    }

    // --- 3. DASHBOARD UI INTERACTIONS ---
    
    // Handle Doctor Category Pills (All, Cardiology, Dermatology, etc.)
    const categoryPills = document.querySelectorAll('.pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            // Add active class to the clicked pill
            pill.classList.add('active');
            
            // Future logic: Filter the 'Popular Doctors' list here
        });
    });

    // Handle Bottom Navigation Highlights
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Wire up the "Re-Schedule" button on the appointment card to go to the booking screen
    const reScheduleBtn = document.querySelector('.btn-secondary');
    if (reScheduleBtn) {
        reScheduleBtn.addEventListener('click', () => {
            window.location.href = "booking.html";
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const waModal = document.getElementById('whatsapp-modal');
    const closeBtn = document.querySelector('.close-modal-btn');
    const waActionBtns = document.querySelectorAll('.wa-action-btn');

    // Mock patient data (In reality, you'd pass this dynamically when clicking the specific appointment row)
    const activePatient = {
        name: "Sajibur Rahman",
        phone: "919876543210", // Must include country code, no "+" or spaces
        date: "24 Nov 2025",
        time: "9:30 AM",
        doctor: "Dr. Ali Khan",
        amountDue: "2,000.00"
    };

    // Close Modal Logic
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            waModal.style.display = 'none';
        });
    }

    // Handle One-Click Send Actions
    waActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const messageType = e.target.getAttribute('data-type');
            let messageText = "";

            // Construct prefilled messages based on type
            switch (messageType) {
                case "confirmation":
                    messageText = `Hello ${activePatient.name}, your appointment with ${activePatient.doctor} at Bizze Clinic is confirmed for ${activePatient.date} at ${activePatient.time}. We look forward to seeing you!`;
                    break;
                case "reminder":
                    messageText = `Reminder: Hi ${activePatient.name}, you have an upcoming appointment with ${activePatient.doctor} tomorrow at ${activePatient.time}. Please reply with 'YES' to confirm.`;
                    break;
                case "payment":
                    messageText = `Hello ${activePatient.name}, this is a gentle reminder from Bizze Clinic regarding an outstanding payment of ₹${activePatient.amountDue}. Please clear the dues at your earliest convenience.`;
                    break;
                case "followup":
                    messageText = `Hi ${activePatient.name}, ${activePatient.doctor} requested a follow-up consultation. Please let us know a convenient time to schedule your next visit to Bizze Clinic.`;
                    break;
            }

            // Encode the text for URL and open WhatsApp
            const encodedMessage = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${activePatient.phone}?text=${encodedMessage}`;
            
            // Open in new tab
            window.open(whatsappUrl, '_blank');
            waModal.style.display = 'none'; // Close modal after click
        });
    });
});

