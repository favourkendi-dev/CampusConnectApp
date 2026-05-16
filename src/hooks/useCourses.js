import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, increment } from '../firebase/config';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToCourses = useCallback(() => {
    const q = query(collection(db, 'courses'), orderBy('rating', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToReviews = useCallback((courseId) => {
    if (!courseId) return;
    const q = query(
      collection(db, 'courseReviews'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addCourse = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...data,
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addReview = async (courseId, userId, rating, review, tags = []) => {
    try {
      await addDoc(collection(db, 'courseReviews'), {
        courseId,
        userId,
        rating,
        review,
        tags,
        helpful: 0,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'courses', courseId), {
        rating: increment(rating),
        reviewCount: increment(1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const markReviewHelpful = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'courseReviews', reviewId), {
        helpful: increment(1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    courses,
    reviews,
    loading,
    subscribeToCourses,
    subscribeToReviews,
    addCourse,
    addReview,
    markReviewHelpful,
  };
};