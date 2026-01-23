// CandidateInterviewHistory.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Star, Filter, Award, Clock, CheckCircle, XCircle, Eye, Download, BarChart, X } from './icons/Icons';

interface Interview {
  id: string;
  hrName: string;
  position: string;
  interviewDate: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'no-show';
  scores?: {
    confidence: number;
    technical: number;
    communication: number;
    problemSolving: number;
    overall: number;
  };
  feedback?: string;
  recommendation?: 'hire' | 'maybe' | 'reject';
  resultStatus: 'passed' | 'failed' | 'pending';
}

const CandidateInterviewHistory: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    resultStatus: 'all',
    dateRange: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    successRate: 0
  });

  useEffect(() => {
    // Mock data - Replace with API call
    const mockInterviews: Interview[] = [
      {
        id: 'INT-2024-001',
        hrName: 'Sarah Johnson',
        position: 'Frontend Developer',
        interviewDate: '2024-01-15T10:30:00',
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
        recommendation: 'hire',
        resultStatus: 'passed'
      },
      {
        id: 'INT-2024-002',
        hrName: 'Mike Chen',
        position: 'Backend Developer',
        interviewDate: '2024-01-12T14:00:00',
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
        recommendation: 'maybe',
        resultStatus: 'passed'
      },
      {
        id: 'INT-2024-003',
        hrName: 'Alex Rodriguez',
        position: 'Full Stack Developer',
        interviewDate: '2024-01-10T11:00:00',
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
        recommendation: 'maybe',
        resultStatus: 'passed'
      },
      {
        id: 'INT-2024-004',
        hrName: 'Emily Wilson',
        position: 'UX Designer',
        interviewDate: '2024-01-08T09:30:00',
        duration: 45,
        status: 'cancelled',
        resultStatus: 'pending'
      },
      {
        id: 'INT-2024-005',
        hrName: 'David Kim',
        position: 'DevOps Engineer',
        interviewDate: '2024-01-05T13:00:00',
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
        recommendation: 'hire',
        resultStatus: 'passed'
      },
      {
        id: 'INT-2023-012',
        hrName: 'Lisa Wang',
        position: 'Product Manager',
        interviewDate: '2023-12-20T10:00:00',
        duration: 60,
        status: 'completed',
        scores: {
          confidence: 2.5,
          technical: 3.0,
          communication: 3.2,
          problemSolving: 2.8,
          overall: 2.9
        },
        feedback: 'Needs more experience in product strategy and stakeholder management.',
        recommendation: 'reject',
        resultStatus: 'failed'
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
        interview.position.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.hrName.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(interview => interview.status === filters.status);
    }

    // Apply result status filter
    if (filters.resultStatus !== 'all') {
      filtered = filtered.filter(interview => interview.resultStatus === filters.resultStatus);
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

      filtered = filtered.filter(interview => new Date(interview.interviewDate) >= cutoffDate);
    }

    setFilteredInterviews(filtered);
    calculateStats(filtered);
  }, [filters, interviews]);

  const calculateStats = (data: Interview[]) => {
    const completedInterviews = data.filter(i => i.status === 'completed' && i.scores);
    const totalScore = completedInterviews.reduce((sum, i) => sum + (i.scores?.overall || 0), 0);
    const passedInterviews = completedInterviews.filter(i => i.resultStatus === 'passed').length;

    setStats({
      total: data.length,
      completed: completedInterviews.length,
      averageScore: completedInterviews.length > 0 ? totalScore / completedInterviews.length : 0,
      successRate: completedInterviews.length > 0 ? (passedInterviews / completedInterviews.length) * 100 : 0
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const getResultStatusColor = (status: string) => {
    switch (status) {
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

  const getResultStatusIcon = (status: string) => {
    switch (status) {
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

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
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

  const downloadResult = (interviewId: string) => {
    // Implement download logic
    console.log('Downloading result for interview:', interviewId);
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
            onClick={() => navigate('/candidate/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Interview History</h1>
          <p className="text-gray-400">Track your past interviews and results</p>
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
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats.completed}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Completed</h3>
          </div>

          <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-xl">
                <Star className="w-6 h-6 text-yellow-400" />
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
              <span className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</span>
            </div>
            <h3 className="text-gray-400 text-sm">Success Rate</h3>
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
                  placeholder="Search by position, interviewer, or ID..."
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

            {/* Result Status Filter */}
            <div>
              <select
                value={filters.resultStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, resultStatus: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Results</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
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
        </div>

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map(interview => (
            <div
              key={interview.id}
              className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              {/* Interview Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{interview.position}</h3>
                  <p className="text-gray-400 text-sm">with {interview.hrName}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getResultStatusColor(interview.resultStatus)}`}>
                    {getResultStatusIcon(interview.resultStatus)}
                    <span className="text-sm font-medium capitalize">{interview.resultStatus}</span>
                  </span>
                </div>
              </div>

              {/* Interview Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{formatDate(interview.interviewDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{interview.duration} minutes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">ID: {interview.id}</span>
                </div>
              </div>

              {/* Scores (if available) */}
              {interview.scores && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-400 text-sm">Overall Score</h4>
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${getScoreColor(interview.scores.overall)}`} />
                      <span className={`font-bold ${getScoreColor(interview.scores.overall)}`}>
                        {interview.scores.overall.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-sm">/5.0</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(interview.scores.overall).replace('text-', 'bg-')}`}
                      style={{ width: `${(interview.scores.overall / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => viewInterviewDetails(interview)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {interview.status === 'completed' && interview.scores && (
                  <button
                    onClick={() => navigate(`/candidate/result/${interview.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300"
                    title="View Results"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                )}
                {interview.status === 'completed' && (
                  <button
                    onClick={() => downloadResult(interview.id)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-400 rounded-lg hover:border-purple-500/50 hover:bg-purple-600/30 transition-all duration-300"
                    title="Download Result"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
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
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Position</h3>
                  <p className="text-white text-lg font-bold">{selectedInterview.position}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Interviewer</h3>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-cyan-400" />
                    <p className="text-white text-lg">{selectedInterview.hrName}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Interview Date</h3>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <p className="text-white">{formatDate(selectedInterview.interviewDate)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Duration</h3>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <p className="text-white">{selectedInterview.duration} minutes</p>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-4 mb-8">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(selectedInterview.status)}`}>
                  {selectedInterview.status}
                </span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getResultStatusColor(selectedInterview.resultStatus)}`}>
                  {getResultStatusIcon(selectedInterview.resultStatus)}
                  <span className="font-medium capitalize">{selectedInterview.resultStatus}</span>
                </span>
              </div>

              {/* Scores Section */}
              {selectedInterview.scores && (
                <>
                  <h3 className="text-gray-400 text-sm mb-4">Evaluation Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Confidence', score: selectedInterview.scores.confidence },
                      { label: 'Technical', score: selectedInterview.scores.technical },
                      { label: 'Communication', score: selectedInterview.scores.communication },
                      { label: 'Problem Solving', score: selectedInterview.scores.problemSolving }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-xl p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}
                        </div>
                        <div className="text-gray-400 text-sm">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">Overall Score</h3>
                        <p className="text-gray-400 text-sm">Based on all evaluation criteria</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${getScoreColor(selectedInterview.scores.overall)}`}>
                          {selectedInterview.scores.overall.toFixed(1)}
                        </div>
                        <div className="text-gray-400 text-sm">out of 5.0</div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(selectedInterview.scores.overall).replace('text-', 'bg-')}`}
                        style={{ width: `${(selectedInterview.scores.overall / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Feedback */}
              {selectedInterview.feedback && (
                <div className="mb-8">
                  <h3 className="text-gray-400 text-sm mb-3">Feedback</h3>
                  <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                    <p className="text-gray-300 whitespace-pre-line">{selectedInterview.feedback}</p>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {selectedInterview.recommendation && (
                <div className={`p-4 rounded-2xl border ${
                  selectedInterview.recommendation === 'hire' ? 'border-green-500/30 bg-green-500/10' :
                  selectedInterview.recommendation === 'maybe' ? 'border-yellow-500/30 bg-yellow-500/10' :
                  'border-red-500/30 bg-red-500/10'
                }`}>
                  <h3 className="text-white font-bold mb-2">Recommendation</h3>
                  <p className="text-gray-300">
                    {selectedInterview.recommendation === 'hire' && 'The interviewer recommended you for the position.'}
                    {selectedInterview.recommendation === 'maybe' && 'The interviewer suggested considering you for other roles.'}
                    {selectedInterview.recommendation === 'reject' && 'The interviewer did not recommend you for this position.'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                {selectedInterview.status === 'completed' && (
                  <button
                    onClick={() => {
                      closeDetails();
                      navigate(`/candidate/result/${selectedInterview.id}`);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    View Detailed Results
                  </button>
                )}
                <button
                  onClick={closeDetails}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviewHistory;