// InterviewScheduling.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, Clock, Link as LinkIcon, Copy, Check, Users, X } from './icons/Icons';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
}

const InterviewScheduling: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [interviewData, setInterviewData] = useState({
    position: '',
    date: '',
    time: '',
    duration: 45,
    description: '',
    meetingLink: ''
  });
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Mock data - Replace with API call
    const mockCandidates: Candidate[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', position: 'Frontend Developer', phone: '+1 234-567-8900' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', position: 'Backend Developer', phone: '+1 234-567-8901' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', position: 'Full Stack Developer', phone: '+1 234-567-8902' },
      { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', position: 'UX Designer', phone: '+1 234-567-8903' },
      { id: '5', name: 'Alex Brown', email: 'alex@example.com', position: 'DevOps Engineer', phone: '+1 234-567-8904' },
    ];
    setCandidates(mockCandidates);

    // Generate default date and time
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    const formattedTime = '10:00';

    setInterviewData(prev => ({
      ...prev,
      date: formattedDate,
      time: formattedTime,
      meetingLink: `https://interview-platform.com/join/${Math.random().toString(36).substr(2, 9)}`
    }));
    // read candidate query param if present
    const params = new URLSearchParams(location.search);
    const candidateId = params.get('candidate');
    if (candidateId) setSelectedCandidate(candidateId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setInterviewData(prev => ({
        ...prev,
        position: candidate.position
      }));
    }
  };

  const generateMeetingLink = () => {
    const link = `https://interview-platform.com/join/${Math.random().toString(36).substr(2, 12)}`;
    setInterviewData(prev => ({
      ...prev,
      meetingLink: link
    }));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(interviewData.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would make API call to save the interview
    console.log('Scheduling interview:', { candidateId: selectedCandidate, ...interviewData });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/hr/dashboard');
    }, 2000);
  };

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

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
          <h1 className="text-4xl font-bold text-white mb-2">Schedule Interview</h1>
          <p className="text-gray-400">Create and schedule new interview sessions</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Interview scheduled successfully! Redirecting...</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Candidate Selection */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Select Candidate</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {candidates.map(candidate => (
                  <div
                    key={candidate.id}
                    onClick={() => handleCandidateSelect(candidate.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedCandidate === candidate.id
                        ? 'border-cyan-500/50 bg-gradient-to-r from-cyan-600/10 to-blue-600/10'
                        : 'border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedCandidate === candidate.id
                          ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                          : 'bg-gray-700'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{candidate.name}</h3>
                        <p className="text-gray-400 text-sm">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-20">Email:</span>
                        <span className="text-gray-300">{candidate.email}</span>
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-20">Phone:</span>
                        <span className="text-gray-300">{candidate.phone}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCandidateData && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 text-sm">
                    Selected: <span className="font-bold">{selectedCandidateData.name}</span> - {selectedCandidateData.position}
                  </p>
                </div>
              )}
            </div>

            {/* Interview Details */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Interview Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={interviewData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={interviewData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={interviewData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Duration (minutes)</label>
                  <select
                    name="duration"
                    value={interviewData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={interviewData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                    placeholder="Add interview details, topics to cover, etc."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!selectedCandidate}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 ${
                      selectedCandidate
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/25'
                        : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Schedule Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/hr/dashboard')}
                    className="px-8 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Meeting Link */}
          <div className="space-y-8">
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                  <LinkIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Interview Link</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Share this link with the candidate. They can use it to join the interview at the scheduled time.
                </p>

                <div className="p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-400 text-sm font-medium">Meeting URL</span>
                    <button
                      onClick={generateMeetingLink}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      readOnly
                      value={interviewData.meetingLink}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 text-sm focus:outline-none"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Link will be active 15 minutes before the scheduled time
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-white font-bold text-sm">Interview Details</h3>
                  </div>
                  {selectedCandidateData && (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Candidate:</span> {selectedCandidateData.name}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Position:</span> {interviewData.position}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Date:</span> {new Date(interviewData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Time:</span> {interviewData.time}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Duration:</span> {interviewData.duration} minutes
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-bold text-sm">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300 text-sm">
                      Send Email Invite
                    </button>
                    <button className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:border-purple-500/30 hover:bg-gray-800/80 transition-all duration-300 text-sm">
                      Add to Calendar
                    </button>
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

export default InterviewScheduling;