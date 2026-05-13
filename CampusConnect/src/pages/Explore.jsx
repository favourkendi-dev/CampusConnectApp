import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy, limit } from '../firebase/config';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Hash } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch trending posts (most liked)
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('likes', 'desc'),
          limit(10)
        );
        const postsSnap = await getDocs(postsQuery);
        setTrendingPosts(postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.major?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students, universities, majors..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary-500" />
            Discover Students
          </h2>
          
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4F46E5&color=fff`}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.displayName}</h3>
                      <p className="text-sm text-gray-500 truncate">{user.university || 'Student'}</p>
                      {user.major && (
                        <p className="text-xs text-primary-600">{user.major}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-gray-500">
                    <span>{user.followers?.length || 0} followers</span>
                    <span>{user.following?.length || 0} following</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Trending Sidebar */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-accent-500" />
            Trending
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
            {trendingPosts.slice(0, 5).map((post, idx) => (
              <div key={post.id} className="flex gap-3">
                <span className="text-2xl font-bold text-primary-200">{idx + 1}</span>
                <div>
                  <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{post.likes?.length || 0} likes</p>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Tags */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#CampusLife', '#StudyTips', '#Events', '#Career', '#Food', '#Sports'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full hover:bg-primary-100 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;