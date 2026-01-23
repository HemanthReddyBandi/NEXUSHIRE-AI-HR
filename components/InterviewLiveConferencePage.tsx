'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HRCandidateUnifiedInterview from './HRCandidateUnifiedInterview';
import { AlertCircle, CheckCircle } from './icons/Icons';

interface InterviewPageProps {
  sessionId?: string;
}

const InterviewLiveConferencePage: React.FC<InterviewPageProps> = ({ sessionId: propSessionId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sessionId, setSessionId] = useState<string>('');
  const [userRole, setUserRole] = useState<'hr' | 'candidate' | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [interviewInfo, setInterviewInfo] = useState({
    candidateName: 'John Doe',
    hrName: 'Sarah Johnson',
    position: 'Frontend Developer',
    scheduledTime: new Date().toISOString(),
    duration: 60,
    description: 'Technical Interview - React & TypeScript'
  });

  useEffect(() => {
    // Get session ID from params or props (React Router)
    const id = propSessionId || (params?.sessionId as string | undefined) || `session-${Date.now()}`;
    setSessionId(id);
    
    // Check if role is passed via location state
    const state = location.state as { role?: 'hr' | 'candidate' } | null;
    if (state?.role) {
      setUserRole(state.role);
      setShowRoleSelection(false);
      // Auto-fill name based on role
      if (state.role === 'hr') {
        setUserName('HR Interviewer');
      } else {
        setUserName('Candidate');
      }
    }
    
    setIsLoading(false);
  }, [params.sessionId, propSessionId, location.state]);

  const handleRoleSelection = (role: 'hr' | 'candidate', name: string) => {
    setUserRole(role);
    setUserName(name);
    setShowRoleSelection(false);
  };

  const handleInterviewEnd = () => {
    setShowRoleSelection(true);
    setUserRole(null);
    setUserName('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-gray-400">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-400" size={24} />
            <h2 className="text-lg font-bold text-red-400">Error</h2>
          </div>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="max-w-2xl w-full mx-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">Interview Session</h1>
            <p className="text-gray-400">Join the live video conference</p>
            <p className="text-sm text-gray-500 mt-2">Session ID: {sessionId}</p>
          </div>

          {/* Interview Info Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{interviewInfo.position}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="text-lg font-semibold text-cyan-400">{interviewInfo.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interviewer</p>
                <p className="text-lg font-semibold text-purple-400">{interviewInfo.hrName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-100">{interviewInfo.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Ready
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{interviewInfo.description}</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HR Role */}
            <div className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-2 border-purple-700/50 rounded-lg p-8 hover:border-purple-600 transition cursor-pointer"
              onClick={() => handleRoleSelection('hr', interviewInfo.hrName)}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Join as HR</h3>
                <p className="text-gray-300 text-sm mb-4">Conduct the interview and evaluate the candidate</p>
                
                <div className="bg-purple-900/20 rounded p-3 mb-6 text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">You'll have access to:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✓ Live Scoring Panel</li>
                    <li>✓ Real-time Evaluation (30 sec delay)</li>
                    <li>✓ Feedback Recording</li>
                    <li>✓ Candidate Video Feed</li>
                  </ul>
                </div>

                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Enter as HR
                </button>
              </div>
            </div>

            {/* Candidate Role */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-gray-900 border-2 border-cyan-700/50 rounded-lg p-8 hover:border-cyan-600 transition cursor-pointer"
              onClick={() => handleRoleSelection('candidate', interviewInfo.candidateName)}>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-700">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">Join as Candidate</h3>
                <p className="text-gray-300 text-sm mb-4">Participate in the interview session</p>
                
                <div className="bg-cyan-900/20 rounded p-3 mb-6 text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">You'll have access to:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✓ Video Conferencing</li>
                    <li>✓ Interview Information</li>
                    <li>✓ Audio/Video Controls</li>
                    <li>✓ Duration Tracking</li>
                  </ul>
                </div>

                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Enter as Candidate
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-900/10 border border-blue-800 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> Ensure your camera and microphone are working properly before joining. 
              Test your connection and allow browser permissions when prompted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HRCandidateUnifiedInterview
      sessionId={sessionId}
      userRole={userRole!}
      userName={userName}
      peerName={userRole === 'hr' ? interviewInfo.candidateName : interviewInfo.hrName}
      onInterviewEnd={handleInterviewEnd}
      showWaitingScreen={userRole === 'candidate'}
    />
  );
};

export default InterviewLiveConferencePage;
