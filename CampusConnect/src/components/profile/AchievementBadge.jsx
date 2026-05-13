import { Lock, CheckCircle } from 'lucide-react';

const AchievementBadge = ({ achievement, isUnlocked, progress }) => {
  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all ${
      isUnlocked 
        ? 'bg-primary-50 border-primary-200 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          isUnlocked ? 'bg-primary-100' : 'bg-gray-200'
        }`}>
          {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isUnlocked ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {achievement.points} pts
            </span>
            {progress !== undefined && !isUnlocked && (
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-400 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
        {isUnlocked && (
          <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;