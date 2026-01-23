// ScoreCard.tsx
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  showProgressBar?: boolean;
  showStatus?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score,
  description,
  size = 'medium',
  showProgressBar = true,
  showStatus = true
}) => {
  const safeScore = Math.min(10, Math.max(0, score));
  const percentage = safeScore * 10;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const sizeConfigs = {
    small: { container: 'w-32 h-32', scoreSize: 'text-2xl', titleSize: 'text-sm' },
    medium:{ container: 'w-40 h-40', scoreSize: 'text-3xl', titleSize: 'text-base' },
    large: { container: 'w-48 h-48', scoreSize: 'text-4xl', titleSize: 'text-lg' }
  };

  const getColor = () => {
    if (safeScore >= 8) return {
      stroke: 'stroke-green-400',
      progressBar: 'bg-gradient-to-r from-green-500 to-emerald-500',
      statusColor: 'bg-green-500',
      statusText: 'Excellent'
    };
    if (safeScore >= 5) return {
      stroke: 'stroke-yellow-400',
      progressBar: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      statusColor: 'bg-yellow-500',
      statusText: 'Good'
    };
    return {
      stroke: 'stroke-red-400',
      progressBar: 'bg-gradient-to-r from-red-500 to-rose-500',
      statusColor: 'bg-red-500',
      statusText: 'Needs Work'
    };
  };

  const colors = getColor();
  const sizeConfig = sizeConfigs[size];

  return (
    <div className="p-1 rounded-2xl bg-gray-800/50 border border-gray-700 hover:scale-105 transition">
      <div className="bg-gray-900 rounded-xl p-4 text-center">
        <div className={`relative ${sizeConfig.container} mx-auto mb-3`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle r="45" cx="50" cy="50" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-800" />
            <circle
              r="45"
              cx="50"
              cy="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${colors.stroke}`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${sizeConfig.scoreSize} font-bold text-white`}>
              {safeScore.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">/10</span>
          </div>
        </div>

        <p className={`${sizeConfig.titleSize} font-semibold text-white mb-2`}>
          {title}
        </p>

        {showProgressBar && (
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div className={`${colors.progressBar} h-full`} style={{ width: `${percentage}%` }} />
          </div>
        )}

        {showStatus && (
          <div className="flex justify-center items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colors.statusColor}`} />
            <span className="text-xs text-gray-400">{colors.statusText}</span>
          </div>
        )}

        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
