import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: import.meta.VITE_FIREBASE_API_KEY,
    authDomain: "final-project-break.firebaseapp.com",
    projectId: "final-project-break",
    storageBucket: "final-project-break.firebasestorage.app",
    messagingSenderId: "240977211242",
    appId: "1:240977211242:web:a83bb89299f17c54293f13"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
