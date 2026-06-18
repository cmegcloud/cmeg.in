import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    // Security check: Only allow Admins to access Settings
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Admin") {
        alert("Access Denied: Only Administrators can view or modify Settings.");
        window.location.href = "index.html";
        return;
    }

    // Tab Switching Logic
    const pills = document.querySelectorAll('.settings-nav .pill');
    const panels = document.querySelectorAll('.settings-panel');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active pill
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Show corresponding panel
            const targetId = pill.getAttribute('data-target');
            panels.forEach(panel => {
                panel.style.display = panel.id === targetId ? 'block' : 'none';
            });
        });
    });

    // Load Existing Company Data
    const companyDocRef = doc(db, "settings", "company_profile");
    try {
        const docSnap = await getDoc(companyDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('setting-company-name').value = data.CompanyName || "";
            document.getElementById('setting-company-email').value = data.SupportEmail || "";
            document.getElementById('setting-company-address').value = data.Address || "";
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }

    // Save Company Data
    const saveBtn = document.getElementById('save-company-btn');
    saveBtn.addEventListener('click', async () => {
        const companyName = document.getElementById('setting-company-name').value;
        const companyEmail = document.getElementById('setting-company-email').value;
        const companyAddress = document.getElementById('setting-company-address').value;

        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;

        try {
            // Use setDoc with merge: true to update or create the document without overwriting other fields
            await setDoc(companyDocRef, {
                CompanyName: companyName,
                SupportEmail: companyEmail,
                Address: companyAddress,
                UpdatedAt: new Date()
            }, { merge: true });
            
            alert("Company settings updated successfully!");
        } catch (error) {
            console.error("Error saving settings: ", error);
            alert("Failed to save settings.");
        } finally {
            saveBtn.innerText = "Save Changes";
            saveBtn.disabled = false;
        }
    });
});
