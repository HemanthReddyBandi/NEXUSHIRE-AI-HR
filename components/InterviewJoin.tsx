// InterviewJoin.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, Phone, Clock, User, Calendar, Shield, CheckCircle, AlertCircle, X } from './icons/Icons';

const InterviewJoin: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const interviewId = params.id as string;

  const [interviewInfo, setInterviewInfo] = useState({
    candidateName: '',
    hrName: '',
    position: '',
    scheduledTime: '',
    duration: 60,
    meetingLink: '',
    status: 'upcoming' as 'upcoming' | 'in-progress' | 'ended'
  });

  const [mediaState, setMediaState] = useState({
    videoEnabled: true,
    audioEnabled: true,
    isConnecting: false,
    connectionStatus: 'disconnected' as 'disconnected' | 'connecting' | 'connected'
  });

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockInterview = {
      candidateName: 'John Doe',
      hrName: 'Sarah Johnson',
      position: 'Frontend Developer',
      scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      duration: 60,
      meetingLink: `https://interview-platform.com/meeting/${interviewId}`,
      status: 'upcoming' as const
    };

    setInterviewInfo(mockInterview);

    // Check if interview can be joined (15 minutes before scheduled time)
    const checkJoinAvailability = () => {
      const scheduledTime = new Date(mockInterview.scheduledTime).getTime();
      const currentTime = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;
      
      setCanJoin(currentTime >= scheduledTime - fifteenMinutes);
      
      // Calculate time remaining
      if (currentTime < scheduledTime) {
        setTimeRemaining(Math.floor((scheduledTime - currentTime) / 1000));
      } else {
        setTimeRemaining(0);
      }
    };

    checkJoinAvailability();
    const interval = setInterval(checkJoinAvailability, 1000);

    // Request media permissions
    const requestMediaPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('Media permissions granted');
      } catch (error) {
        console.error('Media permissions denied:', error);
        setMediaState(prev => ({
          ...prev,
          videoEnabled: false,
          audioEnabled: false
        }));
      }
    };

    requestMediaPermissions();

    return () => clearInterval(interval);
  }, [interviewId]);

  const toggleVideo = () => {
    setMediaState(prev => ({
      ...prev,
      videoEnabled: !prev.videoEnabled
    }));
  };

  const toggleAudio = () => {
    setMediaState(prev => ({
      ...prev,
      audioEnabled: !prev.audioEnabled
    }));
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Interview starting soon...';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleJoinInterview = async () => {
    setMediaState(prev => ({ ...prev, isConnecting: true, connectionStatus: 'connecting' }));

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMediaState(prev => ({ ...prev, connectionStatus: 'connected', isConnecting: false }));
      setInterviewInfo(prev => ({ ...prev, status: 'in-progress' }));

      // In real implementation, this would initialize WebRTC connection
      console.log('Initializing WebRTC connection...');
      
      // Redirect to actual meeting or open in new tab
      window.open(interviewInfo.meetingLink, '_blank');
      
    } catch (error) {
      console.error('Failed to join interview:', error);
      setMediaState(prev => ({ ...prev, isConnecting: false, connectionStatus: 'disconnected' }));
    }
  };

  const handleLeaveInterview = () => {
    setMediaState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    setInterviewInfo(prev => ({ ...prev, status: 'ended' }));
    navigate('/candidate/dashboard');
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ended':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Join Interview</h1>
          <p className="text-gray-400">Prepare for your upcoming interview session</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Interview Info & Preview */}
          <div className="lg:col-span-2">
            {/* Interview Preview */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                      <Video className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Interview Preview</h2>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(interviewInfo.status)}`}>
                    {interviewInfo.status === 'upcoming' && <Clock className="w-4 h-4" />}
                    {interviewInfo.status === 'in-progress' && <CheckCircle className="w-4 h-4" />}
                    {interviewInfo.status === 'ended' && <AlertCircle className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">{interviewInfo.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6">
                  {mediaState.videoEnabled ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  {mediaState.connectionStatus === 'connected' && (
                    <div className="absolute top-4 left-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      Connected
                    </div>
                  )}
                  
                  {/* Name Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                    {interviewInfo.candidateName}
                  </div>

                  {/* Media Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full ${mediaState.videoEnabled ? 'bg-cyan-600/80 text-white' : 'bg-red-600/80 text-white'}`}
                    >
                      {mediaState.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={toggleAudio}
                      className={`p-3 rounded-full ${mediaState.audioEnabled ? 'bg-cyan-600/80 text-white' : 'bg-red-600/80 text-white'}`}
                    >
                      {mediaState.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Media Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`p-4 rounded-xl border ${mediaState.videoEnabled ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {mediaState.videoEnabled ? (
                        <Video className="w-5 h-5 text-green-400" />
                      ) : (
                        <VideoOff className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">Camera</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {mediaState.videoEnabled ? 'Connected and ready' : 'Camera is disabled'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl border ${mediaState.audioEnabled ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {mediaState.audioEnabled ? (
                        <Mic className="w-5 h-5 text-green-400" />
                      ) : (
                        <MicOff className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">Microphone</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {mediaState.audioEnabled ? 'Connected and ready' : 'Microphone is disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Interview Details</h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Candidate</label>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">{interviewInfo.candidateName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Interviewer</label>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-400" />
                      <span className="text-white">{interviewInfo.hrName}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Position</label>
                    <p className="text-white">{interviewInfo.position}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Scheduled Time</label>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{formatScheduledTime(interviewInfo.scheduledTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Interview ID</label>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-white font-mono">{interviewId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Join Controls */}
          <div className="space-y-8">
            {/* Timer & Status */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  {formatTimeRemaining(timeRemaining)}
                </div>
                <p className="text-gray-400">
                  {canJoin ? 'You can join now' : 'Join will be available 15 minutes before start'}
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${canJoin ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {canJoin ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-white font-medium">Join Status</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {canJoin 
                      ? 'You can join the interview now'
                      : `Join available in ${formatTimeRemaining(timeRemaining)}`
                    }
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">Security</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    This interview uses end-to-end encryption for privacy
                  </p>
                </div>
              </div>
            </div>

            {/* Join Controls */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="space-y-4">
                <button
                  onClick={handleJoinInterview}
                  disabled={!canJoin || mediaState.isConnecting || mediaState.connectionStatus === 'connected'}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    !canJoin || mediaState.isConnecting || mediaState.connectionStatus === 'connected'
                      ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/25'
                  }`}
                >
                  {mediaState.isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : mediaState.connectionStatus === 'connected' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Join Interview
                    </>
                  )}
                </button>

                {mediaState.connectionStatus === 'connected' && (
                  <button
                    onClick={handleLeaveInterview}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Leave Interview
                  </button>
                )}

                <button
                  onClick={() => navigate('/candidate/dashboard')}
                  className="w-full py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Quick Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-xs">1</span>
                  </div>
                  <span className="text-gray-400 text-sm">Ensure good lighting and a quiet environment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-xs">2</span>
                  </div>
                  <span className="text-gray-400 text-sm">Test your audio and video before joining</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-xs">3</span>
                  </div>
                  <span className="text-gray-400 text-sm">Have your resume and notes ready</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 text-xs">4</span>
                  </div>
                  <span className="text-gray-400 text-sm">Join 5-10 minutes before scheduled time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewJoin;