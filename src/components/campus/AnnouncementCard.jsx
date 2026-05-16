import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Megaphone, Calendar, AlertTriangle, Info } from 'lucide-react';

const AnnouncementCard = ({ announcement, isAdmin = false, onDelete = () => {} }) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryIcon = () => {
    switch (announcement?.category) {
      case 'academic': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (announcement?.priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-blue-500 bg-white';
    }
  };

  const getFormattedDate = (dateValue) => {
    try {
      if (!dateValue) return 'Just now';
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) { return 'Recently'; }
  };

  const content = announcement?.content || '';
  const isLong = content.length > 200;
  const displayContent = expanded ? content : (isLong ? content.slice(0, 200) + '...' : content);

  return (
    <div className={`rounded-xl shadow-sm border border-gray-100 border-l-4 overflow-hidden mb-4 ${getPriorityColor()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {announcement?.pinned && (
              <Pin className="w-4 h-4 text-primary-600 fill-current" />
            )}
            {getCategoryIcon()}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {announcement?.category || 'General'}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {getFormattedDate(announcement?.createdAt)}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mt-2 text-lg">
          {announcement?.title || 'Untitled'}
        </h3>

        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
          {displayContent}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 text-sm font-medium mt-2 hover:text-primary-800"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Posted by {announcement?.authorName || 'Admin'}
            </span>
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete(announcement.id)}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;