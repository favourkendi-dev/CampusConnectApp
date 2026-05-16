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
  increment,
} from 'firebase/firestore';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('CreatedAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        CreatedAt: doc.data().CreatedAt?.toDate ? doc.data().CreatedAt.toDate() : new Date(),
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
        likesCount: postData.likesCount ?? 0,
        likes: postData.likes ?? [],
        comments: postData.comments ?? [],
        shares: postData.shares ?? 0,
        CreatedAt: serverTimestamp(),
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
        likesCount: increment(1),
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
        likesCount: increment(-1),
      });
      return { success: true };
    } catch (error) {
      console.error('Error unliking post:', error);
      return { success: false, error: error.message };
    }
  };

  const addComment = async (postId, commentData) => {
    try {
      const commentRef = collection(db, 'posts', postId, 'comments');
      const docRef = await addDoc(commentRef, {
        ...commentData,
        CreatedAt: serverTimestamp(),
      });

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  };

  const getComments = (postId, callback) => {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('CreatedAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        CreatedAt: doc.data().CreatedAt?.toDate?.() || new Date(),
      }));
      callback(comments);
    }, (error) => {
      console.error('Comments listener error:', error);
    });
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

  return { posts, loading, createPost, updatePost, likePost, unlikePost, deletePost, addComment, getComments };
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

  const followUser = async (followerId, targetUserId) => {
    try {
      const targetRef = doc(db, 'users', targetUserId);
      const followerRef = doc(db, 'users', followerId);

      await updateDoc(targetRef, {
        followers: arrayUnion(followerId),
      });
      await updateDoc(followerRef, {
        following: arrayUnion(targetUserId),
      });

      return { success: true };
    } catch (error) {
      console.error('Error following user:', error);
      return { success: false, error: error.message };
    }
  };

  const unfollowUser = async (followerId, targetUserId) => {
    try {
      const targetRef = doc(db, 'users', targetUserId);
      const followerRef = doc(db, 'users', followerId);

      await updateDoc(targetRef, {
        followers: arrayRemove(followerId),
      });
      await updateDoc(followerRef, {
        following: arrayRemove(targetUserId),
      });

      return { success: true };
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return { success: false, error: error.message };
    }
  };

  return { profile, loading, updateProfile, followUser, unfollowUser };
};

export const useUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('CreatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        CreatedAt: doc.data().CreatedAt?.toDate ? doc.data().CreatedAt.toDate() : new Date(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { posts, loading };
};