import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  limit,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  LayoutDashboard,
  FileText,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { format, subDays, startOfWeek, isSameDay } from 'date-fns';

// ===== HOOKS =====

const useCampusStats = () => {
  const [stats, setStats] = useState({
    postsCount: 0,
    totalLikes: 0,
    totalComments: 0,
    studyGroupsJoined: 0,
    eventsAttending: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // All posts count & likes
        const postsQuery = query(collection(db, 'posts'));
        const postsSnap = await getDocs(postsQuery);
        const postsCount = postsSnap.size;
        const totalLikes = postsSnap.docs.reduce(
          (sum, d) => sum + (d.data().likesCount || 0),
          0
        );
        const totalComments = postsSnap.docs.reduce(
          (sum, d) => sum + (d.data().commentsCount || 0),
          0
        );

        // All study groups
        const groupsQuery = query(collection(db, 'studyGroups'));
        const groupsSnap = await getDocs(groupsQuery);

        // All events
        const eventsQuery = query(collection(db, 'events'));
        const eventsSnap = await getDocs(eventsQuery);

        setStats({
          postsCount,
          totalLikes,
          totalComments,
          studyGroupsJoined: groupsSnap.size,
          eventsAttending: eventsSnap.size,
          loading: false,
        });
      } catch (err) {
        console.error('Stats error:', err);
        setStats((s) => ({ ...s, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};

const useWeeklyCampusActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const weekAgo = Timestamp.fromDate(subDays(new Date(), 7));
    const q = query(
      collection(db, 'posts'),
      where('CreatedAt', '>=', weekAgo),
      orderBy('CreatedAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const days = [];
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

      for (let i = 0; i < 7; i++) {
        const day = subDays(new Date(), 6 - i);
        const dayPosts = snapshot.docs.filter((d) => {
          const date = d.data().CreatedAt?.toDate?.();
          return date && isSameDay(date, day);
        });
        days.push({
          day: format(day, 'EEE'),
          posts: dayPosts.length,
          likes: dayPosts.reduce((s, d) => s + (d.data().likesCount || 0), 0),
        });
      }
      setActivity(days);
    });

    return unsub;
  }, []);

  return activity;
};

const useRecentCampusActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('CreatedAt', 'desc'),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        type: 'post',
        content: d.data().content?.substring(0, 60) + '...',
        likes: d.data().likesCount || 0,
        comments: d.data().commentsCount || 0,
        createdAt: d.data().CreatedAt?.toDate?.(),
      }));
      setActivities(items);
    });

    return unsub;
  }, []);

  return activities;
};

const useUpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const now = Timestamp.fromDate(new Date());
    const q = query(
      collection(db, 'events'),
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        date: d.data().date?.toDate?.(),
        location: d.data().location,
        attendees: d.data().attendees?.length || 0,
      }));
      setEvents(items);
    });

    return unsub;
  }, []);

  return events;
};

// ===== COMPONENTS =====

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {subtext && (
        <span className="text-xs font-medium text-slate-400">{subtext}</span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
  </div>
);

const WeeklyChart = ({ data }) => {
  const maxPosts = Math.max(...data.map((d) => d.posts), 1);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-600" />
          Weekly Activity
        </h3>
        <span className="text-xs text-slate-400">Last 7 days</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day) => (
          <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 justify-center items-end h-24">
              <div
                className="w-3 bg-primary-500 rounded-t-md transition-all duration-500"
                style={{ height: `${(day.posts / maxPosts) * 100}%` }}
                title={`${day.posts} posts`}
              />
              <div
                className="w-3 bg-primary-300 rounded-t-md transition-all duration-500"
                style={{ height: `${(day.likes / Math.max(...data.map((d) => d.likes), 1)) * 100}%` }}
                title={`${day.likes} likes`}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{day.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary-500 rounded-sm" /> Posts
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary-300 rounded-sm" /> Likes
        </span>
      </div>
    </div>
  );
};

const RecentActivityList = ({ activities }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary-600" />
        Recent Activity
      </h3>
    </div>
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No recent activity</p>
      ) : (
        activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate">{item.content}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {item.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {item.comments}
                </span>
                <span>{item.createdAt ? format(item.createdAt, 'MMM d, h:mm a') : 'Just now'}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const UpcomingEventsList = ({ events }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary-600" />
        Upcoming Events
      </h3>
    </div>
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No upcoming events</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{event.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{event.date ? format(event.date, 'MMM d, yyyy') : 'TBD'}</span>
                <span>•</span>
                <span>{event.location || 'TBD'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Users className="w-3 h-3" />
              {event.attendees}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ===== MAIN DASHBOARD =====

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const stats = useCampusStats();
  const weeklyActivity = useWeeklyCampusActivity();
  const recentActivity = useRecentCampusActivity();
  const upcomingEvents = useUpcomingEvents();

  if (authLoading || stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">
                Welcome back, {userProfile?.displayName || user?.displayName || 'Student'}!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors border border-slate-200"
          >
            <Zap className="w-4 h-4" />
            Go to Feed
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={FileText}
            label="Campus Posts"
            value={stats.postsCount}
            color="bg-blue-500"
          />
          <StatCard
            icon={Heart}
            label="Total Likes"
            value={stats.totalLikes}
            color="bg-rose-500"
          />
          <StatCard
            icon={MessageCircle}
            label="Comments"
            value={stats.totalComments}
            color="bg-purple-500"
          />
          <StatCard
            icon={BookOpen}
            label="Study Groups"
            value={stats.studyGroupsJoined}
            color="bg-emerald-500"
          />
          <StatCard
            icon={Calendar}
            label="Events"
            value={stats.eventsAttending}
            color="bg-orange-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Chart - spans 2 columns */}
          <div className="lg:col-span-2">
            <WeeklyChart data={weeklyActivity} />
          </div>

          {/* Upcoming Events */}
          <div>
            <UpcomingEventsList events={upcomingEvents} />
          </div>

          {/* Recent Activity - spans full width on mobile, 2 cols on lg */}
          <div className="lg:col-span-2">
            <RecentActivityList activities={recentActivity} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create Post', path: '/', icon: FileText, color: 'text-blue-600 bg-blue-50' },
                { label: 'Join Study Group', path: '/study-groups', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Explore Events', path: '/events', icon: Calendar, color: 'text-orange-600 bg-orange-50' },
                { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-primary-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;