import { db } from './firebase-config.js';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-mobile');
    const detailsSection = document.getElementById('patient-details-section');
    const historySection = document.getElementById('patient-history');
    const saveBtn = document.getElementById('save-patient-btn');
    const patientIdBadge = document.getElementById('patient-id-badge');

    // Form Fields
    const nameInput = document.getElementById('patient-name');
    const ageInput = document.getElementById('patient-age');
    const genderInput = document.getElementById('patient-gender');

    let currentPatientId = null;

    // Search for Patient by Mobile Number
    searchBtn.addEventListener('click', async () => {
        const mobileNum = searchInput.value.trim();
        if (!mobileNum) {
            alert("Please enter a mobile number.");
            return;
        }

        searchBtn.innerText = "...";
        const q = query(collection(db, "patients"), where("MobileNumber", "==", mobileNum));
        
        try {
            const querySnapshot = await getDocs(q);
            detailsSection.style.display = 'block';

            if (!querySnapshot.empty) {
                // Patient Exists: Auto Fetch Details
                const patientData = querySnapshot.docs[0].data();
                currentPatientId = patientData.PatientID;
                
                patientIdBadge.innerText = `ID: ${currentPatientId}`;
                nameInput.value = patientData.PatientName;
                ageInput.value = patientData.Age;
                genderInput.value = patientData.Gender;
                
                saveBtn.innerText = "Continue to Booking";
                historySection.style.display = 'block';
                // Note: Logic to fetch previous appointments would go here
            } else {
                // New Patient: Prepare for registration
                currentPatientId = `PAT${Date.now().toString().slice(-6)}`; // Auto-generate ID
                
                patientIdBadge.innerText = `ID: ${currentPatientId} (New)`;
                nameInput.value = "";
                ageInput.value = "";
                genderInput.value = "Male";
                
                saveBtn.innerText = "Register & Continue";
                historySection.style.display = 'none';
            }
        } catch (error) {
            console.error("Error searching patient: ", error);
            alert("Search failed.");
        } finally {
            searchBtn.innerText = "Search";
        }
    });

    // Save/Update Patient and Proceed
    saveBtn.addEventListener('click', async () => {
        const mobileNum = searchInput.value.trim();
        
        // If registering a new patient
        if (saveBtn.innerText.includes("Register")) {
            saveBtn.innerText = "Saving...";
            
            const newPatientData = {
                PatientID: currentPatientId,
                MobileNumber: mobileNum,
                PatientName: nameInput.value,
                Age: ageInput.value,
                Gender: genderInput.value,
                CreatedAt: serverTimestamp()
            };

            try {
                await addDoc(collection(db, "patients"), newPatientData);
                alert("Patient Registered!");
                // Store ID in sessionStorage to pass to the booking screen
                sessionStorage.setItem("activePatientID", currentPatientId);
                window.location.href = "booking.html";
            } catch (error) {
                console.error("Error saving patient: ", error);
                alert("Failed to save patient.");
                saveBtn.innerText = "Register & Continue";
            }
        } else {
            // Patient already exists, just proceed
            sessionStorage.setItem("activePatientID", currentPatientId);
            window.location.href = "booking.html";
        }
    });
});
