import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-2 text-accent-600">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Event has started!</span>
      </div>
    );
  }

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      <Clock className="w-5 h-5 text-primary-600" />
      <div className="flex items-center gap-2">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-2xl font-bold text-gray-300">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl font-bold text-gray-300">:</span>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl font-bold text-gray-300">:</span>
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

export default CountdownTimer;