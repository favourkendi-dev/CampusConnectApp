import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzykkcDmKfuBoSu1RbxfkT3BYKDEXOb6o",
  authDomain: "campusconnectproject-85a21.firebaseapp.com",
  projectId: "campusconnectproject-85a21",
  storageBucket: "campusconnectproject-85a21.firebasestorage.app",
  messagingSenderId: "180650633892",
  appId: "1:180650633892:web:18b8719cc9305dc3cc1431",
  measurementId: "G-YRQ0F0BN56"
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // Analytics blocked or SSR — ignore silently
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;