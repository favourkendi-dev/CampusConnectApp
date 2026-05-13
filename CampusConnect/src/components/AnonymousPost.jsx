import { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AnonymousPost = ({ post, onLike, onReport, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  // Generate consistent random avatar based on post ID
  const avatarColors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600'];
  const avatarIndex = post.id.charCodeAt(0) % avatarColors.length;
  const avatarClass = avatarColors[avatarIndex];

  return (
    <div className="card mb-4">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${avatarClass}`}>
            <span className="font-bold text-lg">?</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Anonymous Student</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </span>
                <button
                  onClick={() => onReport(post.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>

            {post.isSensitive && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                ⚠️ This post contains sensitive content
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes + (isLiked ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.replies?.length || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {showReplies && (
          <div className="mt-4 pl-13 border-t border-gray-100 pt-3">
            {post.replies?.map((reply, idx) => (
              <div key={idx} className="flex gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColors[(idx + 1) % avatarColors.length]}`}>
                  <span className="font-bold text-sm">?</span>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                  <p className="text-sm text-gray-700">{reply.content}</p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply anonymously..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onReply(post.id, replyText.trim());
                    setReplyText('');
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousPost;