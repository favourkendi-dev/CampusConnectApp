import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardRow = ({ rank, user, score, category }) => {
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
  };

  const getRankStyle = () => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-amber-50 border-amber-200';
    return 'bg-white border-gray-100';
  };

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg border ${getRankStyle()} hover:shadow-sm transition-shadow`}>
      <div className="w-8 flex justify-center">
        {getRankIcon()}
      </div>
      
      <img
        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=4F46E5&color=fff`}
        alt={user.displayName}
        className="w-10 h-10 rounded-full object-cover"
      />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{user.displayName}</p>
        <p className="text-xs text-gray-500">{user.major || 'Student'}</p>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-primary-600">{score.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </div>
  );
};

export default LeaderboardRow;