import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApyg2ZSFpr_7eRQdEkGcyYkpPNlXdUTO0",
  authDomain: "mindease-57a64.firebaseapp.com",
  projectId: "mindease-57a64",
  storageBucket: "mindease-57a64.firebasestorage.app",
  messagingSenderId: "15374807985",
  appId: "1:15374807985:web:5bc338ebc4ec1620498390",
  measurementId: "G-W6ZRQPVW7S",
};

// Initialize Firebase only on the client side to avoid SSR issues
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable Auth persistence
if (typeof window !== 'undefined') {
  // Import and configure auth persistence settings
  import('firebase/auth').then(({ setPersistence, browserLocalPersistence, browserSessionPersistence }) => {
    // We'll set default persistence to local (will be overridden on signIn if remember me is not checked)
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  });
}

export { app, auth, db, storage };