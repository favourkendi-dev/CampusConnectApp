import { MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LostFoundCard = ({ item, onClaim, onFound, isOwner }) => {
  const isLost = item.type === 'lost';

  return (
    <div className={`card hover:shadow-md transition-shadow border-l-4 ${
      isLost ? 'border-l-secondary-500' : 'border-l-accent-500'
    }`}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {isLost ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
              <AlertCircle className="w-3 h-3" />
              Lost
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
              <CheckCircle className="w-3 h-3" />
              Found
            </span>
          )}
          {item.isResolved && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Resolved
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{item.description}</p>

        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDistanceToNow(item.date, { addSuffix: true })}</span>
          </div>
        </div>

        {!item.isResolved && (
          <div className="mt-4">
            {isLost ? (
              <button
                onClick={() => onFound(item.id)}
                className="w-full py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
              >
                I Found This!
              </button>
            ) : (
              <button
                onClick={() => onClaim(item.id)}
                className="w-full py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                This is Mine!
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundCard;