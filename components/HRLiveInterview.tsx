import React, { useState, useCallback, useEffect, useMemo } from 'react';
import HRScoringPanel from './HRScoringPanel';
import { saveHRResult, sendResultToCandidate } from '../services/storageService';
import { HRResult } from '../services/storageService';
import { Send, Mail } from './icons/Icons';

interface Score {
  confidence: number;
  technical: number;
  communication: number;
}

interface CandidateInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface HRLiveInterviewProps {
  candidateInfo: CandidateInfo;
  onFinish: (scores: Score & { feedback: string }) => void;
  sessionId: string;
  hrName?: string;
}

const HRLiveInterview: React.FC<HRLiveInterviewProps> = ({ candidateInfo, onFinish, sessionId, hrName = 'HR Manager' }) => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [scores, setScores] = useState<Score>({ confidence: 50, technical: 50, communication: 50 });
  const [interviewFeedback, setInterviewFeedback] = useState('');
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showSendResultsDialog, setShowSendResultsDialog] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [resultSent, setResultSent] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isInterviewActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInterviewActive]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartInterview = useCallback(() => {
    setIsInterviewActive(true);
    setTimer(0);
  }, []);

  const handleEndInterview = useCallback(() => {
    setShowEndDialog(true);
  }, []);

  const handleConfirmEnd = useCallback(() => {
    setIsInterviewActive(false);
    setShowEndDialog(false);
    // Show send results dialog - DON'T call onFinish yet
    setShowSendResultsDialog(true);
    setResultSent(false);
  }, []);

  const getScoreGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C+';
    if (score >= 50) return 'C';
    return 'D';
  };

  // Calculate overall score for display and sending
  const overallScore = useMemo(() => {
    return Math.round(scores.confidence * 0.3 + scores.technical * 0.4 + scores.communication * 0.3);
  }, [scores.confidence, scores.technical, scores.communication]);

  const handleSendResults = useCallback(() => {
    try {
      const performanceLevel = overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement';
      const grade = getScoreGrade(overallScore);
      
      const result: HRResult = {
        id: `result-${sessionId}-${Date.now()}`,
        sessionId,
        candidateName: candidateInfo.name,
        candidateEmail: candidateInfo.email,
        hrName,
        interviewDate: new Date().toISOString().split('T')[0],
        scores: {
          confidence: scores.confidence,
          technical: scores.technical,
          communication: scores.communication,
          overall: overallScore
        },
        feedback: {
          confidence: interviewFeedback,
          technical: interviewFeedback,
          communication: interviewFeedback,
          general: interviewFeedback
        },
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
        // Close the dialog after a brief delay to show success message
        setTimeout(() => {
          setShowSendResultsDialog(false);
          onFinish({
            ...scores,
            feedback: interviewFeedback,
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending result:', error);
    }
  }, [overallScore, scores, interviewFeedback, candidateInfo, sessionId, hrName, onFinish]);

  // Rest of component code...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HR Live Interview</h1>
              <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {isInterviewActive && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-mono text-red-400">{formatTime(timer)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video and Candidate Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Conference Area */}
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="w-full h-full flex items-center justify-center bg-gray-900/80 backdrop-blur">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 mx-auto mb-4 flex items-center justify-center text-4xl">
                  📹
                </div>
                <p className="text-gray-400 text-lg mb-2">Video Feed - {candidateInfo.name}</p>
                <p className="text-gray-600 text-sm">(WebRTC Stream Integration Required)</p>
              </div>
            </div>
          </div>

          {/* Candidate Information Card */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">👤</span> Candidate Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Name</p>
                <p className="text-white font-semibold text-lg">{candidateInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-white font-semibold text-lg">{candidateInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Position</p>
                <p className="text-white font-semibold text-lg">{candidateInfo.role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isInterviewActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                  {isInterviewActive ? 'In Progress' : 'Standby'}
                </span>
              </div>
            </div>
          </div>

          {/* Interview Controls */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">⚙️</span> Interview Controls
            </h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleStartInterview}
                disabled={isInterviewActive}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ▶ Start Interview
              </button>
              <button
                onClick={handleEndInterview}
                disabled={!isInterviewActive}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ⏹ End Interview
              </button>
              <button
                onClick={() => setIsRecording(!isRecording)}
                disabled={!isInterviewActive}
                className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                {isRecording ? '⏺ Recording' : '◯ Record'}
              </button>
              <button
                onClick={() => {
                  try {
                    const performanceLevel = overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement';
                    const grade = getScoreGrade(overallScore);
                    
                    const result: HRResult = {
                      id: `result-${sessionId}-${Date.now()}`,
                      sessionId,
                      candidateName: candidateInfo.name,
                      candidateEmail: candidateInfo.email,
                      hrName,
                      interviewDate: new Date().toISOString().split('T')[0],
                      scores: {
                        confidence: scores.confidence,
                        technical: scores.technical,
                        communication: scores.communication,
                        overall: overallScore
                      },
                      feedback: {
                        confidence: interviewFeedback,
                        technical: interviewFeedback,
                        communication: interviewFeedback,
                        general: interviewFeedback
                      },
                      grade,
                      performanceLevel,
                      sentAt: new Date().toISOString(),
                    };

                    saveHRResult(result);
                    sendResultToCandidate(result.id);
                    alert(`✓ Results submitted successfully to ${candidateInfo.name}!`);
                  } catch (error) {
                    console.error('Error submitting result:', error);
                    alert('Error submitting results. Please try again.');
                  }
                }}
                disabled={!isInterviewActive && scores.confidence === 50 && scores.technical === 50 && scores.communication === 50}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                📤 Submit Result
              </button>
            </div>
          </div>
        </div>

        {/* Right: Scoring Panel */}
        <div className="lg:col-span-1">
          <HRScoringPanel onScoresChange={setScores} isInterviewActive={isInterviewActive} />
        </div>
      </div>

      {/* General Feedback Section */}
      <div className="mt-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-cyan-400">📝</span> General Feedback
        </h2>
        <textarea
          value={interviewFeedback}
          onChange={(e) => setInterviewFeedback(e.target.value)}
          placeholder="Add general feedback, observations, or notes about the interview..."
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:border-cyan-500 focus:outline-none resize-none h-32"
        />
      </div>

      {/* End Interview Confirmation Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-cyan-500/30 rounded-2xl p-8 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">End Interview?</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to end this interview? The scores will be finalized and submitted.</p>

            {/* Final Scores Preview */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-gray-300 text-sm font-semibold mb-3">Final Scores:</p>
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
                  <span className="text-green-400 font-bold text-lg">{overallScore}/100</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowEndDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnd}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Results Dialog - Shows after confirming interview end */}
      {showSendResultsDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-green-500/30 rounded-2xl p-8 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">📧</span> Send Results to Candidate?
            </h2>
            <p className="text-gray-400 mb-6">
              Would you like to send the interview results to <span className="font-semibold text-white">{candidateInfo.name}</span>?
            </p>

            {/* Final Scores Preview */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-gray-300 text-sm font-semibold mb-3">Final Scores:</p>
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
                  <span className="text-green-400 font-bold text-lg">{overallScore}/100</span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-xs mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              ✓ The candidate will see this result in their dashboard immediately after you send it.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowSendResultsDialog(false);
                  onFinish({
                    ...scores,
                    feedback: interviewFeedback,
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSendResults}
                disabled={resultSent}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> {resultSent ? 'Results Sent' : 'Send Results'}
              </button>
            </div>

            {resultSent && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                <p className="text-green-400 text-sm font-semibold">✓ Results sent successfully!</p>
                <p className="text-green-300 text-xs mt-1">The candidate will see the results on their dashboard.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
