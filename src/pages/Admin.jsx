import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  where,
} from 'firebase/firestore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Shield, AlertTriangle, Users, FileText, MessageSquare, TrendingUp, Trash2, Eye, Ban, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Inline AdminStats component
const AdminStats = ({ stats = {} }) => {
  const cards = [
    { label: 'Total Users', value: stats.users || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Posts', value: stats.posts || 0, icon: FileText, color: 'bg-green-500' },
    { label: 'Total Comments', value: stats.comments || 0, icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'Active Today', value: stats.activeToday || 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Inline UserTable component
const UserTable = ({ users = [], onBan = () => {}, onUnban = () => {}, onDelete = () => {} }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4F46E5&color=fff`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">{user.displayName || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                    user.role === 'banned' ? 'bg-gray-100 text-gray-500 line-through' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role || 'student'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.role === 'banned' ? (
                      <button
                        onClick={() => onUnban(user.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Unban"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onBan(user.id)}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Ban"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline PostModeration component
const PostModeration = ({ posts = [], onDelete = () => {} }) => {
  const getFormattedDate = (dateValue) => {
    try {
      if (!dateValue) return 'Just now';
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) { return 'Recently'; }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Post Moderation</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {posts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={post.userPhotoURL || `https://ui-avatars.com/api/?name=${post.userName}&background=4F46E5&color=fff`}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">{post.userName || 'Unknown'}</span>
                  <span className="text-xs text-gray-400">{getFormattedDate(post.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    ❤️ {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {post.comments?.length || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => window.open(`/profile/${post.userId}`, '_blank')}
                  className="p-1 text-gray-400 hover:text-primary-600"
                  title="View Author"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = userProfile?.role === 'admin' || user?.email?.includes('admin');

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      navigate('/');
      return;
    }

    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const postsUnsub = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    const calculateStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const postsSnap = await getDocs(collection(db, 'posts'));

      let totalComments = 0;
      postsSnap.docs.forEach((doc) => {
        totalComments += doc.data().commentsCount || 0;
      });

      setStats({
        users: usersSnap.size,
        posts: postsSnap.size,
        comments: totalComments,
        activeToday: usersSnap.docs.filter((u) => {
          const lastActive = u.data().lastActive?.toDate?.();
          if (!lastActive) return false;
          const hoursSince = (Date.now() - lastActive.getTime()) / 3600000;
          return hoursSince < 24;
        }).length,
      });
      setLoading(false);
    };

    calculateStats();

    return () => {
      usersUnsub();
      postsUnsub();
    };
  }, [isAdmin, authLoading, navigate]);

  const handleBanUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'banned' });
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'student' });
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    try {
      const userPosts = await getDocs(query(collection(db, 'posts'), where('userId', '==', userId)));
      userPosts.docs.forEach(async (p) => {
        await deleteDoc(doc(db, 'posts', p.id));
      });
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You need admin privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage users, moderate content, view analytics</p>
        </div>
      </div>

      <AdminStats stats={stats} />

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'Users' },
          { id: 'posts', label: 'Posts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserTable
            users={users.slice(0, 5)}
            onBan={handleBanUser}
            onUnban={handleUnbanUser}
            onDelete={handleDeleteUser}
          />
          <PostModeration
            posts={posts.slice(0, 5)}
            onDelete={handleDeletePost}
          />
        </div>
      )}

      {activeTab === 'users' && (
        <UserTable
          users={users}
          onBan={handleBanUser}
          onUnban={handleUnbanUser}
          onDelete={handleDeleteUser}
        />
      )}

      {activeTab === 'posts' && (
        <PostModeration
          posts={posts}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

export default Admin;