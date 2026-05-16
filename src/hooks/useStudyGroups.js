import { useState, useEffect, useCallback } from 'react';
import { db, collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, arrayUnion, arrayRemove, serverTimestamp } from '../firebase/config';

export const useStudyGroups = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscribeToAllGroups = useCallback(() => {
    const q = query(collection(db, 'studyGroups'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudyGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const subscribeToMyGroups = useCallback((userId) => {
    if (!userId) return;
    const q = query(
      collection(db, 'studyGroups'),
      where('members', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const createGroup = async (data, userId) => {
    try {
      const docRef = await addDoc(collection(db, 'studyGroups'), {
        ...data,
        creatorId: userId,
        members: [userId],
        messages: [],
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const joinGroup = async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'studyGroups', groupId), {
        members: arrayUnion(userId),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const leaveGroup = async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'studyGroups', groupId), {
        members: arrayRemove(userId),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendMessage = async (groupId, userId, text) => {
    try {
      await updateDoc(doc(db, 'studyGroups', groupId), {
        messages: arrayUnion({
          userId,
          text,
          createdAt: new Date().toISOString(),
        }),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    studyGroups,
    myGroups,
    loading,
    subscribeToAllGroups,
    subscribeToMyGroups,
    createGroup,
    joinGroup,
    leaveGroup,
    sendMessage,
  };
};