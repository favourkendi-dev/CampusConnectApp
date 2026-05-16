export const calculateLevel = (karma) => {
  return Math.floor(Math.sqrt(karma / 100)) + 1;
};

export const getLevelTitle = (level) => {
  const titles = [
    'New Student', 'Campus Novice', 'Active Learner', 'Engaged Scholar',
    'Campus Regular', 'Social Butterfly', 'Campus Leader', 'Senior Student',
    'Campus Legend', 'University Icon',
  ];
  return titles[Math.min(level - 1, titles.length - 1)] || 'Campus God';
};

export const getNextLevelProgress = (karma) => {
  const currentLevel = calculateLevel(karma);
  const currentThreshold = Math.pow(currentLevel - 1, 2) * 100;
  const nextThreshold = Math.pow(currentLevel, 2) * 100;
  const progress = ((karma - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const getStreakMultiplier = (streak) => {
  if (streak >= 100) return 3;
  if (streak >= 30) return 2.5;
  if (streak >= 7) return 2;
  if (streak >= 3) return 1.5;
  return 1;
};

export const checkAchievementEligibility = (userStats, achievementId) => {
  const requirements = {
    streak7: (stats) => stats.streak >= 7,
    streak30: (stats) => stats.streak >= 30,
    streak100: (stats) => stats.streak >= 100,
    firstPost: (stats) => stats.posts >= 1,
    socialButterfly: (stats) => stats.friends >= 50,
    tutorHero: (stats) => stats.tutoringSessions >= 10,
    noteSharer: (stats) => stats.notesShared >= 20,
    eventOrganizer: (stats) => stats.eventsCreated >= 5,
    helpfulHand: (stats) => stats.totalLikes >= 50,
    campusGuide: (stats) => stats.answersGiven >= 20,
    photographer: (stats) => stats.photosShared >= 30,
    debateKing: (stats) => stats.maxCommentsOnPost >= 100,
    legend: (stats) => stats.karma >= 5000,
  };

  return requirements[achievementId]?.(userStats) || false;
};