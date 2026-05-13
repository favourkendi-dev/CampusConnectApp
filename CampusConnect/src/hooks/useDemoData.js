import { useCallback } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../firebase/config';

const DEMO_USERS = [
  { displayName: 'Alice Chen', email: 'alice@university.edu', major: 'Computer Science', year: '2026', bio: 'Coffee addict & code enthusiast' },
  { displayName: 'Marcus Johnson', email: 'marcus@university.edu', major: 'Mechanical Engineering', year: '2025', bio: 'Building things that move' },
  { displayName: 'Priya Sharma', email: 'priya@university.edu', major: 'Biology', year: '2027', bio: 'Future doctor in training' },
  { displayName: 'James Wilson', email: 'james@university.edu', major: 'Economics', year: '2026', bio: 'Stock market nerd' },
  { displayName: 'Sofia Rodriguez', email: 'sofia@university.edu', major: 'Psychology', year: '2025', bio: 'Understanding the human mind' },
];

const DEMO_POSTS = [
  { content: 'Anyone want to form a study group for CS 101? 📚', likes: 12, comments: 5 },
  { content: 'The dining hall has amazing pasta today! 🍝', likes: 8, comments: 3 },
  { content: 'Looking for a roommate for next semester. DM me!', likes: 15, comments: 7 },
  { content: 'Just finished my finals! Who\'s ready for summer break? ☀️', likes: 45, comments: 12 },
  { content: 'Selling my old calculus textbook - $20, barely used!', likes: 3, comments: 2 },
];

const DEMO_EVENTS = [
  { title: 'Spring Festival', description: 'Annual campus celebration with food, music, and games!', location: 'Main Quad', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { title: 'Career Fair', description: 'Meet recruiters from top companies', location: 'Student Center', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { title: 'Hackathon 2026', description: '48-hour coding competition with prizes!', location: 'Engineering Building', date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
];

export const useDemoData = () => {
  const seedDemoData = useCallback(async () => {
    try {
      // Seed users
      const userPromises = DEMO_USERS.map((user) =>
        addDoc(collection(db, 'users'), {
          ...user,
          followers: [],
          following: [],
          createdAt: serverTimestamp(),
        })
      );
      const userDocs = await Promise.all(userPromises);

      // Seed posts
      const postPromises = DEMO_POSTS.map((post, index) =>
        addDoc(collection(db, 'posts'), {
          ...post,
          userId: userDocs[index % userDocs.length].id,
          userName: DEMO_USERS[index % DEMO_USERS.length].displayName,
          userPhotoURL: '',
          imageUrl: '',
          shares: 0,
          createdAt: serverTimestamp(),
        })
      );
      await Promise.all(postPromises);

      // Seed events
      const eventPromises = DEMO_EVENTS.map((event) =>
        addDoc(collection(db, 'events'), {
          ...event,
          attendees: [],
          createdBy: userDocs[0].id,
          createdAt: serverTimestamp(),
        })
      );
      await Promise.all(eventPromises);

      return { success: true };
    } catch (error) {
      console.error('Error seeding demo data:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return { seedDemoData };
};