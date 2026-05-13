import { MapPin, Navigation, Info, X } from 'lucide-react';
import { useState } from 'react';

const MapPinComponent = ({ location, onNavigate, isSelected }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPinColor = () => {
    switch (location.type) {
      case 'building': return 'bg-primary-500';
      case 'dining': return 'bg-secondary-500';
      case 'study': return 'bg-accent-500';
      case 'printer': return 'bg-gray-500';
      case 'bike': return 'bg-green-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-primary-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`w-8 h-8 rounded-full ${getPinColor()} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${isSelected ? 'ring-4 ring-primary-200' : ''}`}
      >
        <MapPin className="w-5 h-5" />
      </button>

      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-900">{location.name}</h4>
            <button onClick={() => setShowDetails(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{location.description}</p>
          
          {location.hours && (
            <p className="text-xs text-gray-400 mt-1">Hours: {location.hours}</p>
          )}
          
          {location.occupancy !== undefined && (
            <div className="mt-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${location.occupancy > 80 ? 'bg-red-500' : location.occupancy > 50 ? 'bg-secondary-500' : 'bg-accent-500'}`}
                  style={{ width: `${location.occupancy}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{location.occupancy}% occupied</p>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onNavigate(location)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </button>
            <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Info className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPinComponent;