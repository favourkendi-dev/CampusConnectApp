import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp } from '../firebase/config';

export const useMarketplace = () => {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToItems = useCallback((category = null) => {
    let q;
    if (category) {
      q = query(
        collection(db, 'marketplace'),
        where('category', '==', category),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'marketplace'),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToMyItems = useCallback((userId) => {
    if (!userId) return;
    const q = query(
      collection(db, 'marketplace'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const listItem = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'marketplace'), {
        ...data,
        status: 'available',
        views: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const markAsSold = async (itemId) => {
    try {
      await updateDoc(doc(db, 'marketplace', itemId), {
        status: 'sold',
        soldAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    items,
    myItems,
    loading,
    subscribeToItems,
    subscribeToMyItems,
    listItem,
    markAsSold,
  };
};