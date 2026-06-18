import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const datePills = document.querySelectorAll('.date-pill');
    const timePills = document.querySelectorAll('.time-pill');
    const bookBtn = document.getElementById('book-btn');

    // State Variables
    let selectedDate = "24 Nov 2025"; // Default from mockup
    let selectedTime = "9:30 AM";     // Default from mockup

    // Toggle Active State for Dates
    datePills.forEach(pill => {
        pill.addEventListener('click', () => {
            datePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedDate = `${pill.querySelector('strong').innerText} Nov 2025`; 
        });
    });

    // Toggle Active State for Times
    timePills.forEach(pill => {
        pill.addEventListener('click', () => {
            timePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedTime = pill.innerText;
        });
    });

    // Handle Booking Action
    bookBtn.addEventListener('click', async () => {
        bookBtn.innerText = "Booking...";
        bookBtn.disabled = true;

        // Structured exactly as per your APPOINTMENT MODULE specs
        const appointmentData = {
            PatientName: "Sajibur Rahman", // Placeholder (would come from Auth/Patient record)
            MobileNumber: "+91XXXXXXXXXX",
            Branch: "B1",
            PreferredDate: selectedDate,
            PreferredTime: selectedTime,
            Therapist: "Dr. Name Here",
            Status: "Pending",
            CreatedAt: serverTimestamp()
        };

        try {
            // Add to the 'appointments' collection
            const docRef = await addDoc(collection(db, "appointments"), appointmentData);
            alert(`Success! Appointment confirmed for ${selectedDate} at ${selectedTime}. ID: ${docRef.id}`);
            
            // Redirect back to dashboard
            window.location.href = "index.html"; 
        } catch (error) {
            console.error("Error booking appointment: ", error);
            alert("Failed to book. Please try again.");
            bookBtn.innerText = "Book an Appointment";
            bookBtn.disabled = false;
        }
    });
});
