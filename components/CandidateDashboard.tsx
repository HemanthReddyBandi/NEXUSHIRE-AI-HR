// CandidateDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Award, Star, Video, AlertCircle, CheckCircle, XCircle, Bell, FileText, X } from './icons/Icons';
import { getCandidateResults } from '../services/storageService';

interface UpcomingInterview {
  id: string;
  hrName: string;
  position: string;
  scheduledTime: string;
  duration: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  meetingLink: string;
}

interface RecentResult {
  id: string;
  position: string;
  interviewDate: string;
  overallScore: number;
  status: 'passed' | 'failed' | 'pending';
}

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([]);
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'interview', message: 'Interview scheduled for Frontend Developer', time: '2 hours ago', read: false },
    { id: 2, type: 'result', message: 'Your interview results are ready', time: '1 day ago', read: true },
    { id: 3, type: 'reminder', message: 'Interview reminder: Tomorrow at 10:30 AM', time: '2 days ago', read: false },
  ]);

  useEffect(() => {
    // Get HR sent results from storage
    const hrResults = getCandidateResults();
    
    // Convert HR results to RecentResult format
    const convertedResults: RecentResult[] = hrResults.map(hr => ({
      id: hr.id,
      position: hr.sessionId,
      interviewDate: hr.interviewDate,
      overallScore: hr.scores.overall,
      status: hr.scores.overall >= 70 ? 'passed' : 'pending'
    }));
    
    // Mock data - Replace with API call
    const mockUpcomingInterviews: UpcomingInterview[] = [
      {
        id: '1',
        hrName: 'Sarah Johnson',
        position: 'Frontend Developer',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        duration: 45,
        status: 'upcoming',
        meetingLink: 'https://interview-platform.com/join/abc123'
      },
      {
        id: '2',
        hrName: 'Mike Chen',
        position: 'React Developer',
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        duration: 60,
        status: 'upcoming',
        meetingLink: 'https://interview-platform.com/join/def456'
      }
    ];

    const mockRecentResults: RecentResult[] = [
      {
        id: '1',
        position: 'Full Stack Developer',
        interviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        overallScore: 4.2,
        status: 'passed'
      },
      {
        id: '2',
        position: 'Backend Developer',
        interviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        overallScore: 3.5,
        status: 'pending'
      }
    ];

    // Combine mock results with HR sent results
    const allResults = [...convertedResults, ...mockRecentResults];
    
    setUpcomingInterviews(mockUpcomingInterviews);
    setRecentResults(allResults);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Tomorrow at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'passed':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const joinInterview = (interviewId: string) => {
    // Navigate to the unified interview page with session ID
    console.log('Joining interview:', interviewId);
    navigate(`/interview/${interviewId}`);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'result':
        return <Award className="w-4 h-4 text-green-400" />;
      case 'reminder':
        return <Bell className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Candidate Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your interview overview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Interviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Interviews Section */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Upcoming Interviews</h2>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {upcomingInterviews.length} scheduled
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-700/50">
                {upcomingInterviews.map(interview => (
                  <div key={interview.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                            {getStatusIcon(interview.status)}
                            <span className="text-sm font-medium capitalize">{interview.status}</span>
                          </div>
                          <span className="text-gray-400 text-sm">ID: {interview.id}</span>
                        </div>
                        <h3 className="text-white text-lg font-bold">{interview.position}</h3>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatDate(interview.scheduledTime)}
                          </span>
                          <span>•</span>
                          <span>{interview.duration} minutes</span>
                          <span>•</span>
                          <span>with {interview.hrName}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => joinInterview(interview.id)}
                          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join Interview
                        </button>
                        <button
                          onClick={() => navigate(`/candidate/interview/${interview.id}`)}
                          className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {upcomingInterviews.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2">No upcoming interviews</h3>
                  <p className="text-gray-400">You don't have any scheduled interviews</p>
                  <button
                    onClick={() => navigate('/candidate/schedule')}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300"
                  >
                    Schedule Interview
                  </button>
                </div>
              )}
            </div>

            {/* Recent Results Section */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Recent Results</h2>
                  </div>
                  <button
                    onClick={() => navigate('/candidate/history')}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-700/50">
                {recentResults.map(result => (
                  <div key={result.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(result.status)}`}>
                            {getStatusIcon(result.status)}
                            <span className="text-sm font-medium capitalize">{result.status}</span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(result.interviewDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-white text-lg font-bold">{result.position}</h3>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">{result.overallScore.toFixed(1)}</div>
                          <div className="text-gray-400 text-sm">Overall Score</div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(result.overallScore) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => navigate(`/candidate/result/${result.id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {recentResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2">No recent results</h3>
                  <p className="text-gray-400">Your interview results will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Notifications */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Your Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interviews Completed</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="text-white font-bold">4.2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-white font-bold">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pending Results</span>
                  <span className="text-white font-bold">2</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-xl">
                      <Bell className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {notifications.filter(n => !n.read).length} unread
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-700/50 max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-800/30 transition-colors ${notification.read ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm mb-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="p-1 hover:bg-gray-800 rounded"
                          title="Mark as read"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No notifications</p>
                </div>
              )}

              <div className="p-4 border-t border-gray-700/50 text-center">
                <button
                          onClick={() => navigate('/candidate/notifications')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                >
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/candidate/profile')}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4" />
                  Update Profile
                </button>
                <button
                  onClick={() => navigate('/candidate/prepare')}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300 flex items-center gap-3"
                >
                  <Video className="w-4 h-4" />
                  Practice Interview
                </button>
                <button
                  onClick={() => navigate('/candidate/resume')}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4" />
                  Upload Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;