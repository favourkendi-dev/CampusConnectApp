import { useState } from 'react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';

const StoryRing = ({ stories, user, onView, onReact }) => {
  const [activeStory, setActiveStory] = useState(null);
  const [progress, setProgress] = useState(0);

  const hasUnviewed = stories.some((s) => !s.views?.includes(user?.uid));

  return (
    <>
      <button
        onClick={() => {
          if (stories.length > 0) {
            setActiveStory(0);
            onView(stories[0].id);
          }
        }}
        className="flex flex-col items-center gap-1 min-w-[72px]"
      >
        <div className={`w-16 h-16 rounded-full p-[3px] ${
          hasUnviewed 
            ? 'bg-gradient-to-tr from-secondary-500 via-primary-500 to-accent-500' 
            : 'bg-gray-200'
        }`}>
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=4F46E5&color=fff`}
            alt={user?.displayName}
            className="w-full h-full rounded-full object-cover border-2 border-white"
          />
        </div>
        <span className="text-xs text-gray-600 truncate max-w-[72px]">{user?.displayName}</span>
      </button>

      {activeStory !== null && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Progress bar */}
          <div className="flex gap-1 p-2">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{ width: idx < activeStory ? '100%' : idx === activeStory ? `${progress}%` : '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Story content */}
          <div className="flex-1 flex items-center justify-center relative">
            <img 
              src={stories[activeStory].mediaUrl} 
              alt="Story" 
              className="max-w-full max-h-full object-contain"
            />
            
            <button 
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 p-2 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Reactions */}
          <div className="p-4 flex items-center gap-4">
            <button onClick={() => onReact(stories[activeStory].id, 'heart')} className="p-2 text-white hover:text-red-400">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-2 text-white hover:text-primary-400">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-2 text-white hover:text-primary-400">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryRing;