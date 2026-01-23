// InterviewResult.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Star, BarChart, MessageSquare, Download, Share, CheckCircle, XCircle, Clock, User, Calendar, Target, TrendingUp, X } from './icons/Icons';

interface InterviewResult {
  id: string;
  candidateName: string;
  hrName: string;
  position: string;
  interviewDate: string;
  duration: number;
  scores: {
    confidence: number;
    technical: number;
    communication: number;
    problemSolving: number;
    overall: number;
  };
  feedback: {
    overall: string;
    strengths: string[];
    areasForImprovement: string[];
    hrComments: string;
  };
  recommendation: 'hire' | 'maybe' | 'reject';
  resultStatus: 'passed' | 'failed' | 'pending';
  percentile: number;
  comparison: {
    positionAverage: number;
    candidateAverage: number;
    improvement: number;
  };
}

const InterviewResult: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const interviewId = params.id as string;

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockResult: InterviewResult = {
      id: interviewId,
      candidateName: 'John Doe',
      hrName: 'Sarah Johnson',
      position: 'Frontend Developer',
      interviewDate: '2024-01-15T10:30:00',
      duration: 45,
      scores: {
        confidence: 4.5,
        technical: 4.0,
        communication: 4.2,
        problemSolving: 3.8,
        overall: 4.1
      },
      feedback: {
        overall: 'Strong technical skills and good communication. Shows good potential for the role. The candidate demonstrated excellent problem-solving abilities and communicated their thought process clearly.',
        strengths: [
          'Strong React and TypeScript knowledge',
          'Clear and confident communication',
          'Good problem-solving approach',
          'Professional demeanor'
        ],
        areasForImprovement: [
          'Could benefit from more advanced state management patterns',
          'Needs more experience with testing frameworks',
          'Could improve on system design questions'
        ],
        hrComments: 'Candidate shows strong potential and aligns well with our team culture. Would recommend for next round.'
      },
      recommendation: 'hire',
      resultStatus: 'passed',
      percentile: 85,
      comparison: {
        positionAverage: 3.8,
        candidateAverage: 4.1,
        improvement: 8
      }
    };

    setResult(mockResult);
    setLoading(false);
  }, [interviewId]);

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-green-500/20 border-green-500/30';
    if (score >= 3) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maybe':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reject':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return <CheckCircle className="w-5 h-5" />;
      case 'maybe':
        return <Clock className="w-5 h-5" />;
      case 'reject':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Downloading result PDF...');
      // Implement actual PDF generation/download here
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Interview Result - ${result?.position}`,
        text: `Check out my interview results for ${result?.position}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading interview results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-6">The interview results you're looking for don't exist.</p>
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate('/candidate/history')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to History
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Interview Results</h1>
          <p className="text-gray-400">Detailed feedback and evaluation from your interview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Overview */}
          <div className="lg:col-span-2">
            {/* Result Header */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{result.position}</h2>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(result.interviewDate)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {result.hrName}
                    </span>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${getRecommendationColor(result.recommendation)}`}>
                  {getRecommendationIcon(result.recommendation)}
                  <span className="font-bold capitalize">{result.recommendation}</span>
                </div>
              </div>

              {/* Overall Score */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.scores.overall)}`}>
                    {result.scores.overall.toFixed(1)}
                  </div>
                  <div className="text-gray-400">Overall Score</div>
                  <div className="flex items-center gap-2 mt-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(result.scores.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{result.percentile}%</div>
                    <div className="text-gray-400 text-sm">Percentile Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{result.duration}</div>
                    <div className="text-gray-400 text-sm">Minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                  <BarChart className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Detailed Evaluation</h2>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Confidence & Presence', score: result.scores.confidence, description: 'Self-assurance, body language, professional presence' },
                  { label: 'Technical Skills', score: result.scores.technical, description: 'Knowledge of technologies, coding ability, technical depth' },
                  { label: 'Communication', score: result.scores.communication, description: 'Clarity, articulation, active listening, response quality' },
                  { label: 'Problem Solving', score: result.scores.problemSolving, description: 'Analytical thinking, creativity, solution approach' }
                ].map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold">{category.label}</h3>
                        <p className="text-gray-400 text-sm">{category.description}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full border ${getScoreBgColor(category.score)}`}>
                        <span className={`font-bold ${getScoreColor(category.score)}`}>
                          {category.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(category.score).replace('text-', 'bg-')}`}
                        style={{ width: `${(category.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison */}
              <div className="mt-8 p-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-bold">Performance Comparison</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{result.comparison.candidateAverage.toFixed(1)}</div>
                    <div className="text-gray-400 text-sm">Your Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{result.comparison.positionAverage.toFixed(1)}</div>
                    <div className="text-gray-400 text-sm">Position Average</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${result.comparison.improvement >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {result.comparison.improvement >= 0 ? '↑' : '↓'}
                    <span>{Math.abs(result.comparison.improvement)}% {result.comparison.improvement >= 0 ? 'above' : 'below'} average</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Detailed Feedback</h2>
              </div>

              <div className="space-y-8">
                {/* Overall Feedback */}
                <div>
                  <h3 className="text-white font-bold mb-3">Overall Assessment</h3>
                  <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
                    <p className="text-gray-300">{result.feedback.overall}</p>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-bold mb-3">Key Strengths</h3>
                    <ul className="space-y-2">
                      {result.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          </div>
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-3">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {result.feedback.areasForImprovement.map((area, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Target className="w-3 h-3 text-yellow-400" />
                          </div>
                          <span className="text-gray-300">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* HR Comments */}
                <div>
                  <h3 className="text-white font-bold mb-3">Interviewer Comments</h3>
                  <div className="p-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl">
                    <p className="text-gray-300 italic">{result.feedback.hrComments}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Insights */}
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    downloading
                      ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-600/30'
                  }`}
                >
                  {downloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Results
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-400 rounded-xl font-semibold hover:border-purple-500/50 hover:bg-purple-600/30 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Share className="w-5 h-5" />
                  Share Results
                </button>

                <button
                  onClick={() => navigate('/candidate/schedule')}
                  className="w-full py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-xl font-semibold hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300"
                >
                  Schedule Another Interview
                </button>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Next Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Review Feedback</h4>
                    <p className="text-gray-400 text-sm">Carefully read through the detailed feedback provided</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Practice Areas</h4>
                    <p className="text-gray-400 text-sm">Focus on improving the identified areas for growth</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Follow Up</h4>
                    <p className="text-gray-400 text-sm">The company will contact you regarding next steps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Performance Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interview Score</span>
                  <span className={`font-bold ${getScoreColor(result.scores.overall)}`}>
                    {result.scores.overall.toFixed(1)}/5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Compared to Average</span>
                  <span className={`font-bold ${result.comparison.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.comparison.improvement >= 0 ? '+' : ''}{result.comparison.improvement}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Percentile Rank</span>
                  <span className="font-bold text-white">{result.percentile}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Recommendation</span>
                  <span className={`font-bold capitalize ${result.recommendation === 'hire' ? 'text-green-400' : result.recommendation === 'maybe' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Interview Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Interview Completed</p>
                    <p className="text-gray-400 text-xs">{formatDate(result.interviewDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Evaluation Submitted</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Results Available</p>
                    <p className="text-gray-400 text-xs">Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Next Steps</p>
                    <p className="text-gray-400 text-xs">Awaiting company response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;