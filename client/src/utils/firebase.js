import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-8c29f.firebaseapp.com",
  projectId: "interviewiq-8c29f",
  storageBucket: "interviewiq-8c29f.firebasestorage.app",
  messagingSenderId: "821886930316",
  appId: "1:821886930316:web:9fe27dc832f6216d0edaa9",
  measurementId: "G-TD4LQ58VEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
