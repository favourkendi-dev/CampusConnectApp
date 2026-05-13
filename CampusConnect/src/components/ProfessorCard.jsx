import { Star, BookOpen, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

const ProfessorCard = ({ professor, onRate }) => {
  const avgRating = professor.reviews?.reduce((acc, r) => acc + r.rating, 0) / (professor.reviews?.length || 1);
  const wouldTakeAgain = professor.reviews?.filter((r) => r.wouldTakeAgain).length / (professor.reviews?.length || 1) * 100;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={professor.photoURL || `https://ui-avatars.com/api/?name=${professor.name}&background=4F46E5&color=fff`}
            alt={professor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{professor.name}</h3>
            <p className="text-sm text-gray-500">{professor.department}</p>
            
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-secondary-500 fill-current" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">({professor.reviews?.length || 0} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-primary-600">{professor.difficulty || 'N/A'}</p>
            <p className="text-xs text-gray-500">Difficulty</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-accent-600">{Math.round(wouldTakeAgain)}%</p>
            <p className="text-xs text-gray-500">Would Take Again</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-secondary-600">{professor.grade || 'N/A'}</p>
            <p className="text-xs text-gray-500">Avg Grade</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {professor.tags?.map((tag) => (
            <span key={tag} className={`px-2 py-1 text-xs rounded-full ${
              tag.includes('Tough') || tag.includes('Hard') 
                ? 'bg-red-50 text-red-600' 
                : tag.includes('Easy') || tag.includes('Fair')
                ? 'bg-accent-50 text-accent-600'
                : 'bg-primary-50 text-primary-600'
            }`}>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onRate(professor.id)}
          className="mt-4 w-full py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Rate Professor
        </button>
      </div>
    </div>
  );
};

export default ProfessorCard;