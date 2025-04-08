import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "final-project-break.firebaseapp.com",
    projectId: "final-project-break",
    storageBucket: "final-project-break.appspot.com",
    messagingSenderId: "240977211242",
    appId: "1:240977211242:web:a83bb89299f17c54293f13"
};

export const app = initializeApp(firebaseConfig);