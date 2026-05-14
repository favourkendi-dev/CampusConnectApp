import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import StoryRing from '../components/social/StoryRing';
import InfiniteScroll from '../components/social/InfiniteScroll';
import { usePosts } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { TrendingUp, Users, BookOpen } from 'lucide-react';

const Home = () => {
  const { posts, loading, createPost, likePost, unlikePost, deletePost, updatePost } = usePosts();
  const { user } = useAuth();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const snap = await getDocs(collection(db, "stories"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };
    fetchStories();
  }, []);

  const handleViewStory = (storyId) => console.log("Viewed story:", storyId);
  const handleReactStory = (storyId, reaction) => console.log("Reacted:", storyId, reaction);
  const handleCreatePost = async (postData) => await createPost(postData);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-4 h-4 text-blue-600" /></div>
                <div><p className="font-medium text-gray-900">1,234 Students</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <StoryRing stories={stories} user={user} onView={handleViewStory} onReact={handleReactStory} />
          <CreatePost onSubmit={handleCreatePost} />
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No posts yet.</p>
            </div>
          ) : (
            <InfiniteScroll fetchMore={() => {}} hasMore={true}>
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onLike={() => likePost(post.id, user.uid)}
                    onUnlike={() => unlikePost(post.id, user.uid)}
                    onDelete={() => deletePost(post.id)}
                    onUpdate={(postId, newContent) => updatePost(postId, { content: newContent })}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trending</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;