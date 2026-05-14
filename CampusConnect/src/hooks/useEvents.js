import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, arrayUnion, arrayRemove, increment } from '../firebase/config';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToEvents = useCallback(() => {
    const q = query(
      collection(db, 'events'),
      where('date', '>=', new Date().toISOString()),
      orderBy('date', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToMyEvents = useCallback((userId) => {
    if (!userId) return;
    const q = query(
      collection(db, 'events'),
      where('attendees', 'array-contains', userId),
      orderBy('date', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const createEvent = async (data, userId) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...data,
        createdBy: userId,
        attendees: [],
        attendeeCount: 0,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const rsvpEvent = async (eventId, userId) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayUnion(userId),
        attendeeCount: increment(1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const cancelRsvp = async (eventId, userId) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayRemove(userId),
        attendeeCount: increment(-1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    events,
    myEvents,
    loading,
    subscribeToEvents,
    subscribeToMyEvents,
    createEvent,
    rsvpEvent,
    cancelRsvp,
  };
};