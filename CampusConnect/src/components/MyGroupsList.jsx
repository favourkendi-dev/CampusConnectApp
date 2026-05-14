import React from 'react';
import { useGroups } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import { Users, MessageSquare, Plus } from 'lucide-react';

const MyGroupsList = ({ onSelectGroup, activeGroupId }) => {
  const { user } = useAuth();
  const { myGroups, loading } = useGroups(user?.uid);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" /> My Groups
        </h3>
        {/* We can add a "Create" button here later! */}
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-1">
        {loading ? (
          <div className="px-2 py-3 animate-pulse space-y-2">
            <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
            <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
          </div>
        ) : myGroups.length === 0 ? (
          <div className="px-2 py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-[11px] text-gray-400">You haven't joined any groups yet.</p>
          </div>
        ) : (
          myGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup({ id: group.id, name: group.name })}
              className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                activeGroupId === group.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                activeGroupId === group.id 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                {group.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{group.name}</p>
                <p className={`text-[10px] truncate ${activeGroupId === group.id ? 'text-indigo-500' : 'text-gray-400'}`}>
                  {group.lastMessage || "No messages yet"}
                </p>
              </div>
              {activeGroupId === group.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
              )}
            </button>
          ))
        )}
      </div>

      <button className="mt-4 w-full py-2 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg uppercase tracking-wider transition-colors">
        Explore All Groups
      </button>
    </div>
  );
};

export default MyGroupsList;