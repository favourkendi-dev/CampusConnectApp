export const extractKeywords = (text) => {
  const commonWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while']);
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const frequency = {};
  
  words.forEach((word) => {
    if (!commonWords.has(word) && word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

export const suggestHashtags = (text) => {
  const keywords = extractKeywords(text);
  return keywords.map((kw) => `#${kw.charAt(0).toUpperCase() + kw.slice(1)}`);
};

export const generateSummary = (text, maxLength = 150) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let summary = '';
  
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence;
    } else {
      break;
    }
  }
  
  return summary || text.substring(0, maxLength) + '...';
};

export const sentimentAnalysis = (text) => {
  const positiveWords = ['good', 'great', 'awesome', 'love', 'happy', 'excited', 'amazing', 'fantastic', 'excellent', 'wonderful', 'best', 'perfect', 'beautiful', 'fun', 'enjoy'];
  const negativeWords = ['bad', 'terrible', 'hate', 'sad', 'angry', 'awful', 'worst', 'horrible', 'disappointing', 'boring', 'difficult', 'hard', 'stress', 'worried', 'frustrated'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach((word) => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });
  
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
};