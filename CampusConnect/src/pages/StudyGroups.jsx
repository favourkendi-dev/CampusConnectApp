import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useStudy } from '../context/StudyContext';
import { Search, Plus, Users, Clock, BookOpen, Filter } from 'lucide-react';

const StudyGroups = () => {
  const { isDark } = useTheme();
  const { studyGroups, loading, createStudyGroup } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', subject: '', description: '', maxMembers: 8 });

  const subjects = ['all', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology', 'Engineering', 'Business', 'English', 'History'];

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSearch = group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || group.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    await createStudyGroup(newGroup);
    setShowCreateModal(false);
    setNewGroup({ name: '', subject: '', description: '', maxMembers: 8 });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Groups</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Find your study squad</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>

        {/* Search & Filter */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search study groups..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s === 'all' ? 'All Subjects' : s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-12 text-center`}>
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No study groups found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Create one or try different search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow`}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                      {group.subject || 'General'}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {group.meetingTime || 'Flexible'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{group.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{group.members?.length || 0}/{group.maxMembers || 8} members</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-lg w-full p-6`}>
              <h2 className="text-2xl font-bold mb-4">Create Study Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <select
                    value={newGroup.subject}
                    onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">Select subject</option>
                    {subjects.filter((s) => s !== 'all').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Members</label>
                  <input
                    type="number"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                    min={2}
                    max={50}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroups;