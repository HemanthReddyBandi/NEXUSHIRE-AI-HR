'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, PhoneOff, Settings, X, Copy, Share2, Calendar, Clock, CheckCircle, AlertCircle, Maximize2, Minimize2 } from './icons/Icons';
import { useWebRTC } from '../hooks/useWebRTC';

interface UnifiedInterviewProps {
  sessionId: string;
  userRole: 'hr' | 'candidate';
  userName: string;
  peerName?: string;
  onInterviewEnd?: () => void;
  showWaitingScreen?: boolean;
}

interface ParticipantInfo {
  name: string;
  role: 'hr' | 'candidate';
  isOnline: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const HRCandidateUnifiedInterview: React.FC<UnifiedInterviewProps> = ({
  sessionId,
  userRole,
  userName,
  peerName = userRole === 'hr' ? 'Candidate' : 'HR',
  onInterviewEnd,
  showWaitingScreen = false
}) => {
  // WebRTC State
  const webrtcHook = useWebRTC();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Interview State
  const [isJoined, setIsJoined] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [joinError, setJoinError] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [showCandidateJoinModal, setShowCandidateJoinModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showWaitingForHR, setShowWaitingForHR] = useState(showWaitingScreen);
  const [mediaSettings, setMediaSettings] = useState({
    audioEnabled: true,
    videoEnabled: true,
    screenShareEnabled: false
  });

  // HR Scoring State (HR only)
  const [scores, setScores] = useState({
    confidence: 0,
    technical: 0,
    communication: 0
  });

  // Participant State
  const [participants, setParticipants] = useState<Record<string, ParticipantInfo>>({
    local: {
      name: userName,
      role: userRole,
      isOnline: false,
      audioEnabled: true,
      videoEnabled: true
    },
    remote: {
      name: peerName,
      role: userRole === 'hr' ? 'candidate' : 'hr',
      isOnline: false,
      audioEnabled: false,
      videoEnabled: false
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    endTime: null as Date | null,
    totalParticipants: 2,
    recordingStatus: 'not-recording' as 'recording' | 'not-recording'
  });

  // Join Interview Handler
  const handleJoinInterview = async () => {
    try {
      setIsJoining(true);
      setJoinError('');
      
      console.log('Attempting to join interview...', { sessionId, userRole, userName });
      
      // Close waiting screen for candidates
      if (userRole === 'candidate') {
        setShowWaitingForHR(false);
        console.log('Candidate waiting screen dismissed, activating camera...');
      }
      
      // Start local stream
      const stream = await webrtcHook.startCall();
      
      console.log('Stream obtained:', { stream, hasVideo: stream?.getVideoTracks().length, hasAudio: stream?.getAudioTracks().length });
      
      if (!stream) {
        throw new Error('Failed to get media stream');
      }
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Video stream attached to ref');
      }
      
      setParticipants(prev => ({
        ...prev,
        local: { ...prev.local, isOnline: true, videoEnabled: true }
      }));
      
      setIsJoined(true);
      setIsJoining(false);
      
      // Show candidate join modal for HR only
      if (userRole === 'hr') {
        setTimeout(() => {
          setShowCandidateJoinModal(true);
        }, 500);
      }
      
      console.log('Successfully joined interview');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to access camera/microphone';
      console.error('Failed to join interview:', error);
      setJoinError(errorMsg);
      setIsJoining(false);
      alert(`Error: ${errorMsg}\n\nPlease ensure:\n1. Camera/microphone permissions are granted\n2. No other app is using the camera\n3. Your browser supports WebRTC`);
    }
  };

  // Leave Interview Handler
  const handleLeaveInterview = async () => {
    try {
      webrtcHook.endCall();
      setIsCallActive(false);
      setIsJoined(false);
      sessionStats.endTime = new Date();
      setSessionStats({ ...sessionStats });
      
      if (onInterviewEnd) {
        onInterviewEnd();
      }
    } catch (error) {
      console.error('Failed to leave interview:', error);
    }
  };

  // Toggle Audio
  const handleToggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setMediaSettings(prev => ({
        ...prev,
        audioEnabled: !prev.audioEnabled
      }));
      setParticipants(prev => ({
        ...prev,
        local: { ...prev.local, audioEnabled: !prev.audioEnabled }
      }));
    }
  };

  // Toggle Video
  const handleToggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setMediaSettings(prev => ({
        ...prev,
        videoEnabled: !prev.videoEnabled
      }));
      setParticipants(prev => ({
        ...prev,
        local: { ...prev.local, videoEnabled: !prev.videoEnabled }
      }));
    }
  };

  // Update Call Duration
  useEffect(() => {
    if (!isCallActive) return;

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCallActive]);

  // Monitor WebRTC Connection
  useEffect(() => {
    if (webrtcHook.isConnected) {
      setIsCallActive(true);
      if (remoteVideoRef.current && webrtcHook.remoteStream) {
        remoteVideoRef.current.srcObject = webrtcHook.remoteStream;
        console.log('Remote stream attached to video ref', { 
          hasRemoteStream: !!webrtcHook.remoteStream,
          videoTracks: webrtcHook.remoteStream?.getVideoTracks().length 
        });
        setParticipants(prev => ({
          ...prev,
          remote: { 
            ...prev.remote, 
            isOnline: true,
            videoEnabled: true 
          }
        }));
      }
    }
  }, [webrtcHook.isConnected, webrtcHook.remoteStream]);

  // Format Duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Score Change (HR only)
  const handleScoreChange = (category: 'confidence' | 'technical' | 'communication', value: number) => {
    if (userRole !== 'hr') return;
    
    setScores(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-900/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/30';
    if (score >= 40) return 'text-orange-400 bg-orange-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-950 text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Candidate Join Modal */}
      {showCandidateJoinModal && userRole === 'hr' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-cyan-500/20">
            {/* Close Button */}
            <button
              onClick={() => setShowCandidateJoinModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X size={24} className="text-gray-400" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">Interview Started</h2>
              <p className="text-gray-300 text-sm">Share this link with the candidate to join the interview</p>
            </div>

            {/* Interview Info */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-600/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Session Status</p>
                  <p className="text-sm font-semibold text-cyan-400">Ready for Candidate</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Session ID: {sessionId}</p>
            </div>

            {/* Interview Link Section */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Interview Link</p>
              <div className="bg-gray-950 border border-gray-700 rounded-lg p-3 flex items-center justify-between gap-2 mb-3">
                <code className="text-xs text-cyan-300 break-all flex-1">
                  {`${window.location.origin}/interview/${sessionId}`}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/interview/${sessionId}`);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className={`flex-shrink-0 p-2 rounded-lg transition ${
                    linkCopied
                      ? 'bg-green-600/30 text-green-400'
                      : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400'
                  }`}
                  title="Copy link"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {linkCopied ? '✓ Link copied to clipboard!' : 'Copy and share this link with the candidate'}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-blue-300 font-semibold mb-2">How to Share:</p>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>1. Copy the link above</li>
                <li>2. Send via email or messaging app</li>
                <li>3. Candidate clicks the link</li>
                <li>4. Candidate joins as "Candidate"</li>
                <li>5. Interview begins immediately</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/interview/${sessionId}`);
                  setLinkCopied(true);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Copy Link to Clipboard
              </button>

              <button
                onClick={() => setShowCandidateJoinModal(false)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-lg transition border border-gray-700 hover:border-gray-600"
              >
                Continue Interview
              </button>
            </div>

            {/* Info Banner */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                💡 You can open this message again by looking at the interview information panel
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Waiting Screen - Shows when candidate hasn't joined yet */}
      {showWaitingForHR && userRole === 'candidate' && !isJoined && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center z-40">
          <div className="max-w-md w-full mx-4">
            {/* Waiting Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-2xl p-8 text-center shadow-2xl shadow-cyan-500/20">
              {/* Animated Icon */}
              <div className="mb-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock size={40} className="text-cyan-400 animate-spin" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Waiting for HR</h2>
              <p className="text-gray-300 mb-6">The interview is waiting for the HR to join...</p>

              {/* Status Dots */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-xs text-blue-300 font-semibold mb-2">Session ID:</p>
                <p className="text-sm text-blue-200 font-mono">{sessionId}</p>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-400 mb-2">What happens next:</p>
                <ul className="text-xs text-gray-300 space-y-1 text-left">
                  <li>✓ HR joins the interview</li>
                  <li>✓ Your camera will activate</li>
                  <li>✓ You'll see HR on your screen</li>
                  <li>✓ Interview begins</li>
                </ul>
              </div>

              {/* Join Button */}
              <button
                onClick={() => {
                  setShowWaitingForHR(false);
                  handleJoinInterview();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Video size={20} />
                Join Interview Now
              </button>

              {/* Help Text */}
              <p className="text-xs text-gray-500 mt-6">
                Your camera and microphone permissions will be requested when you join.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-cyan-400">Interview Session</h1>
            <span className="text-sm text-gray-400">ID: {sessionId}</span>
            {isCallActive && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {formatDuration(callDuration)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isJoined && (
              <>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-6 overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Video Grid - Always 2 columns when joined */}
          <div className={`flex-1 grid gap-4 ${isJoined ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Local Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ display: mediaSettings.videoEnabled ? 'block' : 'none' }}
              />
              {!mediaSettings.videoEnabled && (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <VideoOff size={48} />
                  <span>Camera Off</span>
                </div>
              )}
              
              {/* Local Label */}
              <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-2 rounded-lg border border-gray-700">
                <p className="font-semibold text-cyan-400">{userName} (You)</p>
                <p className="text-sm text-gray-400">{userRole.toUpperCase()}</p>
              </div>

              {/* Audio Indicator */}
              <div className="absolute top-4 right-4 flex gap-2">
                {mediaSettings.audioEnabled ? (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Microphone On"></div>
                ) : (
                  <div className="w-3 h-3 bg-red-400 rounded-full" title="Microphone Off"></div>
                )}
              </div>
            </div>

            {/* Remote Video - Always show when joined */}
            {isJoined && (
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 flex items-center justify-center">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ display: participants.remote.videoEnabled && participants.remote.isOnline ? 'block' : 'none' }}
                />
                
                {!participants.remote.isOnline && (
                  <div className="flex flex-col items-center gap-4 text-gray-400">
                    <AlertCircle size={48} />
                    <div className="text-center">
                      <p className="font-semibold">{peerName}</p>
                      <p className="text-sm">Waiting to join...</p>
                    </div>
                  </div>
                )}

                {participants.remote.isOnline && !participants.remote.videoEnabled && (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <VideoOff size={48} />
                    <span>Camera Off</span>
                  </div>
                )}

                {/* Remote Label */}
                <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-2 rounded-lg border border-gray-700">
                  <p className="font-semibold text-purple-400">{peerName}</p>
                  <p className="text-sm text-gray-400">{participants.remote.role.toUpperCase()}</p>
                </div>

                {/* Status Indicator */}
                {participants.remote.isOnline && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-900/50 px-3 py-1 rounded-full border border-green-700">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-sm text-green-400">Connected</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2">
            {joinError && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Failed to join</p>
                  <p className="text-xs text-red-300">{joinError}</p>
                </div>
              </div>
            )}
            <div className="flex justify-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
              {!isJoined ? (
                <button
                  onClick={handleJoinInterview}
                  disabled={isJoining}
                  className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {isJoining ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <Video size={20} />
                      Join Interview
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleToggleAudio}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                      mediaSettings.audioEnabled
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                        : 'bg-red-900 hover:bg-red-800 text-red-100'
                    }`}
                  >
                    {mediaSettings.audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    {mediaSettings.audioEnabled ? 'Mute' : 'Unmute'}
                  </button>

                  <button
                    onClick={handleToggleVideo}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                      mediaSettings.videoEnabled
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                        : 'bg-red-900 hover:bg-red-800 text-red-100'
                    }`}
                  >
                    {mediaSettings.videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                    {mediaSettings.videoEnabled ? 'Stop Video' : 'Start Video'}
                  </button>

                  <button
                    onClick={handleLeaveInterview}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
                  >
                    <PhoneOff size={20} />
                    End Call
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - HR Scoring or Info */}
        {isJoined && (
          <div className="w-80 bg-gray-900 rounded-lg border border-gray-800 p-6 flex flex-col gap-6 overflow-y-auto">
            {userRole === 'hr' ? (
              <>
                {/* HR Scoring Panel */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">Candidate Evaluation</h3>
                  
                  {/* Confidence Score */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Confidence (30%)</label>
                      <span className={`text-lg font-bold px-3 py-1 rounded-lg ${getScoreColor(scores.confidence)}`}>
                        {scores.confidence}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scores.confidence}
                      onChange={(e) => handleScoreChange('confidence', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <textarea
                      placeholder="Confidence feedback..."
                      className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:border-cyan-500 outline-none resize-none h-20"
                    />
                  </div>

                  {/* Technical Score */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Technical (40%)</label>
                      <span className={`text-lg font-bold px-3 py-1 rounded-lg ${getScoreColor(scores.technical)}`}>
                        {scores.technical}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scores.technical}
                      onChange={(e) => handleScoreChange('technical', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <textarea
                      placeholder="Technical feedback..."
                      className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 outline-none resize-none h-20"
                    />
                  </div>

                  {/* Communication Score */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Communication (30%)</label>
                      <span className={`text-lg font-bold px-3 py-1 rounded-lg ${getScoreColor(scores.communication)}`}>
                        {scores.communication}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scores.communication}
                      onChange={(e) => handleScoreChange('communication', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <textarea
                      placeholder="Communication feedback..."
                      className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:border-pink-500 outline-none resize-none h-20"
                    />
                  </div>

                  {/* Overall Score */}
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-cyan-500/30">
                    <p className="text-sm text-gray-400 mb-2">Overall Score</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {Math.round(
                        (scores.confidence * 0.3) + (scores.technical * 0.4) + (scores.communication * 0.3)
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Candidate Info Panel */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">Interview Information</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">HR Interviewer</p>
                      <p className="text-lg font-semibold text-gray-100">{peerName}</p>
                      <p className="text-sm text-gray-400">Connected</p>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Position</p>
                      <p className="text-lg font-semibold text-gray-100">Frontend Developer</p>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Interview Type</p>
                      <p className="text-lg font-semibold text-gray-100">Live Technical</p>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                      <p className="text-lg font-semibold text-gray-100">{formatDuration(callDuration)}</p>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-900/20 border border-blue-700 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-400 mb-2">Interview Tips</p>
                      <ul className="text-xs text-blue-200 space-y-1">
                        <li>✓ Ensure good lighting</li>
                        <li>✓ Keep background clean</li>
                        <li>✓ Check audio/video before joining</li>
                        <li>✓ Be professional and friendly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${webrtcHook.isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <span className="text-gray-400">
              {webrtcHook.connectionState || 'Not connected'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">{participants.local.isOnline ? 'Camera & Microphone: ON' : 'Camera & Microphone: OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default HRCandidateUnifiedInterview;
