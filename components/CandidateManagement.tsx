// CandidateManagement.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User, Mail, Phone, Calendar, Award, Star, MessageSquare, Download, Eye, X } from './icons/Icons';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive' | 'hired';
  lastInterview: string;
  totalInterviews: number;
  averageScore: number;
  skills: string[];
}

const CandidateManagement: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    position: 'all'
  });

  useEffect(() => {
    // Mock data - Replace with API call
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234-567-8900',
        position: 'Frontend Developer',
        status: 'active',
        lastInterview: '2024-01-10',
        totalInterviews: 3,
        averageScore: 4.2,
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind']
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234-567-8901',
        position: 'Backend Developer',
        status: 'active',
        lastInterview: '2024-01-12',
        totalInterviews: 2,
        averageScore: 4.5,
        skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS']
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 234-567-8902',
        position: 'Full Stack Developer',
        status: 'active',
        lastInterview: '2024-01-08',
        totalInterviews: 4,
        averageScore: 3.8,
        skills: ['React', 'Node.js', 'MongoDB', 'Docker']
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 234-567-8903',
        position: 'UX Designer',
        status: 'inactive',
        lastInterview: '2023-12-15',
        totalInterviews: 1,
        averageScore: 4.0,
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping']
      },
      {
        id: '5',
        name: 'Alex Brown',
        email: 'alex@example.com',
        phone: '+1 234-567-8904',
        position: 'DevOps Engineer',
        status: 'hired',
        lastInterview: '2024-01-05',
        totalInterviews: 2,
        averageScore: 4.7,
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform']
      }
    ];

    setCandidates(mockCandidates);
    setFilteredCandidates(mockCandidates);
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === filters.status);
    }

    // Apply position filter
    if (filters.position !== 'all') {
      filtered = filtered.filter(candidate => candidate.position === filters.position);
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, filters, candidates]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'hired':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 rounded-full bg-green-400" />;
      case 'inactive':
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
      case 'hired':
        return <div className="w-2 h-2 rounded-full bg-blue-400" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  const viewCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const closeDetails = () => {
    setSelectedCandidate(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <h1 className="text-4xl font-bold text-white mb-2">Candidate Management</h1>
          <p className="text-gray-400">Manage and view candidate profiles and history</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <select
                value={filters.position}
                onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Positions</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UX Designer">UX Designer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">{candidates.length}</div>
              <div className="text-cyan-400 text-sm">Total Candidates</div>
            </div>
            <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {candidates.filter(c => c.status === 'active').length}
              </div>
              <div className="text-green-400 text-sm">Active</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {candidates.filter(c => c.status === 'hired').length}
              </div>
              <div className="text-blue-400 text-sm">Hired</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {candidates.reduce((acc, c) => acc + c.totalInterviews, 0)}
              </div>
              <div className="text-purple-400 text-sm">Total Interviews</div>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <div
              key={candidate.id}
              className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{candidate.name}</h3>
                    <p className="text-gray-400 text-sm">{candidate.position}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(candidate.status)}`}>
                  {getStatusIcon(candidate.status)}
                  <span className="text-sm font-medium capitalize">{candidate.status}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Last interview: {formatDate(candidate.lastInterview)}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-gray-400 text-sm mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-bold">{candidate.totalInterviews}</span>
                  </div>
                  <span className="text-gray-400 text-xs">Interviews</span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-bold">{candidate.averageScore.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400 text-xs">Avg. Score</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => viewCandidateDetails(candidate)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/hr/schedule?candidate=${candidate.id}`)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white text-lg font-bold mb-2">No candidates found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCandidate.name}</h2>
                    <p className="text-gray-400">{selectedCandidate.position}</p>
                  </div>
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
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{selectedCandidate.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-sm mb-2">Interview Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{selectedCandidate.totalInterviews}</div>
                        <div className="text-gray-400 text-sm">Total Interviews</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white mb-1">{selectedCandidate.averageScore.toFixed(1)}</div>
                        <div className="text-gray-400 text-sm">Average Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedCandidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-sm mb-2">Status</h3>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(selectedCandidate.status)}`}>
                      {getStatusIcon(selectedCandidate.status)}
                      <span className="font-medium capitalize">{selectedCandidate.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/hr/schedule?candidate=${selectedCandidate.id}`)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Schedule Interview
                </button>
                <button className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl font-semibold hover:border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;