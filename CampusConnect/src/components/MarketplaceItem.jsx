import { Heart, MessageCircle, Share2, MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MarketplaceItem = ({ item, onLike, onMessage, onShare, isOwner }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      {item.images?.[0] && (
        <img src={item.images[0]} alt={item.title} className="w-full h-56 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full mb-2">
              {item.condition}
            </span>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-600">${item.price}</p>
            {item.originalPrice && (
              <p className="text-sm text-gray-400 line-through">${item.originalPrice}</p>
            )}
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.category && (
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
          )}
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <MapPin className="w-3 h-3" />
            {item.pickupLocation || 'Campus'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => onLike(item.id)} className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current text-red-500' : ''}`} />
              <span>{item.likes || 0}</span>
            </button>
            <button onClick={() => onMessage(item.sellerId)} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button onClick={() => onShare(item)} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItem;