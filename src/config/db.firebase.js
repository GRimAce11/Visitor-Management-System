// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8XWRly6wqbbXbccaiDdd2hRmkti-XtiA",
    authDomain: "synce-visitor-management.firebaseapp.com",
    projectId: "synce-visitor-management",
    storageBucket: "synce-visitor-management.appspot.com",
    messagingSenderId: "884700778988",
    appId: "1:884700778988:web:456e5d12ce25244815b0c9",
    measurementId: "G-CCLL2560VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)