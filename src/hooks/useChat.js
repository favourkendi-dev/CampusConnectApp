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
      console.error('Conversation listener error:', error);
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
    });

    return () => unsubscribe();
  }, [activeConversation?.id]);

  const startConversation = useCallback(async (participantIds) => {
    try {
      const sortedIds = [...participantIds].sort();

      // Check if conversation already exists
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
        const matchData = { id: match.id, ...match.data() };
        setActiveConversation(matchData);
        return { success: true, conversation: matchData };
      }

      // Create new conversation
      const docRef = await addDoc(collection(db, 'conversations'), {
        participants: sortedIds,
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        lastMessage: '',
      });

      const newConvo = {
        id: docRef.id,
        participants: sortedIds,
        lastMessage: '',
        lastMessageTime: new Date(),
      };
      setActiveConversation(newConvo);

      return { success: true, conversation: newConvo };
    } catch (error) {
      console.error('Error starting conversation:', error);
      return { success: false, error: error.message };
    }
  }, [currentUserId]);

  const sendMessage = useCallback(async (conversationId, text) => {
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
  }, [currentUserId]);

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