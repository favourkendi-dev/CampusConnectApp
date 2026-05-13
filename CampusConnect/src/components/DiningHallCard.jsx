import { useState } from 'react';
import { Clock, MapPin, Users, Star, ChevronDown, ChevronUp, Leaf, Wheat, Flame } from 'lucide-react';

const DiningHallCard = ({ hall }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getOccupancyColor = () => {
    if (hall.occupancy < 50) return 'text-accent-600 bg-accent-50';
    if (hall.occupancy < 80) return 'text-secondary-600 bg-secondary-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      {hall.imageUrl && (
        <img src={hall.imageUrl} alt={hall.name} className="w-full h-40 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{hall.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{hall.location}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor()}`}>
            {hall.occupancy}% full
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{hall.hours}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary-500" />
            <span>{hall.rating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{hall.capacity} seats</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {hall.dietaryOptions?.map((option) => (
            <span key={option} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {option === 'Vegetarian' && <Leaf className="w-3 h-3 text-accent-500" />}
              {option === 'Gluten-Free' && <Wheat className="w-3 h-3 text-yellow-500" />}
              {option === 'Spicy' && <Flame className="w-3 h-3 text-red-500" />}
              {option}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-100 transition-colors"
        >
          {showMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showMenu ? 'Hide Menu' : "Today's Menu"}
        </button>

        {showMenu && (
          <div className="mt-3 space-y-2">
            {hall.menu?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.calories} cal</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.dietary?.map((d) => (
                    <span key={d} className="text-xs px-1.5 py-0.5 rounded bg-white text-gray-600">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiningHallCard;