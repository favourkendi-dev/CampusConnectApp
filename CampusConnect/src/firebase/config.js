// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, onSnapshot, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
};

export default app;