// Updated Dashboard.tsx with AI Interview Integration
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface InterviewSession {
  id: string;
  type: 'ai' | 'hr';
  title: string;
  status: 'completed' | 'scheduled' | 'in-progress' | 'upcoming';
  date: string;
  duration: string;
  score?: number;
  feedback?: string;
  interviewer?: string;
  jobRole?: string;
}

interface UserStats {
  interviewsCompleted: number;
  successRate: number;
  avgScore: number;
  upcomingSessions: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'hr' | 'history'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  

  const [userStats, setUserStats] = useState<UserStats>({
    interviewsCompleted: 12,
    successRate: 87,
    avgScore: 8.2,
    upcomingSessions: 3
  });

  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([
    {
      id: '1',
      type: 'ai',
      title: 'Technical Software Engineer',
      status: 'completed',
      date: '2024-12-20',
      duration: '45 min',
      score: 8.5,
      feedback: 'Excellent technical knowledge, improve communication clarity',
      jobRole: 'Software Engineer'
    },
    {
      id: '2',
      type: 'hr',
      title: 'Product Manager Interview',
      status: 'scheduled',
      date: '2024-12-22',
      duration: '60 min',
      interviewer: 'Sarah Johnson - Google HR',
      jobRole: 'Product Manager'
    },
    {
      id: '3',
      type: 'ai',
      title: 'Behavioral Assessment',
      status: 'completed',
      date: '2024-12-18',
      duration: '30 min',
      score: 7.8,
      feedback: 'Good leadership examples, work on STAR method structure',
      jobRole: 'Team Lead'
    },
    {
      id: '4',
      type: 'hr',
      title: 'Senior Developer Mock',
      status: 'upcoming',
      date: '2024-12-24',
      duration: '50 min',
      interviewer: 'Michael Chen - Microsoft',
      jobRole: 'Senior Developer'
    },
    {
      id: '5',
      type: 'ai',
      title: 'System Design Practice',
      status: 'in-progress',
      date: '2024-12-21',
      duration: '55 min',
      score: 8.9,
      jobRole: 'System Architect'
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const [showAIWelcome, setShowAIWelcome] = useState(false);

  const handleStartAIInterview = () => {
    navigate('/interview');
  };

  const handleStartHRInterview = () => {
    navigate('/candidate-dashboard');
  };

  const handleViewAIHistory = () => {
    window.location.href = '/interview/history?type=ai';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'upcoming': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: 'ai' | 'hr') => {
    if (type === 'ai') {
      return (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.205a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  const AIInterviewSection = () => {
    return (
      <div className="relative min-h-[500px] flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 rounded-full animate-spin-slow"></div>
      </div>

      <div className="relative z-10 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 max-w-4xl mx-auto w-full">
        {/* Floating AI Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-2xl blur-xl"></div>
          <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30">
            <div className="text-3xl">🤖</div>
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="text-yellow-400 animate-pulse">✨</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 animate-gradient">
            AI-Powered Interviews
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-300/90 max-w-3xl mx-auto mb-8 leading-relaxed">
          Practice with our advanced AI system. Get <span className="text-purple-300 font-semibold">real-time feedback</span>, 
          <span className="text-blue-300 font-semibold"> personalized questions</span>, and <span className="text-green-300 font-semibold">detailed analytics</span> 
          to excel in your interviews.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'AI Analysis', value: 'Real-time' },
            { label: 'Accuracy', value: '95%' },
            { label: 'Industries', value: '50+' },
            { label: 'Users Trained', value: '10K+' }
          ].map((stat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/30 border border-gray-700/50 hover:border-purple-500/30 transition-all">
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={handleStartAIInterview}
            className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2">
              <div>✨</div>
              Start AI Interview
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="group px-8 py-3 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 text-white font-bold transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative flex items-center justify-center gap-2">
              <div>📜</div>
              View AI History
            </span>
          </button>
        </div>

        {/* Features list */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'Personalized', desc: 'Tailored to your resume' },
              { icon: '⚡', title: 'Real-time', desc: 'Instant feedback & scoring' },
              { icon: '📊', title: 'Analytics', desc: 'Detailed insights' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/30">
                <div className="text-xl">{feature.icon}</div>
                <div className="text-left">
                  <div className="font-semibold text-white text-sm">{feature.title}</div>
                  <div className="text-xs text-gray-400">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  };

  const HistorySection = () => {
    const aiSessions = interviewSessions.filter(session => session.type === 'ai');
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">AI Interview History</h2>
          <button
            onClick={handleViewAIHistory}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all flex items-center gap-2"
          >
            Show Full History
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {aiSessions.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-gray-800/30 border border-gray-700/50">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-bold text-white mb-2">No AI Interviews Yet</h3>
            <p className="text-gray-400 mb-6">Start your first AI interview to track your progress</p>
            <button
              onClick={handleStartAIInterview}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold"
            >
              Start First AI Interview
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiSessions.slice(0, 6).map((session) => (
                <div 
                  key={session.id}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center">
                        <div className="text-lg">🤖</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{session.jobRole}</h3>
                        <div className="text-sm text-gray-400">{session.title}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">Date</div>
                      <div className="text-white">{new Date(session.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">Duration</div>
                      <div className="text-white">{session.duration}</div>
                    </div>
                    {session.score && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-400">Score</div>
                        <div className="flex items-center gap-2">
                          <div className="text-white font-bold">{session.score}/10</div>
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${session.score * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {session.feedback && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="text-sm text-gray-400 line-clamp-2">{session.feedback}</div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => window.location.href = `/interview/report/${session.id}`}
                    className="w-full mt-4 py-2 border border-gray-700 text-gray-400 rounded-xl hover:text-white hover:border-cyan-500/50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
            
            {aiSessions.length > 6 && (
              <div className="text-center pt-6">
                <button
                  onClick={handleViewAIHistory}
                  className="px-8 py-3 border border-gray-700 text-gray-400 rounded-xl hover:text-white hover:border-cyan-500/50 transition-colors flex items-center gap-2 mx-auto"
                >
                  View All {aiSessions.length} AI Interviews
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Stats Summary */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6">AI Interview Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-white">{aiSessions.length}</div>
              <div className="text-gray-400 text-sm">Total AI Interviews</div>
            </div>
            <div className="bg-gray-800/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-white">
                {aiSessions.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / aiSessions.filter(s => s.score).length || 0}
              </div>
              <div className="text-gray-400 text-sm">Average Score</div>
            </div>
            <div className="bg-gray-800/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-white">
                {aiSessions.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="bg-gray-800/20 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-white">
                {aiSessions.filter(s => s.score && s.score >= 8).length}
              </div>
              <div className="text-gray-400 text-sm">High Scores (8+)</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ title, description, icon, actionText, onClick, gradient }: any) => (
    <div 
      className={`p-6 rounded-2xl border border-gray-700/50 hover:border-${gradient.split('-')[1]}-500/50 transition-all duration-300 cursor-pointer group`}
      onClick={onClick}
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button className={`text-${gradient.split('-')[1]}-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all`}>
        {actionText}
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );

  const StatCard = ({ title, value, change, color }: any) => (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
      <div className="text-gray-400 text-sm mb-2">{title}</div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      {change && (
        <div className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
        </div>
      )}
      <div className={`mt-4 w-full h-2 rounded-full bg-gray-700`}>
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${Math.min(100, value)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.5); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Interview Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your interview preparation overview</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <div className="text-white font-semibold">Anna Sharma</div>
                  <div className="text-gray-400 text-sm">Computer Science Student</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700/50 pb-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ai', label: 'AI Interviews' },
              { id: 'hr', label: 'HR Live Sessions' },
              { id: 'history', label: 'History' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Interviews Completed" 
                  value={userStats.interviewsCompleted} 
                  change={12} 
                  color="from-cyan-500 to-blue-500"
                />
                <StatCard 
                  title="Success Rate" 
                  value={`${userStats.successRate}%`} 
                  change={8} 
                  color="from-green-500 to-emerald-500"
                />
                <StatCard 
                  title="Average Score" 
                  value={userStats.avgScore.toFixed(1)} 
                  change={5} 
                  color="from-purple-500 to-pink-500"
                />
                <StatCard 
                  title="Upcoming Sessions" 
                  value={userStats.upcomingSessions} 
                  change={3} 
                  color="from-yellow-500 to-orange-500"
                />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <QuickActionCard
                    title="Start AI Interview"
                    description="Practice with adaptive AI that responds to your answers in real-time"
                    icon={<div className="text-cyan-400">🤖</div>}
                    actionText="Start Now"
                    onClick={handleStartAIInterview}
                    gradient="from-cyan-500 to-blue-500"
                  />
                  
                  <QuickActionCard
                    title="HR Live Interview"
                    description="Start a live HR mock interview with certified professionals"
                    icon={<div className="text-purple-400">👥</div>}
                    actionText="Start Now"
                    onClick={handleStartHRInterview}
                    gradient="from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            </>
          ) : activeTab === 'ai' ? (
            <AIInterviewSection />
          ) : activeTab === 'history' ? (
            <HistorySection />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-4">HR Live Sessions</h2>
              <p className="text-gray-400 mb-8">Start live sessions with HR professionals</p>
              <button
                onClick={handleStartHRInterview}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
              >
                Start Now
              </button>
            </div>
          )}
        </div>

        
      </div>
    </>
  );
};

export default Dashboard;