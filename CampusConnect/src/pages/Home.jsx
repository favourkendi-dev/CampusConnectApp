import { usePosts } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { TrendingUp, Users, BookOpen } from 'lucide-react';

const Home = () => {
  const { posts, loading, createPost, likePost, unlikePost, deletePost } = usePosts();
  const { user } = useAuth();

  const handleCreatePost = async (postData) => {
    await createPost(postData);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Users className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">1,234 Students</p>
                  <p className="text-xs text-gray-500">Active on campus</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-secondary-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-secondary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">89 Posts</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-accent-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">12 Events</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          <CreatePost onSubmit={handleCreatePost} />
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={likePost}
                  onUnlike={unlikePost}
                  onDelete={deletePost}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {['#CampusLife', '#StudyGroup', '#Graduation2026', '#Hackathon', '#CoffeeBreak'].map((tag) => (
                <button
                  key={tag}
                  className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;