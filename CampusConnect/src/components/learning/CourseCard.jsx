import { Link } from 'react-router-dom';
import { Star, BookOpen, Users, ThumbsUp, MessageSquare } from 'lucide-react';

const CourseCard = ({ course }) => {
  const avgRating = course.reviews?.reduce((acc, r) => acc + r.rating, 0) / (course.reviews?.length || 1);

  return (
    <Link to={`/courses/${course.id}`} className="card hover:shadow-md transition-shadow block">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded mb-2">
              {course.code}
            </span>
            <h3 className="font-semibold text-gray-900">{course.name}</h3>
          </div>
          <div className="flex items-center gap-1 bg-secondary-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-secondary-500 fill-current" />
            <span className="text-sm font-bold text-secondary-700">{avgRating.toFixed(1)}</span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-500">{course.department} • {course.credits} credits</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {course.tags?.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.professors?.length || 0} professors</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolled || 0} enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{course.reviews?.length || 0} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;