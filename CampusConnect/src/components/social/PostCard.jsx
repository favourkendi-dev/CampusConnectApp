import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Trash2, MoreHorizontal, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({
  post = {},
  currentUser = {},
  onLike = () => {},
  onUnlike = () => {},
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(post?.content || '');

  const isLiked = post?.likes?.includes(currentUser?.uid);
  const isOwner = post?.userId === currentUser?.uid;

  const getFormattedDate = (dateValue) => {
    try {
      if (!dateValue) return 'Just now';
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) { return 'Recently'; }
  };

  const handleUpdateAction = async () => {
    if (!editValue.trim()) return;
    await onUpdate(post.id, editValue);
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Campus Connect', text: post?.content, url: window.location.href });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post?.id}`);
      alert('Link copied!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post?.userPhotoURL || `https://ui-avatars.com/api/?name=${post?.userName}&background=4F46E5&color=fff`}
            alt="User" className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <Link to={`/profile/${post?.userId}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {post?.userName || 'User'}
            </Link>
            <p className="text-xs text-gray-500">{getFormattedDate(post?.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowOptions(!showOptions)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
                <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { onDelete(post.id); setShowOptions(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setIsEditing(false); setEditValue(post.content); }} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
              <button onClick={handleUpdateAction} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">Save</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 whitespace-pre-wrap">{post?.content || 'No content'}</p>
            {post?.imageUrl && <img src={post.imageUrl} alt="Post" className="mt-3 rounded-lg w-full object-cover max-h-96" />}
          </>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => isLiked ? onUnlike() : onLike()} className={`flex items-center gap-1.5 text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post?.likes?.length || 0}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600">
            <MessageCircle className="w-5 h-5" />
            <span>{post?.comments?.length || 0}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600">
            <Share2 className="w-5 h-5" />
            <span>{post?.shares || 0}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            {post?.comments?.map((comment, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">{comment?.userName?.[0]?.toUpperCase()}</span>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 flex-1">
                  <p className="text-xs font-semibold text-gray-900">{comment?.userName}</p>
                  <p className="text-sm text-gray-700">{comment?.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
            />
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;