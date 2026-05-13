import { Link } from 'react-router-dom';
import { Users, BookOpen, Clock, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const StudyGroupCard = ({ group, onJoin, isMember }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.subject}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            group.isOpen ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {group.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{group.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{group.memberCount || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{group.messageCount || 0} messages</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(group.createdAt, { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/study/groups/${group.id}`}
            className="flex-1 text-center py-2 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-100 transition-colors"
          >
            View Group
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

export default StudyGroupCard;