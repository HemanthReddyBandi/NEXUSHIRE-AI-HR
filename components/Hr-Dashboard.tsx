// HRDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Clock, BarChart3, AlertCircle } from './icons/Icons';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number;
}

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    averageScore: 0
  });

  useEffect(() => {
    // Mock data - Replace with API call
    const mockInterviews: Interview[] = [
      {
        id: '1',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        position: 'Frontend Developer',
        scheduledTime: '2024-01-15T10:30:00',
        status: 'scheduled',
        duration: 45
      },
      {
        id: '2',
        candidateName: 'Jane Smith',
        candidateEmail: 'jane@example.com',
        position: 'Backend Developer',
        scheduledTime: '2024-01-15T14:00:00',
        status: 'completed',
        duration: 60
      },
      {
        id: '3',
        candidateName: 'Mike Johnson',
        candidateEmail: 'mike@example.com',
        position: 'Full Stack Developer',
        scheduledTime: '2024-01-16T11:00:00',
        status: 'scheduled',
        duration: 45
      },
      {
        id: '4',
        candidateName: 'Sarah Wilson',
        candidateEmail: 'sarah@example.com',
        position: 'UX Designer',
        scheduledTime: '2024-01-14T09:30:00',
        status: 'completed',
        duration: 50
      }
    ];

    setInterviews(mockInterviews);
    setStats({
      totalInterviews: 42,
      completedInterviews: 35,
      pendingInterviews: 7,
      averageScore: 4.2
    });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-float" style={{ animationDelay: '10s' }}></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">HR Dashboard</h1>
          <p className="text-gray-400">Manage interviews and evaluate candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalInterviews}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Interviews</h3>
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.completedInterviews}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Completed</h3>
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.pendingInterviews}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Pending</h3>
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.averageScore}/5.0</span>
            </div>
            <h3 className="text-gray-400 text-sm">Avg. Score</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/candidate-dashboard')}
            className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <svg className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Schedule Interview</h3>
            <p className="text-gray-400 text-sm">Create new interview session</p>
          </button>

          <button
            onClick={() => navigate('/hr/candidates')}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <svg className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Manage Candidates</h3>
            <p className="text-gray-400 text-sm">View candidate profiles</p>
          </button>

          <button
            onClick={() => navigate('/hr/history')}
            className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <svg className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Interview History</h3>
            <p className="text-gray-400 text-sm">Review past interviews</p>
          </button>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">Upcoming Interviews</h2>
            <p className="text-gray-400 text-sm">Scheduled interviews for next 7 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-400 font-medium">Candidate</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Position</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Scheduled Time</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{interview.candidateName}</p>
                        <p className="text-gray-400 text-sm">{interview.candidateEmail}</p>
                      </div>
                    </td>
                    <td className="p-4 text-white">{interview.position}</td>
                    <td className="p-4 text-gray-300">{formatDate(interview.scheduledTime)}</td>
                    <td className="p-4 text-gray-300">{interview.duration} min</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                        {getStatusIcon(interview.status)}
                        <span className="text-sm font-medium capitalize">{interview.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {interview.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => navigate(`/interview/${interview.id}`, { state: { role: 'hr' } })}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm font-semibold"
                            >
                              Start Interview
                            </button>
                            <button
                              onClick={() => {
                                // Copy session link to clipboard
                                const sessionLink = `${window.location.origin}/interview/${interview.id}`;
                                navigator.clipboard.writeText(sessionLink);
                                alert(`Interview link copied!\n\n${sessionLink}`);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-sm"
                            >
                              Share Link
                            </button>
                          </>
                        )}
                        {interview.status === 'completed' && (
                          <button
                            onClick={() => navigate(`/hr/evaluate/${interview.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-sm"
                          >
                            Evaluate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-center border-t border-gray-700/50">
            <button
              onClick={() => navigate('/hr/history')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              View All Interviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;