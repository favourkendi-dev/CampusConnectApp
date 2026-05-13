import { AlertTriangle, X, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

const EmergencyBanner = () => {
  const { activeAlert, dismissAlert } = useEmergency();

  if (!activeAlert) return null;

  const getSeverityColor = () => {
    switch (activeAlert.severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-gray-900';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className={`${getSeverityColor()} px-4 py-3 relative`}>
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">{activeAlert.title}</h3>
          <p className="text-sm opacity-90 truncate">{activeAlert.message}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {activeAlert.phone && (
            <a
              href={`tel:${activeAlert.phone}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
          )}
          
          {activeAlert.location && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeAlert.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </a>
          )}

          {activeAlert.link && (
            <a
              href={activeAlert.link}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => dismissAlert(activeAlert.id)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;