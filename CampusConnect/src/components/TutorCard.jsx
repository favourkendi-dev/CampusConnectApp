import { Star, Calendar, DollarSign, MessageCircle, Award } from 'lucide-react';

const TutorCard = ({ tutor, onBook, onMessage }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={tutor.photoURL || `https://ui-avatars.com/api/?name=${tutor.displayName}&background=4F46E5&color=fff`}
            alt={tutor.displayName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{tutor.displayName}</h3>
              {tutor.isVerified && (
                <Award className="w-5 h-5 text-accent-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">{tutor.subjects?.join(', ')}</p>
            
            <div className="mt-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-secondary-500 fill-current" />
              <span className="text-sm font-medium">{tutor.rating || 0}</span>
              <span className="text-sm text-gray-500">({tutor.reviewCount || 0} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>${tutor.hourlyRate || 0}/hour</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{tutor.sessions || 0} sessions</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onBook(tutor.id)}
            className="flex-1 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Book Session
          </button>
          <button
            onClick={() => onMessage(tutor.id)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;