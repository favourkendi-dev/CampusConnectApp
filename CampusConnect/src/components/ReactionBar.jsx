import { useState } from 'react';
import { Heart, ThumbsUp, Laugh, Frown, Celebration, Lightbulb } from 'lucide-react';

const REACTIONS = [
  { id: 'like', icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Like' },
  { id: 'love', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', label: 'Love' },
  { id: 'laugh', icon: Laugh, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Haha' },
  { id: 'sad', icon: Frown, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Sad' },
  { id: 'celebrate', icon: Celebration, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Celebrate' },
  { id: 'insightful', icon: Lightbulb, color: 'text-accent-500', bg: 'bg-accent-50', label: 'Insightful' },
];

const ReactionBar = ({ reactions, userReaction, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);

  const getReactionCount = (id) => reactions?.[id] || 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        {REACTIONS.map((reaction) => {
          const count = getReactionCount(reaction.id);
          if (count === 0) return null;

          return (
            <button
              key={reaction.id}
              onClick={() => onReact(reaction.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all ${
                userReaction === reaction.id
                  ? `${reaction.bg} ${reaction.color} ring-2 ring-offset-1 ring-primary-200`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <reaction.icon className="w-4 h-4" />
              <span>{count}</span>
            </button>
          );
        })}

        <button
          onMouseEnter={() => setShowPicker(true)}
          onClick={() => setShowPicker(!showPicker)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
      </div>

      {showPicker && (
        <div 
          className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center gap-1 z-50"
          onMouseLeave={() => setShowPicker(false)}
        >
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => {
                onReact(reaction.id);
                setShowPicker(false);
              }}
              className={`p-2 rounded-full hover:scale-125 transition-transform ${reaction.bg}`}
              title={reaction.label}
            >
              <reaction.icon className={`w-6 h-6 ${reaction.color}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionBar;