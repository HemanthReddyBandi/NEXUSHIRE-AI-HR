import React, { useState } from 'react';
import { sendResultToCandidate, saveHRResult, HRResult } from '../services/storageService';
import { Send, Download, Mail } from './icons/Icons';

interface ScoreData {
  confidence: number;
  technical: number;
  communication: number;
  overall: number;
}

interface Feedback {
  confidence: string;
  technical: string;
  communication: string;
  general: string;
}

interface HRInterviewResultProps {
  candidateName: string;
  candidateEmail?: string;
  interviewDate: string;
  scores: ScoreData;
  feedback: Feedback;
  hrName: string;
  sessionId: string;
  onDownload?: () => void;
}

const HRInterviewResult: React.FC<HRInterviewResultProps> = ({
  candidateName,
  candidateEmail = 'candidate@email.com',
  interviewDate,
  scores,
  feedback,
  hrName,
  sessionId,
  onDownload,
}) => {
  const [resultSent, setResultSent] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  const getScoreGrade = (score: number): { grade: string; color: string } => {
    if (score >= 90) return { grade: 'A', color: 'text-green-400 bg-green-500/20' };
    if (score >= 80) return { grade: 'B+', color: 'text-blue-400 bg-blue-500/20' };
    if (score >= 70) return { grade: 'B', color: 'text-cyan-400 bg-cyan-500/20' };
    if (score >= 60) return { grade: 'C+', color: 'text-yellow-400 bg-yellow-500/20' };
    if (score >= 50) return { grade: 'C', color: 'text-orange-400 bg-orange-500/20' };
    return { grade: 'D', color: 'text-red-400 bg-red-500/20' };
  };

  const handleSendResult = () => {
    try {
      const performanceLevel = scores.overall >= 80 ? 'Excellent' : scores.overall >= 60 ? 'Good' : 'Needs Improvement';
      const grade = getScoreGrade(scores.overall).grade;
      
      const result: HRResult = {
        id: `result-${sessionId}-${Date.now()}`,
        sessionId,
        candidateName,
        candidateEmail,
        hrName,
        interviewDate,
        scores,
        feedback,
        grade,
        performanceLevel,
        sentAt: new Date().toISOString(),
      };

      // Save the HR result
      saveHRResult(result);
      
      // Send to candidate
      const success = sendResultToCandidate(result.id);
      
      if (success) {
        setResultSent(true);
        setShowSendConfirm(false);
      }
    } catch (error) {
      console.error('Error sending result:', error);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const confidenceGrade = getScoreGrade(scores.confidence);
  const technicalGrade = getScoreGrade(scores.technical);
  const communicationGrade = getScoreGrade(scores.communication);
  const overallGrade = getScoreGrade(scores.overall);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-600 flex items-center justify-center text-3xl">
            ✓
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Interview Complete</h1>
            <p className="text-gray-400">Results & Feedback</p>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Candidate</p>
            <p className="text-white font-semibold text-lg">{candidateName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Interview Date</p>
            <p className="text-white font-semibold text-lg">{interviewDate}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Conducted By</p>
            <p className="text-white font-semibold text-lg">{hrName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Session ID</p>
            <p className="text-cyan-400 font-mono text-sm">{sessionId}</p>
          </div>
        </div>
      </div>

      {/* Overall Score - Large Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Overall Score - Main */}
        <div className="lg:col-span-1 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 backdrop-blur border border-cyan-500/30 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Overall Score</p>
          <div className="flex items-center justify-center mb-4">
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              {scores.overall}
            </div>
            <span className="text-4xl text-gray-400 ml-2">/100</span>
          </div>
          <div className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${overallGrade.color}`}>
            Grade: {overallGrade.grade}
          </div>
          <p className="text-gray-400 text-xs mt-4">Based on weighted evaluation</p>
        </div>

        {/* Individual Scores */}
        <div className="lg:col-span-2 space-y-4">
          {/* Confidence */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">Confidence</p>
                <p className="text-white font-semibold">Composure & Self-Assurance</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getScoreColor(scores.confidence)}`}>{scores.confidence}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${confidenceGrade.color}`}>
                  {confidenceGrade.grade}
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${scores.confidence}%` }} />
            </div>
            {feedback.confidence && <p className="text-gray-400 text-sm mt-3">💬 {feedback.confidence}</p>}
          </div>

          {/* Technical */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">Technical Knowledge</p>
                <p className="text-white font-semibold">Expertise & Problem-Solving</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getScoreColor(scores.technical)}`}>{scores.technical}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${technicalGrade.color}`}>
                  {technicalGrade.grade}
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${scores.technical}%` }} />
            </div>
            {feedback.technical && <p className="text-gray-400 text-sm mt-3">💬 {feedback.technical}</p>}
          </div>

          {/* Communication */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">Communication</p>
                <p className="text-white font-semibold">Clarity & Expression</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getScoreColor(scores.communication)}`}>{scores.communication}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${communicationGrade.color}`}>
                  {communicationGrade.grade}
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all" style={{ width: `${scores.communication}%` }} />
            </div>
            {feedback.communication && <p className="text-gray-400 text-sm mt-3">💬 {feedback.communication}</p>}
          </div>
        </div>
      </div>

      {/* General Feedback */}
      {feedback.general && (
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">📝</span> General Feedback
          </h2>
          <p className="text-gray-300 leading-relaxed">{feedback.general}</p>
        </div>
      )}

      {/* Score Breakdown Chart */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-purple-400">📊</span> Score Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(107, 114, 128, 0.2)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="8"
                  strokeDasharray={`${(scores.confidence / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-400">{scores.confidence}%</span>
              </div>
            </div>
            <p className="text-gray-400">Confidence</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(107, 114, 128, 0.2)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="8"
                  strokeDasharray={`${(scores.technical / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-400">{scores.technical}%</span>
              </div>
            </div>
            <p className="text-gray-400">Technical</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(107, 114, 128, 0.2)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgb(251, 146, 60)"
                  strokeWidth="8"
                  strokeDasharray={`${(scores.communication / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-400">{scores.communication}%</span>
              </div>
            </div>
            <p className="text-gray-400">Communication</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onDownload}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" /> Download Scorecard
        </button>
        <button
          onClick={() => setShowSendConfirm(true)}
          disabled={resultSent}
          className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            resultSent
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
          }`}
        >
          <Send className="w-5 h-5" />
          {resultSent ? '✓ Result Sent' : 'Send Result to Candidate'}
        </button>
      </div>

      {/* Send Confirmation Dialog */}
      {showSendConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-green-500/30 rounded-2xl p-8 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">📧</span> Send Results to Candidate?
            </h2>
            <p className="text-gray-400 mb-6">
              This will send the interview results and scores to <span className="font-semibold text-white">{candidateName}</span> at <span className="font-semibold text-cyan-400">{candidateEmail}</span>.
            </p>

            {/* Result Preview */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-gray-300 text-sm font-semibold mb-3">Results Summary:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-cyan-400 font-bold">{scores.confidence}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Technical:</span>
                  <span className="text-cyan-400 font-bold">{scores.technical}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Communication:</span>
                  <span className="text-cyan-400 font-bold">{scores.communication}/100</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between">
                  <span className="text-gray-300 font-semibold">Overall Score:</span>
                  <span className="text-green-400 font-bold text-lg">{scores.overall}/100</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-xs mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              ℹ️ The candidate will see this result in their dashboard and receive a notification.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSendConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendResult}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Send Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRInterviewResult;
