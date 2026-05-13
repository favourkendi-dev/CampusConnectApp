import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, Lock, Globe } from 'lucide-react';

const GroupCard = ({ group, onJoin, isMember }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      {group.coverImage && (
        <img src={group.coverImage} alt={group.name} className="w-full h-32 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={group.photoURL || `https://ui-avatars.com/api/?name=${group.name}&background=4F46E5&color=fff`}
              alt={group.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {group.isPrivate ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>Public</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{group.description}</p>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{group.memberCount || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{group.postCount || 0} posts</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{group.eventCount || 0} events</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/groups/${group.id}`}
            className="flex-1 text-center py-2 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-100 transition-colors"
          >
            View
          </Link>
          {!isMember && (
            <button
              onClick={() => onJoin(group.id)}
              className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;