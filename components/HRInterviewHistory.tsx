// HRInterviewHistory.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Star, Filter, Download, Eye, MessageSquare, BarChart, Clock, Award, X, Mail } from './icons/Icons';
import { getHRResults } from '../services/storageService';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  date: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'no-show';
  scores: {
    confidence: number;
    technical: number;
    communication: number;
    problemSolving: number;
    overall: number;
  };
  feedback: string;
  recommendation: 'hire' | 'maybe' | 'reject';
}

const HRInterviewHistory: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showResultsHistory, setShowResultsHistory] = useState(false);
  const [resultsHistory, setResultsHistory] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    recommendation: 'all',
    dateRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    averageScore: 0,
    hireRate: 0,
    avgDuration: 0
  });

  useEffect(() => {
    // Mock data - Replace with API call
    const mockInterviews: Interview[] = [
      {
        id: 'INT-2024-001',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        position: 'Frontend Developer',
        date: '2024-01-15T10:30:00',
        duration: 45,
        status: 'completed',
        scores: {
          confidence: 4.5,
          technical: 4.0,
          communication: 4.2,
          problemSolving: 3.8,
          overall: 4.1
        },
        feedback: 'Strong technical skills and good communication. Shows good potential for the role.',
        recommendation: 'hire'
      },
      {
        id: 'INT-2024-002',
        candidateName: 'Jane Smith',
        candidateEmail: 'jane@example.com',
        position: 'Backend Developer',
        date: '2024-01-14T14:00:00',
        duration: 60,
        status: 'completed',
        scores: {
          confidence: 3.5,
          technical: 4.5,
          communication: 3.8,
          problemSolving: 4.2,
          overall: 4.0
        },
        feedback: 'Excellent technical knowledge but needs to work on communication skills.',
        recommendation: 'maybe'
      },
      {
        id: 'INT-2024-003',
        candidateName: 'Mike Johnson',
        candidateEmail: 'mike@example.com',
        position: 'Full Stack Developer',
        date: '2024-01-12T11:00:00',
        duration: 50,
        status: 'completed',
        scores: {
          confidence: 4.0,
          technical: 3.5,
          communication: 4.5,
          problemSolving: 3.0,
          overall: 3.8
        },
        feedback: 'Great communicator but technical skills need improvement.',
        recommendation: 'maybe'
      },
      {
        id: 'INT-2024-004',
        candidateName: 'Sarah Wilson',
        candidateEmail: 'sarah@example.com',
        position: 'UX Designer',
        date: '2024-01-10T09:30:00',
        duration: 45,
        status: 'cancelled',
        scores: {
          confidence: 0,
          technical: 0,
          communication: 0,
          problemSolving: 0,
          overall: 0
        },
        feedback: 'Interview cancelled by candidate.',
        recommendation: 'maybe'
      },
      {
        id: 'INT-2024-005',
        candidateName: 'Alex Brown',
        candidateEmail: 'alex@example.com',
        position: 'DevOps Engineer',
        date: '2024-01-08T13:00:00',
        duration: 55,
        status: 'completed',
        scores: {
          confidence: 4.8,
          technical: 4.7,
          communication: 4.5,
          problemSolving: 4.6,
          overall: 4.7
        },
        feedback: 'Exceptional candidate with strong skills across all areas.',
        recommendation: 'hire'
      }
    ];

    setInterviews(mockInterviews);
    setFilteredInterviews(mockInterviews);
    calculateStats(mockInterviews);
  }, []);

  useEffect(() => {
    let filtered = interviews;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(interview =>
        interview.candidateName.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.candidateEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.position.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(interview => interview.status === filters.status);
    }

    // Apply recommendation filter
    if (filters.recommendation !== 'all') {
      filtered = filtered.filter(interview => interview.recommendation === filters.recommendation);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(interview => new Date(interview.date) >= cutoffDate);
    }

    setFilteredInterviews(filtered);
    calculateStats(filtered);
  }, [filters, interviews]);

  const calculateStats = (data: Interview[]) => {
    const completedInterviews = data.filter(i => i.status === 'completed');
    const totalScore = completedInterviews.reduce((sum, i) => sum + i.scores.overall, 0);
    const totalDuration = completedInterviews.reduce((sum, i) => sum + i.duration, 0);
    const hireCount = completedInterviews.filter(i => i.recommendation === 'hire').length;

    setStats({
      total: data.length,
      averageScore: completedInterviews.length > 0 ? totalScore / completedInterviews.length : 0,
      hireRate: completedInterviews.length > 0 ? (hireCount / completedInterviews.length) * 100 : 0,
      avgDuration: completedInterviews.length > 0 ? totalDuration / completedInterviews.length : 0
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'no-show':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return 'bg-green-500/20 text-green-400';
      case 'maybe':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'reject':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const viewInterviewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  const closeDetails = () => {
    setSelectedInterview(null);
  };

  const exportToCSV = () => {
    // Implement CSV export logic
    console.log('Exporting to CSV...');
  };

  const viewResultsHistory = () => {
    const results = getHRResults();
    setResultsHistory(results);
    setShowResultsHistory(true);
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
          <button
            onClick={() => navigate('/hr/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Interview History</h1>
          <p className="text-gray-400">Review past interviews and evaluation results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Interviews</h3>
          </div>

          <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.averageScore.toFixed(1)}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Avg. Score</h3>
          </div>

          <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl">
                <BarChart className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.hireRate.toFixed(1)}%</span>
            </div>
            <h3 className="text-gray-400 text-sm">Hire Rate</h3>
          </div>

          <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.avgDuration.toFixed(0)}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Avg. Duration (min)</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by candidate, position, or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            {/* Recommendation Filter */}
            <div>
              <select
                value={filters.recommendation}
                onChange={(e) => setFilters(prev => ({ ...prev, recommendation: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Recommendations</option>
                <option value="hire">Hire</option>
                <option value="maybe">Maybe</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={viewResultsHistory}
              className="px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-xl hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300 flex items-center gap-3"
            >
              <Mail className="w-4 h-4" />
              Result History
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300 flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Interviews Table */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left p-4 text-gray-400 font-medium">Candidate</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Position</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date & Time</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Overall Score</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Recommendation</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map(interview => (
                  <tr key={interview.id} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{interview.candidateName}</p>
                          <p className="text-gray-400 text-sm">{interview.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">{interview.position}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{formatDate(interview.date)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{interview.duration} min</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {interview.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <Star className={`w-4 h-4 ${getScoreColor(interview.scores.overall)}`} />
                          <span className={`font-bold ${getScoreColor(interview.scores.overall)}`}>
                            {interview.scores.overall.toFixed(1)}
                          </span>
                          <span className="text-gray-400 text-sm">/5.0</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {interview.status === 'completed' ? (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRecommendationColor(interview.recommendation)}`}>
                          {interview.recommendation}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewInterviewDetails(interview)}
                          className="p-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {interview.status === 'completed' && (
                          <button
                            onClick={() => navigate(`/candidate/result/${interview.id}`)}
                            className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300"
                            title="View Candidate Result"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">No interviews found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Interview Details</h2>
                  <p className="text-gray-400">ID: {selectedInterview.id}</p>
                </div>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-800/30 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedInterview.candidateName}</h3>
                  <p className="text-gray-400">{selectedInterview.position}</p>
                  <p className="text-gray-400 text-sm">{selectedInterview.candidateEmail}</p>
                </div>
              </div>

              {/* Interview Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-2">Interview Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date & Time</span>
                        <span className="text-white">{formatDate(selectedInterview.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">{selectedInterview.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedInterview.status)}`}>
                          {selectedInterview.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recommendation</span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRecommendationColor(selectedInterview.recommendation)}`}>
                          {selectedInterview.recommendation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedInterview.status === 'completed' && (
                    <div>
                      <h4 className="text-gray-400 text-sm mb-2">Overall Score</h4>
                      <div className={`text-5xl font-bold text-center mb-2 ${getScoreColor(selectedInterview.scores.overall)}`}>
                        {selectedInterview.scores.overall.toFixed(1)}
                      </div>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${star <= Math.round(selectedInterview.scores.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedInterview.status === 'completed' && (
                  <div>
                    <h4 className="text-gray-400 text-sm mb-4">Detailed Scores</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Confidence', score: selectedInterview.scores.confidence },
                        { label: 'Technical Skills', score: selectedInterview.scores.technical },
                        { label: 'Communication', score: selectedInterview.scores.communication },
                        { label: 'Problem Solving', score: selectedInterview.scores.problemSolving }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">{item.label}</span>
                            <span className={`font-bold ${getScoreColor(item.score)}`}>
                              {item.score.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getScoreColor(item.score).replace('text-', 'bg-')}`}
                              style={{ width: `${(item.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {selectedInterview.status === 'completed' && (
                <div className="mb-8">
                  <h4 className="text-gray-400 text-sm mb-3">Feedback & Comments</h4>
                  <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                    <p className="text-gray-300 whitespace-pre-line">{selectedInterview.feedback}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/hr/evaluate/${selectedInterview.id}`)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Edit Evaluation
                </button>
                <button
                  onClick={() => navigate(`/candidate/result/${selectedInterview.id}`)}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                >
                  <Award className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results History Modal */}
      {showResultsHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-green-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700/50 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Mail className="w-6 h-6 text-green-400" />
                Submitted Results History
              </h2>
              <button
                onClick={() => setShowResultsHistory(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {resultsHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No results submitted yet</p>
                  <p className="text-gray-500 text-sm">Results sent to candidates will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resultsHistory.map((result) => (
                    <div
                      key={result.id}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:border-green-500/30 transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Candidate Info */}
                        <div>
                          <p className="text-gray-500 text-xs">Candidate</p>
                          <p className="text-white font-semibold">{result.candidateName}</p>
                          <p className="text-gray-400 text-sm">{result.candidateEmail}</p>
                        </div>

                        {/* HR Name */}
                        <div>
                          <p className="text-gray-500 text-xs">Submitted By</p>
                          <p className="text-white font-semibold">{result.hrName}</p>
                        </div>

                        {/* Date */}
                        <div>
                          <p className="text-gray-500 text-xs">Sent Date</p>
                          <p className="text-white font-semibold">
                            {new Date(result.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Scores Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-gray-500 text-xs">Confidence</p>
                          <p className="text-cyan-400 font-bold text-lg">{result.scores.confidence}/100</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-gray-500 text-xs">Technical</p>
                          <p className="text-cyan-400 font-bold text-lg">{result.scores.technical}/100</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-gray-500 text-xs">Communication</p>
                          <p className="text-cyan-400 font-bold text-lg">{result.scores.communication}/100</p>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                          <p className="text-gray-500 text-xs">Overall</p>
                          <p className="text-green-400 font-bold text-lg">{result.scores.overall}/100</p>
                        </div>
                      </div>

                      {/* Grade & Performance */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs">Grade</p>
                          <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold">
                            {result.grade}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Performance</p>
                          <div className={`inline-block px-3 py-1 rounded-lg font-bold ${
                            result.performanceLevel === 'Excellent' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                            result.performanceLevel === 'Good' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                            'bg-red-500/20 border border-red-500/30 text-red-400'
                          }`}>
                            {result.performanceLevel}
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      {result.feedback && (
                        <div>
                          <p className="text-gray-500 text-xs mb-2">Feedback</p>
                          <p className="text-gray-300 text-sm bg-gray-900/50 rounded-lg p-3 max-h-24 overflow-y-auto">
                            {result.feedback.general || result.feedback.confidence || 'No feedback provided'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700/50 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowResultsHistory(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRInterviewHistory;