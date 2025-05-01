// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4qnwZ49O_2cu8ep5A8UblAVdboeibi5w",
  authDomain: "bookhive-y3-s2-we-204.firebaseapp.com",
  projectId: "bookhive-y3-s2-we-204",
  storageBucket: "bookhive-y3-s2-we-204.appspot.com", 
  messagingSenderId: "850648278103",
  appId: "1:850648278103:web:8a8791f869d19df87f6f12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export default app;
