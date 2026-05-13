import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageCircle, Share2, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onLike, onUnlike, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const isLiked = post.likes?.includes(user?.uid);
  const isOwner = post.userId === user?.uid;

  // Helper to handle Firebase Timestamps or standard Dates
  const getFormattedDate = (dateValue) => {
    try {
      if (!dateValue) return 'Just now';
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return 'Recently';
    }
  };

  const handleLike = () => {
    if (isLiked) {
      onUnlike(post.id, user.uid);
    } else {
      onLike(post.id, user.uid);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campus Connect Post',
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.userPhotoURL || `https://ui-avatars.com/api/?name=${post.userName}&background=4F46E5&color=fff`}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {post.userName}
            </Link>
            <p className="text-xs text-gray-500">
              {getFormattedDate(post.createdAt)}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                <button
                  onClick={() => {
                    onDelete(post.id);
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="mt-3 rounded-lg w-full object-cover max-h-96"
            loading="lazy"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>{post.shares || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            {post.comments?.map((comment, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 text-xs font-bold">
                    {comment.userName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs font-semibold text-gray-900">{comment.userName}</p>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  setCommentText('');
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;