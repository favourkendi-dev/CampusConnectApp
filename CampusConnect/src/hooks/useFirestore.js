import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (postData) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        shares: 0,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePost = async (postId, updatedData) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }
  };

  const likePost = async (postId, userId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
      return { success: true };
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.message };
    }
  };

  const unlikePost = async (postId, userId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
      return { success: true };
    } catch (error) {
      console.error('Error unliking post:', error);
      return { success: false, error: error.message };
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  };

  return { posts, loading, createPost, updatePost, likePost, unlikePost, deletePost };
};

export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateProfile = async (updates) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  return { profile, loading, updateProfile };
};

export const useUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { posts, loading };
};