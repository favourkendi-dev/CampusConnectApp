import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, doc, onSnapshot, updateDoc, increment } from '../firebase/config';

const AchievementContext = createContext(null);

const ACHIEVEMENTS = {
  earlyAdopter: { id: 'earlyAdopter', name: 'Early Adopter', description: 'Joined Campus Connect in the first month', icon: '🚀', points: 100 },
  firstPost: { id: 'firstPost', name: 'First Words', description: 'Published your first post', icon: '📝', points: 50 },
  socialButterfly: { id: 'socialButterfly', name: 'Social Butterfly', description: 'Made 50 friends', icon: '🦋', points: 200 },
  tutorHero: { id: 'tutorHero', name: 'Tutor Hero', description: 'Helped 10 students through tutoring', icon: '🎓', points: 300 },
  noteSharer: { id: 'noteSharer', name: 'Knowledge Keeper', description: 'Shared 20 sets of notes', icon: '📚', points: 250 },
  eventOrganizer: { id: 'eventOrganizer', name: 'Event Organizer', description: 'Created 5 successful events', icon: '🎉', points: 200 },
  streak7: { id: 'streak7', name: 'Week Warrior', description: '7-day login streak', icon: '🔥', points: 100 },
  streak30: { id: 'streak30', name: 'Month Master', description: '30-day login streak', icon: '🔥🔥', points: 500 },
  streak100: { id: 'streak100', name: 'Century Champion', description: '100-day login streak', icon: '🔥🔥🔥', points: 1000 },
  helpfulHand: { id: 'helpfulHand', name: 'Helpful Hand', description: 'Received 50 likes on your posts', icon: '👍', points: 150 },
  campusGuide: { id: 'campusGuide', name: 'Campus Guide', description: 'Answered 20 questions in study groups', icon: '🧭', points: 200 },
  nightOwl: { id: 'nightOwl', name: 'Night Owl', description: 'Posted at 3 AM', icon: '🦉', points: 50 },
  earlyBird: { id: 'earlyBird', name: 'Early Bird', description: 'Posted at 6 AM', icon: '🐦', points: 50 },
  photographer: { id: 'photographer', name: 'Campus Photographer', description: 'Shared 30 photos', icon: '📸', points: 200 },
  debateKing: { id: 'debateKing', name: 'Debate Champion', description: 'Received 100 comments on a single post', icon: '👑', points: 300 },
  mentor: { id: 'mentor', name: 'Mentor', description: 'Mentored 5 students for a full semester', icon: '🌟', points: 500 },
  volunteer: { id: 'volunteer', name: 'Volunteer', description: 'Participated in 10 campus volunteer events', icon: '🤝', points: 300 },
  athlete: { id: 'athlete', name: 'Campus Athlete', description: 'Joined 5 sports-related groups', icon: '⚽', points: 150 },
  artist: { id: 'artist', name: 'Creative Soul', description: 'Shared 10 artworks or creative projects', icon: '🎨', points: 200 },
  musician: { id: 'musician', name: 'Campus Musician', description: 'Shared 5 music performances', icon: '🎵', points: 200 },
  writer: { id: 'writer', name: 'Campus Writer', description: 'Wrote 20 long-form posts', icon: '✍️', points: 250 },
  researcher: { id: 'researcher', name: 'Researcher', description: 'Shared 5 research papers or findings', icon: '🔬', points: 300 },
  entrepreneur: { id: 'entrepreneur', name: 'Entrepreneur', description: 'Sold 20 items on marketplace', icon: '💼', points: 250 },
  connector: { id: 'connector', name: 'Connector', description: 'Introduced 10 people who became friends', icon: '🔗', points: 200 },
};

export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(0);

  const subscribeToAchievements = useCallback((userId) => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, 'achievements', userId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAchievements(data.earned || []);
        setPoints(data.points || 0);
      } else {
        setAchievements([]);
        setPoints(0);
      }
    });

    return unsubscribe;
  }, []);

  const earnAchievement = async (userId, achievementId) => {
    if (!userId || !ACHIEVEMENTS[achievementId]) return;

    try {
      await updateDoc(doc(db, 'achievements', userId), {
        earned: increment(1),
        points: increment(ACHIEVEMENTS[achievementId].points),
      }, { merge: true });
    } catch (error) {
      console.error('Error earning achievement:', error);
    }
  };

  return (
    <AchievementContext.Provider value={{ achievements, points, subscribeToAchievements, earnAchievement, ACHIEVEMENTS }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};