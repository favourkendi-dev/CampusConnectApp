import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, increment } from '../firebase/config';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [myNotes, setMyNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToNotes = useCallback(() => {
    const q = query(collection(db, 'notes'), orderBy('downloads', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToMyNotes = useCallback((userId) => {
    if (!userId) return;
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const uploadNote = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...data,
        downloads: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const downloadNote = async (noteId) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        downloads: increment(1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const rateNote = async (noteId, rating) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        rating: increment(rating),
        reviewCount: increment(1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    notes,
    myNotes,
    loading,
    subscribeToNotes,
    subscribeToMyNotes,
    uploadNote,
    downloadNote,
    rateNote,
  };
};