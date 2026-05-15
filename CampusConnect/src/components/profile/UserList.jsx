import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';

const UserList = ({ users, onSelectUser, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No students found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                selectedUserId === user.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4F46E5&color=fff`}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{user.displayName}</p>
                  {user.isOnline && (
                    <span className="text-xs text-emerald-600 font-medium">Online</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {user.lastMessage || (user.isOnline ? 'Online now' : 'Offline')}
                </p>
              </div>
              <MessageCircle className="w-4 h-4 text-gray-400" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;