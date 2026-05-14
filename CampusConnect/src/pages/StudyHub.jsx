import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../hooks/useLanguage';
import { BookOpen, Users, GraduationCap, Layers, Search, Plus } from 'lucide-react';

const StudyHub = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'groups', label: 'Study Groups', icon: Users, path: '/study/groups' },
    { id: 'tutoring', label: 'Tutoring', icon: GraduationCap, path: '/study/tutoring' },
    { id: 'notes', label: 'Notes', icon: Layers, path: '/study/notes' },
  ];

  const quickStats = [
    { label: 'Active Study Groups', value: '24', color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Available Tutors', value: '18', color: 'text-secondary-600', bg: 'bg-secondary-50' },
    { label: 'Note Sets Shared', value: '156', color: 'text-accent-600', bg: 'bg-accent-50' },
    { label: 'Students Helped', value: '342', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const recentActivity = [
    { type: 'group', title: 'CS 301 Study Squad', action: '3 new members joined', time: '2 min ago' },
    { type: 'tutor', title: 'Maria Garcia', action: 'is now tutoring Organic Chemistry', time: '15 min ago' },
    { type: 'note', title: 'Calculus II Finals Prep', action: 'downloaded 12 times today', time: '1 hour ago' },
    { type: 'group', title: 'Psych Stats Support', action: 'meeting in 30 minutes', time: '2 hours ago' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('studyHub') || 'Study Hub'}</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Collaborate, learn, and succeed together
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => (
            <div key={stat.label} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path || '#'}
              onClick={() => !tab.path && setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search study groups, tutors, or notes..."
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{activity.action}</p>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Study Groups */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Featured Study Groups</h2>
                <Link to="/study/groups" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['CS 301 Study Squad', 'Organic Chemistry Warriors', 'Calculus Crew', 'Psych Stats Support'].map((group) => (
                  <div key={group} className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className="font-semibold mb-1">{group}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>8 members • Meeting today</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/study/groups"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Create Study Group</span>
                </Link>
                <Link
                  to="/study/tutoring"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Become a Tutor</span>
                </Link>
                <Link
                  to="/study/notes"
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors"
                >
                  <Layers className="w-5 h-5" />
                  <span className="font-medium">Share Notes</span>
                </Link>
              </div>
            </div>

            {/* Top Tutors */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Top Tutors This Week</h2>
              <div className="space-y-4">
                {[
                  { name: 'Alex Johnson', subject: 'Computer Science', rating: 4.9, sessions: 24 },
                  { name: 'Maria Garcia', subject: 'Psychology', rating: 4.8, sessions: 18 },
                  { name: 'James Chen', subject: 'Engineering', rating: 4.7, sessions: 15 },
                ].map((tutor, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                      {tutor.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{tutor.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{tutor.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary-500">★ {tutor.rating}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{tutor.sessions} sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Notes */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <h2 className="text-lg font-semibold mb-4">Trending Notes</h2>
              <div className="space-y-3">
                {[
                  { title: 'CS 301 Final Review', downloads: 156, rating: 4.8 },
                  { title: 'Organic Chem Reactions', downloads: 134, rating: 4.6 },
                  { title: 'Psych Stats Formula Sheet', downloads: 98, rating: 4.9 },
                ].map((note, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{note.title}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{note.downloads} downloads</p>
                    </div>
                    <span className="text-xs font-semibold text-accent-500">★ {note.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHub;