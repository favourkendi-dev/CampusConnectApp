import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, increment } from '../firebase/config';

export const useTutoring = () => {
  const [tutors, setTutors] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToTutors = useCallback(() => {
    const q = query(collection(db, 'tutors'), orderBy('rating', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTutors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToMyListings = useCallback((userId) => {
    if (!userId) return;
    const q = query(
      collection(db, 'tutors'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyListings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addTutorListing = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'tutors'), {
        ...data,
        rating: 0,
        reviewCount: 0,
        sessions: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const bookSession = async (tutorId, studentId, sessionData) => {
    try {
      await addDoc(collection(db, 'tutoringSessions'), {
        tutorId,
        studentId,
        ...sessionData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addReview = async (tutorId, rating, review) => {
    try {
      await updateDoc(doc(db, 'tutors', tutorId), {
        rating: increment(rating),
        reviewCount: increment(1),
      });
      await addDoc(collection(db, 'tutorReviews'), {
        tutorId,
        rating,
        review,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    tutors,
    myListings,
    loading,
    subscribeToTutors,
    subscribeToMyListings,
    addTutorListing,
    bookSession,
    addReview,
  };
};