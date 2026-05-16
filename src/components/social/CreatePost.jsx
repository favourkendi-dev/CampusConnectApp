import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ImageUpload } from '../ui/ImageUpload';
import { Image, X, Send } from 'lucide-react';

const CreatePost = ({ onSubmit }) => {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    setIsSubmitting(true);
    await onSubmit({
      content: content.trim(),
      imageUrl,
      userId: user.uid,
      userName: user.displayName || userProfile?.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || userProfile?.photoURL || '',
      likesCount: 0,
      likes: [],
      comments: [],
      shares: 0,
    });

    setContent('');
    setImageUrl('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex gap-3">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=4F46E5&color=fff`}
          alt="Your profile"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind, student?"
            rows={3}
            className="w-full px-3 py-2 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          {imageUrl && (
            <div className="relative mt-2 inline-block">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="rounded-lg max-h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <ImageUpload
                onUpload={(url) => setImageUrl(url)}
                onUploadStart={() => setIsUploading(true)}
                onUploadEnd={() => setIsUploading(false)}
              >
                <button
                  type="button"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Image className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Add Photo'}
                </button>
              </ImageUpload>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (!content.trim() && !imageUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;