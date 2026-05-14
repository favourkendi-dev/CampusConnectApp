import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';


export const useChat = (currentUserId) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to user's conversations
  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUserId),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastMessageTime: doc.data().lastMessageTime?.toDate?.() || new Date(),
      }));
      setConversations(convos);
      setLoading(false);
    }, (error) => {
      // Handle snapshot errors gracefully instead of crashing
      console.error('Conversation listener error:', error);
      if (error.code === 'failed-precondition') {
        console.error(
          'Missing Firestore index. Create a composite index on: ' +
          'conversations -> participants (Arrays) + lastMessageTime (Desc)'
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // Listen to messages in active conversation
  useEffect(() => {
    if (!activeConversation?.id) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'conversations', activeConversation.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setMessages(msgs);
    }, (error) => {
      console.error('Messages listener error:', error);
    });

    return () => unsubscribe();
  }, [activeConversation?.id]);

  const startConversation = async (participantIds) => {
    try {
      const sortedIds = [...participantIds].sort();

      // FIX: array-contains-any to find conversations where current user
      // is a participant, then filter client-side for exact match.
      // Firestore doesn't support exact array equality matching.
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUserId)
      );
      const existing = await getDocs(q);

      const match = existing.docs.find((doc) => {
        const participants = doc.data().participants || [];
        return (
          participants.length === sortedIds.length &&
          sortedIds.every((id) => participants.includes(id))
        );
      });

      if (match) {
        setActiveConversation({ id: match.id, ...match.data() });
        return { success: true, id: match.id };
      }

      const docRef = await addDoc(collection(db, 'conversations'), {
        participants: sortedIds,
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        lastMessage: '',
      });

      setActiveConversation({
        id: docRef.id,
        participants: sortedIds,
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error starting conversation:', error);
      return { success: false, error: error.message };
    }
  };

  const sendMessage = async (conversationId, text) => {
    try {
      await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          text,
          senderId: currentUserId,
          createdAt: serverTimestamp(),
          read: false,
        }
      );

      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    loading,
    startConversation,
    sendMessage,
  };
};