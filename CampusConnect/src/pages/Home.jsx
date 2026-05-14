import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import StoryRing from '../components/social/StoryRing';
import InfiniteScroll from '../components/social/InfiniteScroll';
import { usePosts } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { TrendingUp, Users, BookOpen, BarChart3, Flame, Wifi, WifiOff } from 'lucide-react';

const Home = () => {
  const { posts, loading, createPost, likePost, unlikePost, deletePost, updatePost } = usePosts();
  const { user } = useAuth();
  const [stories, setStories] = useState([]);

  // REAL-TIME CONNECTIVITY STATE
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Trending State (Mocked initially, ready for Firestore sync)
  const [trending, setTrending] = useState([
    { id: 1, tag: "#ExamSeason", count: 156, hot: true },
    { id: 2, tag: "MainCafeteria", count: 89, hot: false }
  ]);

  useEffect(() => {
    // 1. Connectivity Listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Fetch Stories
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

    // 3. Real-Time Trending Listener
    const qTrending = query(collection(db, "trending"), orderBy("count", "desc"), limit(5));
    const unsubTrending = onSnapshot(qTrending, (snapshot) => {
      if (!snapshot.empty) {
        setTrending(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubTrending();
    };
  }, []);

  const handleViewStory = (storyId) => console.log("Viewed story:", storyId);
  const handleReactStory = (storyId, reaction) => console.log("Reacted:", storyId, reaction);
  const handleCreatePost = async (postData) => await createPost(postData);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR: Stats + Pulse + Connectivity */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Quick Stats
            </h3>
            <div className="space-y-3">
              {/* REAL CONNECTIVITY INDICATOR */}
              <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'Live' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500">Active Now</span>
                <span className="font-bold text-indigo-600">42 Students</span>
              </div>
            </div>
          </div>

          {/* Campus Pulse (Interactive UI) */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Campus Pulse
            </h3>
            <p className="text-xs text-indigo-100 mb-4 font-medium">How are the library vibes right now?</p>
            <div className="space-y-2">
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs transition-all text-left px-3">
                ❄️ Freezing
              </button>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs transition-all text-left px-3">
                🔥 Perfect
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Stories + Feed */}
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
                    onLike={(postId, uid) => likePost(postId, uid)}
                    onUnlike={(postId, uid) => unlikePost(postId, uid)}
                    onDelete={(postId) => deletePost(postId)}
                    onUpdate={(postId, newContent) => updatePost(postId, { content: newContent })}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>

        {/* RIGHT SIDEBAR: Trending */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Trending Now
            </h3>
            <div className="space-y-5">
              {trending.map((topic) => (
                <div key={topic.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {topic.tag.startsWith('#') ? topic.tag : `#${topic.tag}`}
                    </p>
                    {topic.hot && (
                      <Flame className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{topic.count} students talking</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 pt-3 border-t border-gray-50 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">
              Explore More
            </button>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2">
               <BookOpen className="w-3 h-3" /> Study Tip
            </h4>
            <p className="text-[11px] text-indigo-700 mt-2 leading-relaxed">
              Quiet floors 4 & 5 in the library are 80% less crowded on Tuesday mornings.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;