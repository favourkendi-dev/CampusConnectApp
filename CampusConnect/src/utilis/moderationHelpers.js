const PROFANITY_PATTERNS = [
  /\b(f+u+c+k+)\b/i,
  /\b(s+h+i+t+)\b/i,
  /\b(a+s+s+h+o+l+e+)\b/i,
  /\b(b+i+t+c+h+)\b/i,
  /\b(d+a+m+n+)\b/i,
  /\b(h+e+l+l+)\b/i,
  /\b(c+r+a+p+)\b/i,
  /\b(p+i+s+s+)\b/i,
];

const SPAM_PATTERNS = [
  /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
  /(.)\1{10,}/i, // Repeated characters
  /[A-Z]{20,}/, // All caps
];

export const checkProfanity = (text) => {
  const violations = [];
  PROFANITY_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(text)) {
      violations.push({ type: 'profanity', severity: 'medium', match: text.match(pattern)?.[0] });
    }
  });
  return violations;
};

export const checkSpam = (text) => {
  const violations = [];
  SPAM_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      violations.push({ type: 'spam', severity: 'high', match: 'Pattern match' });
    }
  });
  return violations;
};

export const moderateContent = (text) => {
  const profanity = checkProfanity(text);
  const spam = checkSpam(text);
  const allViolations = [...profanity, ...spam];
  
  return {
    isClean: allViolations.length === 0,
    violations: allViolations,
    action: allViolations.some((v) => v.severity === 'high') ? 'block' : 
            allViolations.length > 0 ? 'flag' : 'allow',
  };
};

export const generateContentWarning = (violations) => {
  const types = [...new Set(violations.map((v) => v.type))];
  return `This content may contain: ${types.join(', ')}. Proceed with caution.`;
};