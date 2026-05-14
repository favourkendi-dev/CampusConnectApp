import { useCallback } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../firebase/config';

const DEMO_USERS = [
  { displayName: 'Alex Johnson', email: 'alex@university.edu', major: 'Computer Science', year: '2026', bio: 'CS major who loves hackathons and coffee.', university: 'State University' },
  { displayName: 'Maria Garcia', email: 'maria@university.edu', major: 'Psychology', year: '2025', bio: 'Psychology student interested in cognitive research.', university: 'State University' },
  { displayName: 'James Chen', email: 'james@university.edu', major: 'Engineering', year: '2027', bio: 'Mechanical engineering student and robotics club president.', university: 'State University' },
  { displayName: 'Sarah Williams', email: 'sarah@university.edu', major: 'Biology', year: '2026', bio: 'Pre-med student, loves hiking and volunteering.', university: 'State University' },
  { displayName: 'David Kim', email: 'david@university.edu', major: 'Business', year: '2025', bio: 'Business major with a passion for startups.', university: 'State University' },
  { displayName: 'Emily Brown', email: 'emily@university.edu', major: 'English Literature', year: '2027', bio: 'Writer, poet, and book club organizer.', university: 'State University' },
  { displayName: 'Michael Torres', email: 'michael@university.edu', major: 'Physics', year: '2026', bio: 'Physics enthusiast and amateur astronomer.', university: 'State University' },
  { displayName: 'Lisa Anderson', email: 'lisa@university.edu', major: 'Art History', year: '2025', bio: 'Art lover, museum volunteer, aspiring curator.', university: 'State University' },
  { displayName: 'Ryan Patel', email: 'ryan@university.edu', major: 'Economics', year: '2027', bio: 'Econ major, data nerd, fantasy sports fan.', university: 'State University' },
  { displayName: 'Jessica Lee', email: 'jessica@university.edu', major: 'Nursing', year: '2026', bio: 'Nursing student, future RN, loves helping people.', university: 'State University' },
];

const DEMO_POSTS = [
  { content: 'Anyone want to form a study group for CS 301? The midterm is coming up fast! 📚', likes: 12, comments: 5 },
  { content: 'Just finished my psych research paper! 15 pages later and I need a nap 😴', likes: 8, comments: 3 },
  { content: 'Robotics club meeting today at 6pm in the engineering building! New members welcome 🤖', likes: 23, comments: 7 },
  { content: 'Beautiful day on campus! The cherry blossoms are blooming 🌸', likes: 45, comments: 12 },
  { content: 'Selling my old calculus textbook, $20 OBO. DM me! 📖', likes: 3, comments: 8 },
  { content: 'Who\'s going to the spring concert tonight? 🎵', likes: 18, comments: 15 },
  { content: 'Looking for a roommate for next semester. I\'m clean, quiet, and I cook! 🍳', likes: 6, comments: 4 },
  { content: 'Free pizza at the student center until 2pm! 🍕', likes: 67, comments: 22 },
  { content: 'Just got accepted to the summer research program! So excited! 🎉', likes: 34, comments: 9 },
  { content: 'Does anyone have notes from yesterday\'s biology lecture? I was out sick 🤧', likes: 5, comments: 6 },
];

const DEMO_EVENTS = [
  { title: 'Spring Career Fair', description: 'Meet top employers from tech, finance, and healthcare.', location: 'Student Center Ballroom', date: new Date(Date.now() + 86400000 * 3), category: 'career' },
  { title: 'Midnight Breakfast', description: 'Free breakfast served during finals week!', location: 'Dining Hall A', date: new Date(Date.now() + 86400000 * 7), category: 'social' },
  { title: 'Hackathon 2026', description: '48-hour coding competition with $5000 in prizes.', location: 'Engineering Building', date: new Date(Date.now() + 86400000 * 14), category: 'academic' },
  { title: 'Concert: The Campfire Souls', description: 'Indie folk band performing live on campus.', location: 'Amphitheater', date: new Date(Date.now() + 86400000 * 5), category: 'entertainment' },
  { title: 'Yoga on the Quad', description: 'Free morning yoga session. Mats provided.', location: 'Main Quad', date: new Date(Date.now() + 86400000 * 2), category: 'wellness' },
];

const DEMO_STUDY_GROUPS = [
  { name: 'CS 301 Study Squad', subject: 'Computer Science', description: 'Preparing for algorithms and data structures.', maxMembers: 8 },
  { name: 'Organic Chemistry Warriors', subject: 'Chemistry', description: 'Surviving orgo together.', maxMembers: 6 },
  { name: 'Calculus Crew', subject: 'Mathematics', description: 'Derivatives, integrals, and beyond.', maxMembers: 10 },
  { name: 'Psych Stats Support', subject: 'Psychology', description: 'Helping each other with SPSS and research methods.', maxMembers: 5 },
];

const DEMO_COURSES = [
  { code: 'CS 301', name: 'Algorithms & Data Structures', professor: 'Dr. Smith', rating: 4.2, difficulty: 'Hard', tags: ['Project Heavy', 'Clear Lecturer'] },
  { code: 'PSY 201', name: 'Introduction to Psychology', professor: 'Dr. Johnson', rating: 4.5, difficulty: 'Medium', tags: ['Engaging', 'Fair Grader'] },
  { code: 'BIO 101', name: 'General Biology', professor: 'Dr. Williams', rating: 3.8, difficulty: 'Medium', tags: ['Lab Heavy', 'Tough Exams'] },
  { code: 'ENG 150', name: 'Creative Writing', professor: 'Prof. Brown', rating: 4.7, difficulty: 'Easy', tags: ['Inspirational', 'Feedback Rich'] },
  { code: 'PHY 201', name: 'University Physics I', professor: 'Dr. Chen', rating: 3.5, difficulty: 'Hard', tags: ['Math Heavy', 'Office Hours Helpful'] },
];

export const useDemoData = () => {
  const seedUsers = useCallback(async () => {
    const usersRef = collection(db, 'users');
    for (const user of DEMO_USERS) {
      await addDoc(usersRef, {
        ...user,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=4F46E5&color=fff`,
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
      });
    }
  }, []);

  const seedPosts = useCallback(async (userIds) => {
    const postsRef = collection(db, 'posts');
    for (let i = 0; i < DEMO_POSTS.length; i++) {
      const userId = userIds[i % userIds.length];
      const user = DEMO_USERS.find((u) => u.email === DEMO_USERS[i % DEMO_USERS.length].email);
      await addDoc(postsRef, {
        ...DEMO_POSTS[i],
        userId,
        userName: user?.displayName || 'Anonymous',
        userPhotoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || '')}&background=4F46E5&color=fff`,
        shares: 0,
        createdAt: serverTimestamp(),
      });
    }
  }, []);

  const seedEvents = useCallback(async () => {
    const eventsRef = collection(db, 'events');
    for (const event of DEMO_EVENTS) {
      await addDoc(eventsRef, {
        ...event,
        attendees: [],
        createdBy: 'system',
        createdAt: serverTimestamp(),
      });
    }
  }, []);

  const seedStudyGroups = useCallback(async () => {
    const groupsRef = collection(db, 'studyGroups');
    for (const group of DEMO_STUDY_GROUPS) {
      await addDoc(groupsRef, {
        ...group,
        members: [],
        messages: [],
        createdAt: serverTimestamp(),
      });
    }
  }, []);

  const seedCourses = useCallback(async () => {
    const coursesRef = collection(db, 'courses');
    for (const course of DEMO_COURSES) {
      await addDoc(coursesRef, {
        ...course,
        reviews: [],
        createdAt: serverTimestamp(),
      });
    }
  }, []);

  const seedAll = useCallback(async () => {
    await seedUsers();
    const usersSnap = await getDocs(collection(db, 'users'));
    const userIds = usersSnap.docs.map((d) => d.id);
    await seedPosts(userIds);
    await seedEvents();
    await seedStudyGroups();
    await seedCourses();
  }, [seedUsers, seedPosts, seedEvents, seedStudyGroups, seedCourses]);

  return { seedUsers, seedPosts, seedEvents, seedStudyGroups, seedCourses, seedAll };
};