export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

export const getMapBounds = (locations) => {
  if (!locations.length) return null;
  
  const lats = locations.map((l) => l.latitude);
  const lons = locations.map((l) => l.longitude);
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons),
  };
};

export const CAMPUS_LOCATIONS = [
  { id: 'library', name: 'Main Library', latitude: 40.7128, longitude: -74.0060, type: 'study', icon: '📚' },
  { id: 'dining', name: 'Student Dining Hall', latitude: 40.7135, longitude: -74.0055, type: 'food', icon: '🍽️' },
  { id: 'gym', name: 'Fitness Center', latitude: 40.7120, longitude: -74.0070, type: 'sports', icon: '💪' },
  { id: 'student-center', name: 'Student Center', latitude: 40.7130, longitude: -74.0065, type: 'social', icon: '🏢' },
  { id: 'engineering', name: 'Engineering Building', latitude: 40.7140, longitude: -74.0050, type: 'academic', icon: '🔧' },
  { id: 'arts', name: 'Arts & Humanities', latitude: 40.7115, longitude: -74.0075, type: 'academic', icon: '🎨' },
  { id: 'health', name: 'Health Center', latitude: 40.7125, longitude: -74.0045, type: 'health', icon: '🏥' },
  { id: 'parking', name: 'Main Parking', latitude: 40.7145, longitude: -74.0040, type: 'transport', icon: '🅿️' },
];