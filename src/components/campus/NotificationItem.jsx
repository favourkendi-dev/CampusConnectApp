import { 
  Heart, MessageCircle, UserPlus, Calendar, 
  ShoppingBag, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-primary-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-accent-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-secondary-500" />;
      case 'marketplace': return <ShoppingBag className="w-5 h-5 text-primary-500" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'achievement': return <CheckCircle className="w-5 h-5 text-accent-500" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'emergency': return 'bg-red-50 border-red-200';
      case 'achievement': return 'bg-accent-50 border-accent-200';
      default: return notification.read ? 'bg-white' : 'bg-primary-50 border-primary-100';
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 p-4 rounded-lg border ${getBgColor()} transition-colors hover:bg-gray-50`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {!notification.read && (
          <div className="w-2 h-2 bg-primary-500 rounded-full" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;