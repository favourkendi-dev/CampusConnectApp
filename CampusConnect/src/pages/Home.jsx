import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon, Search, MessageCircle, Bell, User, BookOpen, Calendar, 
  ShoppingBag, Users, LogOut, Wifi, Heart, TrendingUp, Zap, 
  ChevronRight, Flame, Snowflake, Sun, Wind, MoreHorizontal,
  Send, Image, X, Smile, MapPin, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from "../hooks/useFirestore";
import CreatePost from '../components/social/CreatePost';
import PostCard from '../components/social/PostCard';
import { db } from '../firebase/config';
import { 
  collection, query, where, orderBy, limit, onSnapshot, 
  doc, getDoc, updateDoc, increment, serverTimestamp, 
  Timestamp, getDocs
} from 'firebase/firestore';

// ===== REAL FIRESTORE HOOKS FOR SIDEBAR =====

const useActiveNow = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fiveMinutesAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
    const q = query(
      collection(db, 'users'),
      where('lastActive', '>=', fiveMinutesAgo)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
    }, (err) => {
      console.error('ActiveNow error:', err);
      setCount(0);
    });

    return unsub;
  }, []);

  return count;
};

const useCampusPulse = () => {
  const [pulse, setPulse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pulseRef = doc(db, 'campusPulse', 'current');
    const unsub = onSnapshot(pulseRef, (docSnap) => {
      if (docSnap.exists()) {
        setPulse({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }, (err) => {
      console.error('CampusPulse error:', err);
      setLoading(false);
    });

    return unsub;
  }, []);

  const vote = useCallback(async (optionIndex) => {
    try {
      const pulseRef = doc(db, 'campusPulse', 'current');
      const field = `votes.${optionIndex}`;
      await updateDoc(pulseRef, {
        [field]: increment(1)
      });
    } catch (err) {
      console.error('Vote error:', err);
    }
  }, []);

  return { pulse, loading, vote };
};

const useStudyTip = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomTip = async () => {
      try {
        const tipsRef = collection(db, 'studyTips');
        const snapshot = await getDocs(tipsRef);
        if (!snapshot.empty) {
          const tips = snapshot.docs.map(d => d.data().text);
          const random = tips[Math.floor(Math.random() * tips.length)];
          setTip(random);
        }
      } catch (err) {
        console.error('StudyTip error:', err);
        setTip('Take regular breaks to improve focus and retention.');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomTip();
  }, []);

  return { tip, loading };
};

const useTrending = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const hashtagCounts = {};
      snapshot.docs.forEach(doc => {
        const content = doc.data().content || '';
        const hashtags = content.match(/#\w+/g) || [];
        hashtags.forEach(tag => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      });

      const sorted = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      setTrending(sorted);
    }, (err) => {
      console.error('Trending error:', err);
      setTrending([]);
    });

    return unsub;
  }, []);

  return trending;
};

const useUserHeartbeat = (userId) => {
  useEffect(() => {
    if (!userId) return;

    const updateHeartbeat = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
          isOnline: true
        });
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    };

    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 30000);

    return () => {
      clearInterval(interval);
      const userRef = doc(db, 'users', userId);
      updateDoc(userRef, { isOnline: false }).catch(() => {});
    };
  }, [userId]);
};

// ===== COMPONENT =====

const Home = () => {
  const { user, logout } = useAuth();
  const { posts, loading: postsLoading, createPost, likePost, unlikePost, deletePost, updatePost } = usePosts();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Real sidebar data
  const activeNowCount = useActiveNow();
  const { pulse: campusPulse, loading: pulseLoading, vote: votePulse } = useCampusPulse();
  const { tip: studyTip, loading: tipLoading } = useStudyTip();
  const trendingTopics = useTrending();

  // Heartbeat for online status
  useUserHeartbeat(user?.uid);

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLike = async (postId, userId) => {
    try {
      await likePost(postId, userId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = async (postId, userId) => {
    try {
      await unlikePost(postId, userId);
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleUpdate = async (postId, newContent) => {
    try {
      await updatePost(postId, { content: newContent });
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'academic') return post.category === 'academic' || post.tags?.includes('academic');
    if (activeTab === 'social') return post.category === 'social' || post.tags?.includes('social');
    if (activeTab === 'marketplace') return post.category === 'marketplace' || post.tags?.includes('marketplace');
    return true;
  });

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', path: '/' },
    { id: 'explore', icon: Search, label: 'Explore', path: '/explore' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/chat' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
    { id: 'profile', icon: User, label: 'Profile', path: `/profile/${user?.uid}` },
  ];

  const quickLinks = [
    { icon: BookOpen, label: 'Study Groups', path: '/study-groups', color: 'text-primary-600' },
    { icon: Calendar, label: 'Events', path: '/events', color: 'text-orange-500' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace', color: 'text-green-500' },
    { icon: Users, label: 'Clubs', path: '/clubs', color: 'text-purple-500' },
  ];

  const getPulseIcon = (index) => {
    const icons = [Snowflake, Flame, Sun, Wind];
    const Icon = icons[index % icons.length];
    const colors = ['text-blue-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];
    return <Icon className={`w-4 h-4 ${colors[index % colors.length]}`} />;
  };

  const getTotalVotes = () => {
    if (!campusPulse?.votes) return 0;
    return Object.values(campusPulse.votes).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              CampusConnect
            </h1>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts, people, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <Link to={`/profile/${user?.uid}`} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=4F46E5&color=fff`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.displayName?.split(' ')[0]}</span>
            </Link>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block space-y-4">
            {/* User Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=4F46E5&color=fff`}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div>
                  <h3 className="font-semibold text-slate-900">{user?.displayName}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-bold text-primary-600">{posts.filter(p => p.userId === user?.uid).length}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Posts</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-bold text-primary-600">1.2k</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Followers</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-bold text-primary-600">856</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Following</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.id === 'home'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full mt-1"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Quick Links</h3>
              <div className="space-y-1">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <link.icon className={`w-5 h-5 ${link.color}`} />
                    {link.label}
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="space-y-6">
            {/* Stories */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Stories</h2>
                <button className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <img
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=4F46E5&color=fff`}
                        alt="Your story"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-600">Your Story</span>
                </button>
                {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'].map((name, i) => (
                  <button key={name} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
                    <div className={`w-16 h-16 rounded-full p-[2px] ${i % 2 === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-slate-200'}`}>
                      <div className="w-full h-full rounded-full bg-white p-[2px]">
                        <img
                          src={`https://ui-avatars.com/api/?name=${name}&background=random`}
                          alt={name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-600">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post - KEPT EXACTLY AS IS */}
            <CreatePost onSubmit={handleCreatePost} />

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'academic', 'social', 'marketplace'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Posts Feed - KEPT EXACTLY AS IS */}
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-500 mb-4">Be the first to share something with your campus!</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
                >
                  Create Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar - REAL DATA */}
          <aside className="hidden lg:block space-y-4">
            {/* Active Now - REAL */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-600" />
                  Active Now
                </h3>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 py-3">
                <span className="text-3xl font-bold text-slate-900">{activeNowCount}</span>
                <span className="text-sm text-slate-500">students online</span>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {[40, 60, 80, 65, 90, 55, 75, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-[5px] rounded-sm bg-primary-500/20"
                    style={{ height: `${h * 0.3}px` }}
                  >
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Pulse - REAL */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <h3 className="font-semibold text-slate-900">Campus Pulse</h3>
              </div>
              
              {pulseLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                </div>
              ) : campusPulse ? (
                <>
                  <p className="text-sm text-slate-600 mb-3 font-medium">{campusPulse.question}</p>
                  <div className="space-y-2">
                    {campusPulse.options?.map((option, index) => {
                      const total = getTotalVotes();
                      const votes = campusPulse.votes?.[index] || 0;
                      const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => votePulse(index)}
                          className="w-full text-left group"
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              {getPulseIcon(index)}
                              {option}
                            </span>
                            <span className="font-medium text-slate-900">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500/10 to-primary-500/30 rounded-full transition-all duration-500 group-hover:from-primary-500/20 group-hover:to-primary-500/40"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">{votes} votes</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center">{getTotalVotes()} total votes • Click to vote</p>
                </>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No active poll</p>
              )}
            </div>

            {/* Study Tip - REAL */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 border border-primary-100">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary-600" />
                <h3 className="font-semibold text-primary-900">Study Tip</h3>
              </div>
              {tipLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                </div>
              ) : (
                <p className="text-sm text-primary-800 leading-relaxed">{studyTip}</p>
              )}
            </div>

            {/* Trending - REAL */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-slate-900">Trending</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.length > 0 ? (
                  trendingTopics.map((topic, index) => (
                    <div key={topic.tag} className="flex items-center gap-3 group cursor-pointer">
                      <span className={`text-sm font-bold w-5 ${
                        index === 0 ? 'text-amber-500' : 
                        index === 1 ? 'text-slate-400' : 
                        index === 2 ? 'text-orange-400' : 'text-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
                          {topic.tag}
                        </p>
                        <p className="text-xs text-slate-400">{topic.count} posts</p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-2">No trending topics yet</p>
                )}
              </div>
            </div>

            {/* WiFi Status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Campus WiFi</span>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">Excellent</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 mt-2">92% signal strength</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;