// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMFptCz4x5WUKmRiXE3D1_s4t5HK-GEp4",
  authDomain: "cmbizze-001-stracare.firebaseapp.com",
  projectId: "cmbizze-001-stracare",
  storageBucket: "cmbizze-001-stracare.firebasestorage.app",
  messagingSenderId: "915379470548",
  appId: "1:915379470548:web:0df7473c14a6f24e0e7b41",
  measurementId: "G-5P74VN1BBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
