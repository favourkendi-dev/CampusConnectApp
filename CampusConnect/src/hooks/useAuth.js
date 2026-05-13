import { useState } from 'react';
import {
  auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  googleProvider,
  db,
  doc,
  setDoc,
  serverTimestamp,
} from '../firebase/config';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    let message = 'An error occurred';
    switch (err.code) {
      case 'auth/email-already-in-use':
        message = 'Email already in use';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed';
        break;
      default:
        message = err.message || 'Authentication failed';
    }
    setError(message);
    setLoading(false);
    return { success: false, error: message };
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return { success: true, user: result.user };
    } catch (err) {
      return handleError(err);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create/update user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });
      
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      return handleError(err);
    }
  };

  const registerWithEmail = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName,
        email,
        photoURL: '',
        bio: '',
        university: '',
        major: '',
        year: '',
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      
      setLoading(false);
      return { success: true, user: result.user };
    } catch (err) {
      return handleError(err);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
      return { success: true };
    } catch (err) {
      return handleError(err);
    }
  };

  return {
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    logout,
    loading,
    error,
    clearError: () => setError(null),
  };
};