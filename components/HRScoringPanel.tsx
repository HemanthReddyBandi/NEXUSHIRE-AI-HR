import React, { useState, useCallback } from 'react';

interface Score {
  confidence: number;
  technical: number;
  communication: number;
}

interface HRScoringPanelProps {
  onScoresChange: (scores: Score) => void;
  isInterviewActive: boolean;
}

const HRScoringPanel: React.FC<HRScoringPanelProps> = ({ onScoresChange, isInterviewActive }) => {
  const [scores, setScores] = useState<Score>({
    confidence: 50,
    technical: 50,
    communication: 50,
  });

  const [comments, setComments] = useState<Record<string, string>>({
    confidence: '',
    technical: '',
    communication: '',
  });

  const handleScoreChange = useCallback(
    (category: keyof Score, value: number) => {
      const newScores = { ...scores, [category]: value };
      setScores(newScores);
      onScoresChange(newScores);
    },
    [scores, onScoresChange]
  );

  const calculateOverallScore = (): number => {
    return Math.round(scores.confidence * 0.3 + scores.technical * 0.4 + scores.communication * 0.3);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-cyan-400">⚡</span>
        Live Scoring Panel
      </h2>

      {!isInterviewActive && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm">Interview not active - Start interview to enable scoring</p>
        </div>
      )}

      {/* Confidence Score */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-300 font-semibold flex items-center gap-2">
            <span className="text-lg">😊</span> Confidence
          </label>
          <span className={`text-lg font-bold ${getScoreColor(scores.confidence)}`}>{scores.confidence}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={scores.confidence}
          onChange={(e) => handleScoreChange('confidence', parseInt(e.target.value))}
          disabled={!isInterviewActive}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
        />
        <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className={`h-full ${getProgressColor(scores.confidence)} transition-all`} style={{ width: `${scores.confidence}%` }} />
        </div>
        <textarea
          placeholder="Add confidence observations..."
          value={comments.confidence}
          onChange={(e) => setComments({ ...comments, confidence: e.target.value })}
          disabled={!isInterviewActive}
          className="w-full mt-3 p-2 bg-gray-900 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-600 disabled:opacity-50 resize-none h-16"
        />
      </div>

      {/* Technical Score */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-300 font-semibold flex items-center gap-2">
            <span className="text-lg">🧠</span> Technical Knowledge
          </label>
          <span className={`text-lg font-bold ${getScoreColor(scores.technical)}`}>{scores.technical}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={scores.technical}
          onChange={(e) => handleScoreChange('technical', parseInt(e.target.value))}
          disabled={!isInterviewActive}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
        />
        <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className={`h-full ${getProgressColor(scores.technical)} transition-all`} style={{ width: `${scores.technical}%` }} />
        </div>
        <textarea
          placeholder="Add technical assessment notes..."
          value={comments.technical}
          onChange={(e) => setComments({ ...comments, technical: e.target.value })}
          disabled={!isInterviewActive}
          className="w-full mt-3 p-2 bg-gray-900 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-600 disabled:opacity-50 resize-none h-16"
        />
      </div>

      {/* Communication Score */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-300 font-semibold flex items-center gap-2">
            <span className="text-lg">🎤</span> Communication
          </label>
          <span className={`text-lg font-bold ${getScoreColor(scores.communication)}`}>{scores.communication}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={scores.communication}
          onChange={(e) => handleScoreChange('communication', parseInt(e.target.value))}
          disabled={!isInterviewActive}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
        />
        <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className={`h-full ${getProgressColor(scores.communication)} transition-all`} style={{ width: `${scores.communication}%` }} />
        </div>
        <textarea
          placeholder="Add communication feedback..."
          value={comments.communication}
          onChange={(e) => setComments({ ...comments, communication: e.target.value })}
          disabled={!isInterviewActive}
          className="w-full mt-3 p-2 bg-gray-900 border border-gray-600 rounded text-gray-300 text-sm placeholder-gray-600 disabled:opacity-50 resize-none h-16"
        />
      </div>

      {/* Overall Score */}
      <div className="p-4 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 rounded-xl border border-cyan-500/30">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-semibold flex items-center gap-2">
            <span className="text-xl">📊</span> Overall Score
          </span>
          <span className={`text-3xl font-bold ${getScoreColor(calculateOverallScore())}`}>{calculateOverallScore()}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
          <div className={`h-full ${getProgressColor(calculateOverallScore())} transition-all`} style={{ width: `${calculateOverallScore()}%` }} />
        </div>
        <p className="text-gray-400 text-xs mt-2">Confidence (30%) + Technical (40%) + Communication (30%)</p>
      </div>
    </div>
  );
};

export default HRScoringPanel;
