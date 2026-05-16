export const KEYBOARD_SHORTCUTS = {
  'ctrl+k': 'focusSearch',
  'ctrl+n': 'newPost',
  'ctrl+m': 'openMessages',
  'ctrl+h': 'goHome',
  'ctrl+e': 'goExplore',
  'ctrl+p': 'goProfile',
  'ctrl+shift+d': 'toggleDarkMode',
  'esc': 'closeModal',
  '/': 'focusSearch',
  'j': 'nextPost',
  'k': 'previousPost',
  'l': 'likePost',
  'c': 'commentPost',
  'r': 'replyMessage',
};

export const getShortcutDescription = (action) => {
  const descriptions = {
    focusSearch: 'Focus search bar',
    newPost: 'Create new post',
    openMessages: 'Open messages',
    goHome: 'Go to home',
    goExplore: 'Go to explore',
    goProfile: 'Go to profile',
    toggleDarkMode: 'Toggle dark mode',
    closeModal: 'Close modal',
    nextPost: 'Next post',
    previousPost: 'Previous post',
    likePost: 'Like current post',
    commentPost: 'Comment on current post',
    replyMessage: 'Reply to message',
  };
  return descriptions[action] || action;
};