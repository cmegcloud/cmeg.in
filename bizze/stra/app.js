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
