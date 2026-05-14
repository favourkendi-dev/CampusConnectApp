import { createContext, useContext, useState, useEffect } from 'react';
// FIXED: Pull ONLY initialized instances from your config
import { auth, db } from '../firebase/config';
// FIXED: Core Auth functions come from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth';
// FIXED: Core Firestore functions come from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch additional user profile data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create default profile if doesn't exist
            setUserProfile({
              displayName: firebaseUser.displayName || 'Student',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL || '',
              bio: '',
              university: '',
              major: '',
              year: '',
              followers: [],
              following: [],
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};