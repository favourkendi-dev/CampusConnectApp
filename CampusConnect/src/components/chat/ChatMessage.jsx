import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, isOwn }) => {
  // Defensive: ensure message exists
  if (!message) return null;

  // Safely get text
  const text = message.text || '';

  // Safely handle createdAt: Firestore Timestamp or JS Date or string or missing
  let timeAgo = 'Just now';
  try {
    const raw = message.createdAt;
    if (raw) {
      // Firestore Timestamp has .toDate()
      const dateObj = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw);
      if (!isNaN(dateObj.getTime())) {
        timeAgo = formatDistanceToNow(dateObj, { addSuffix: true });
      }
    }
  } catch {
    timeAgo = 'Just now';
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{text}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
          {timeAgo}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;