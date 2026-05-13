import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Share2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const EventCard = ({ event, onRSVP, isAttending, onShare }) => {
  const isUpcoming = new Date(event.date) > new Date();
  const isFull = event.maxAttendees && (event.attendees?.length || 0) >= event.maxAttendees;

  return (
    <div className="card hover:shadow-md transition-shadow overflow-hidden">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
              isUpcoming ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isUpcoming ? 'Upcoming' : 'Past'}
            </span>
            <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
          </div>
          <button
            onClick={() => onShare(event)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(event.date), 'h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{event.attendees?.length || 0} attending</span>
            {event.maxAttendees && <span className="text-gray-400">/ {event.maxAttendees} max</span>}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/events/${event.id}`}
            className="flex-1 text-center py-2 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-100 transition-colors"
          >
            Details
          </Link>
          {isUpcoming && (
            <button
              onClick={() => onRSVP(event.id)}
              disabled={isFull && !isAttending}
              className={`flex-1 py-2 font-medium rounded-lg transition-colors ${
                isAttending
                  ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  : isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isAttending ? 'Going ✓' : isFull ? 'Full' : 'RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;