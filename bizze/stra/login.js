import { app, db } from './firebase-config.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorMessage = document.getElementById('error-message');

    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError("Please enter both email and password.");
            return;
        }

        loginBtn.innerText = "Authenticating...";
        loginBtn.disabled = true;
        errorMessage.style.display = 'none';

        try {
            // 1. Authenticate with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch Role & Branch Permissions from Firestore 'users' collection
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // 3. Store Session Data
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("userRole", userData.Role);     // e.g., "Admin" or "Staff"
                sessionStorage.setItem("userBranch", userData.Branch); // e.g., "All Branches" or "B1"
                sessionStorage.setItem("userName", userData.Name);

                // 4. Redirect to Dashboard
                window.location.href = "index.html";
            } else {
                showError("User record not found in database. Contact administrator.");
                auth.signOut();
            }

        } catch (error) {
            console.error("Login Error: ", error);
            showError("Invalid credentials or network error.");
        } finally {
            loginBtn.innerText = "Secure Login";
            loginBtn.disabled = false;
        }
    });

    function showError(msg) {
        errorMessage.innerText = msg;
        errorMessage.style.display = 'block';
    }
});
