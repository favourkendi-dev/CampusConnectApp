import { useState } from 'react';
import { BarChart3, CheckCircle } from 'lucide-react';

const PollWidget = ({ poll, onVote, userId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const hasVoted = poll.options.some((opt) => opt.voters?.includes(userId));

  const totalVotes = poll.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);

  const handleVote = (index) => {
    if (hasVoted) return;
    setSelectedOption(index);
    onVote(poll.id, index);
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-primary-600" />
        <h4 className="font-medium text-gray-900">{poll.question}</h4>
      </div>

      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const percentage = getPercentage(option.votes || 0);
          const isSelected = selectedOption === index || option.voters?.includes(userId);

          return (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={hasVoted}
              className={`relative w-full text-left p-3 rounded-lg transition-all ${
                hasVoted 
                  ? 'bg-white cursor-default' 
                  : 'bg-white hover:bg-primary-50 cursor-pointer border border-gray-200 hover:border-primary-300'
              } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            >
              {hasVoted && (
                <div 
                  className="absolute inset-0 bg-primary-100 rounded-lg opacity-30"
                  style={{ width: `${percentage}%` }}
                />
              )}
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSelected && <CheckCircle className="w-4 h-4 text-primary-600" />}
                  <span className="text-sm font-medium text-gray-800">{option.text}</span>
                </div>
                {hasVoted && (
                  <span className="text-sm font-bold text-primary-600">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default PollWidget;