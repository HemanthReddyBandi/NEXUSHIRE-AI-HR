// InterviewEvaluation.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Star, MessageSquare, CheckCircle, XCircle, Clock, User, Award, ThumbsUp, AlertCircle, X } from './icons/Icons';

interface EvaluationForm {
  confidence: number;
  technical: number;
  communication: number;
  problemSolving: number;
  overallScore: number;
  feedback: string;
  strengths: string;
  areasForImprovement: string;
  recommendation: 'hire' | 'maybe' | 'reject';
}

interface InterviewInfo {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewDate: string;
  duration: number;
}

const InterviewEvaluation: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<InterviewInfo | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationForm>({
    confidence: 0,
    technical: 0,
    communication: 0,
    problemSolving: 0,
    overallScore: 0,
    feedback: '',
    strengths: '',
    areasForImprovement: '',
    recommendation: 'maybe'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockInterview: InterviewInfo = {
      id: interviewId,
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      position: 'Frontend Developer',
      interviewDate: new Date().toISOString(),
      duration: 45
    };
    setInterview(mockInterview);

    // Calculate overall score whenever component scores change
    const scores = [evaluation.confidence, evaluation.technical, evaluation.communication, evaluation.problemSolving];
    const average = scores.reduce((a, b) => a + b, 0) / (scores.filter(s => s > 0).length || 1);
    setEvaluation(prev => ({ ...prev, overallScore: parseFloat(average.toFixed(1)) }));
  }, [interviewId, evaluation.confidence, evaluation.technical, evaluation.communication, evaluation.problemSolving]);

  const handleScoreChange = (category: keyof EvaluationForm, value: number) => {
    setEvaluation(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvaluation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecommendationChange = (value: 'hire' | 'maybe' | 'reject') => {
    setEvaluation(prev => ({
      ...prev,
      recommendation: value
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call would go here
      console.log('Submitting evaluation:', evaluation);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/hr/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading interview details...</p>
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
            onClick={() => navigate('/hr/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Interview Evaluation</h1>
          <p className="text-gray-400">Evaluate candidate performance and provide detailed feedback</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Evaluation submitted successfully! Redirecting...</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Interview Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 sticky top-8">
              {/* Candidate Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{interview.candidateName}</h2>
                  <p className="text-gray-400 text-sm">{interview.position}</p>
                </div>
              </div>

              {/* Interview Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interview ID</span>
                  <span className="text-white font-mono text-sm">{interview.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white text-sm">{interview.candidateEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white text-sm">
                    {new Date(interview.interviewDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white text-sm">{interview.duration} minutes</span>
                </div>
              </div>

              {/* Overall Score Preview */}
              <div className={`border rounded-2xl p-6 ${getScoreBgColor(evaluation.overallScore)}`}>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold mb-2">
                    <span className={getScoreColor(evaluation.overallScore)}>
                      {evaluation.overallScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">Overall Score</div>
                </div>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(evaluation.overallScore) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Evaluation Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Evaluation Categories */}
              <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                    <Award className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Evaluation Categories</h2>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      id: 'confidence',
                      label: 'Confidence & Presence',
                      description: 'Candidate\'s self-assurance, body language, and professional presence',
                      value: evaluation.confidence
                    },
                    {
                      id: 'technical',
                      label: 'Technical Skills',
                      description: 'Knowledge of required technologies, problem-solving approach',
                      value: evaluation.technical
                    },
                    {
                      id: 'communication',
                      label: 'Communication Skills',
                      description: 'Clarity of expression, listening skills, articulation',
                      value: evaluation.communication
                    },
                    {
                      id: 'problemSolving',
                      label: 'Problem Solving',
                      description: 'Analytical thinking, creativity in solutions, approach to challenges',
                      value: evaluation.problemSolving
                    }
                  ].map(category => (
                    <div key={category.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-bold mb-1">{category.label}</h3>
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border ${getScoreBgColor(category.value)}`}>
                          <span className={`font-bold ${getScoreColor(category.value)}`}>
                            {category.value.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Score Slider */}
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={category.value}
                          onChange={(e) => handleScoreChange(category.id as keyof EvaluationForm, parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          {[0, 1, 2, 3, 4, 5].map(num => (
                            <span key={num} className="flex flex-col items-center">
                              <span>{num}</span>
                              {num === 0 && <span className="mt-1">Poor</span>}
                              {num === 5 && <span className="mt-1">Excellent</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Detailed Feedback</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-3">Overall Feedback</label>
                    <textarea
                      name="feedback"
                      value={evaluation.feedback}
                      onChange={handleTextChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                      placeholder="Provide overall feedback about the candidate's performance..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-3">Key Strengths</label>
                      <textarea
                        name="strengths"
                        value={evaluation.strengths}
                        onChange={handleTextChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-green-500/50 focus:outline-none transition-all"
                        placeholder="What did the candidate do well?"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-3">Areas for Improvement</label>
                      <textarea
                        name="areasForImprovement"
                        value={evaluation.areasForImprovement}
                        onChange={handleTextChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none transition-all"
                        placeholder="What could the candidate improve?"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Final Recommendation</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => handleRecommendationChange('hire')}
                      className={`p-6 border rounded-2xl transition-all duration-300 ${
                        evaluation.recommendation === 'hire'
                          ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/50 shadow-lg shadow-green-500/10'
                          : 'border-gray-700/50 hover:border-green-500/30'
                      }`}
                    >
                      <div className="text-center">
                        <CheckCircle className={`w-8 h-8 mx-auto mb-3 ${
                          evaluation.recommendation === 'hire' ? 'text-green-400' : 'text-gray-400'
                        }`} />
                        <h3 className={`font-bold text-lg mb-1 ${
                          evaluation.recommendation === 'hire' ? 'text-green-400' : 'text-gray-300'
                        }`}>
                          Hire
                        </h3>
                        <p className="text-gray-400 text-sm">Strong candidate for the role</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRecommendationChange('maybe')}
                      className={`p-6 border rounded-2xl transition-all duration-300 ${
                        evaluation.recommendation === 'maybe'
                          ? 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                          : 'border-gray-700/50 hover:border-yellow-500/30'
                      }`}
                    >
                      <div className="text-center">
                        <Clock className={`w-8 h-8 mx-auto mb-3 ${
                          evaluation.recommendation === 'maybe' ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                        <h3 className={`font-bold text-lg mb-1 ${
                          evaluation.recommendation === 'maybe' ? 'text-yellow-400' : 'text-gray-300'
                        }`}>
                          Maybe
                        </h3>
                        <p className="text-gray-400 text-sm">Consider for other roles</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRecommendationChange('reject')}
                      className={`p-6 border rounded-2xl transition-all duration-300 ${
                        evaluation.recommendation === 'reject'
                          ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-500/50 shadow-lg shadow-red-500/10'
                          : 'border-gray-700/50 hover:border-red-500/30'
                      }`}
                    >
                      <div className="text-center">
                        <XCircle className={`w-8 h-8 mx-auto mb-3 ${
                          evaluation.recommendation === 'reject' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <h3 className={`font-bold text-lg mb-1 ${
                          evaluation.recommendation === 'reject' ? 'text-red-400' : 'text-gray-300'
                        }`}>
                          Reject
                        </h3>
                        <p className="text-gray-400 text-sm">Not suitable for this role</p>
                      </div>
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border ${getRecommendationColor(evaluation.recommendation)}`}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Current Recommendation: <span className="uppercase">{evaluation.recommendation}</span></p>
                        <p className="text-sm opacity-80 mt-1">
                          {evaluation.recommendation === 'hire' && 'Candidate shows strong potential and meets all requirements.'}
                          {evaluation.recommendation === 'maybe' && 'Candidate has potential but may need additional training or experience.'}
                          {evaluation.recommendation === 'reject' && 'Candidate does not meet the required criteria for this position.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Submit Evaluation
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/hr/dashboard')}
                  className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewEvaluation;