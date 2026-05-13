import { useState, useEffect, useCallback } from 'react';
import {
  db,
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
} from '../firebase/config';

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

  const startConversation = async (participantIds) => {
    try {
      // Check if conversation already exists
      const q = query(
        collection(db, 'conversations'),
        where('participants', '==', participantIds.sort())
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        const convo = existing.docs[0];
        setActiveConversation({ id: convo.id, ...convo.data() });
        return { success: true, id: convo.id };
      }

      const docRef = await addDoc(collection(db, 'conversations'), {
        participants: participantIds.sort(),
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        lastMessage: '',
      });

      setActiveConversation({
        id: docRef.id,
        participants: participantIds,
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