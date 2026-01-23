import React, { useState } from 'react';
import { InterviewReport, InterviewState } from '../types';
import { 
  RefreshCwIcon, 
  AlertTriangleIcon, 
  CalendarIcon, 
  TrendingUpIcon,
  FilterIcon,
  DownloadIcon,
  ShareIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  BarChartIcon,
  TargetIcon
} from './icons/Icons';

interface HistoryScreenProps {
    onStartNew: () => void;
    onViewReport: (report: InterviewReport) => void;
    interviewState: InterviewState;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onStartNew, onViewReport, interviewState }) => {
    const history = interviewState.history;
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const stats = {
        totalInterviews: history.length,
        averageScore: history.reduce((acc, report) => acc + report.scores.overall, 0) / (history.length || 1),
        bestScore: Math.max(...history.map(r => r.scores.overall), 0),
        improvement: history.length > 1 ? 
            history[history.length - 1].scores.overall - history[0].scores.overall : 0
    };

    const filters = [
        { id: 'all', label: 'All Interviews' },
        { id: 'recent', label: 'Last 30 Days' },
        { id: 'high', label: 'High Scores (>8.0)' },
        { id: 'flagged', label: 'Flagged Interviews' }
    ];

    const sortOptions = [
        { id: 'date', label: 'Most Recent' },
        { id: 'score', label: 'Highest Score' },
        { id: 'role', label: 'Job Role' },
        { id: 'time', label: 'Duration' }
    ];

    const getFilteredHistory = () => {
        let filtered = [...history];
        
        if (filter === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filtered = filtered.filter(report => new Date(report.date) > thirtyDaysAgo);
        } else if (filter === 'high') {
            filtered = filtered.filter(report => report.scores.overall >= 8);
        } else if (filter === 'flagged') {
            filtered = filtered.filter(report => report.fraudStatus);
        }

        if (sortBy === 'score') {
            filtered.sort((a, b) => b.scores.overall - a.scores.overall);
        } else if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === 'role') {
            filtered.sort((a, b) => a.jobRole.localeCompare(b.jobRole));
        }

        return filtered;
    };

    const filteredHistory = getFilteredHistory();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '7s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="relative z-10 min-h-screen p-6 md:p-8">
                {/* Header */}
                <header className="mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-4 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 rounded-2xl">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-gradient">
                                Interview History
                            </h1>
                            <p className="text-gray-400 mt-2">Track your progress and review past interviews</p>
                        </div>
                        <button
                            onClick={onStartNew}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl shadow-cyan-500/30"
                        >
                            <RefreshCwIcon className="w-5 h-5" />
                            New Interview
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-12">
                        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-400">Total Interviews</div>
                                <CalendarIcon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stats.totalInterviews}</div>
                            <div className="text-sm text-gray-400">All-time sessions</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-400">Average Score</div>
                                <StarIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stats.averageScore.toFixed(1)}</div>
                            <div className="text-sm text-gray-400">Overall performance</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-400">Best Score</div>
                                <TrendingUpIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stats.bestScore.toFixed(1)}</div>
                            <div className="text-sm text-gray-400">Personal best</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-400">Improvement</div>
                                <BarChartIcon className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}</div>
                            <div className="text-sm text-gray-400">Since first interview</div>
                        </div>
                    </div>
                </header>

                {/* Filters & Controls */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <FilterIcon className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-semibold text-white">Filters</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {filters.map((filterItem) => (
                                    <button
                                        key={filterItem.id}
                                        onClick={() => setFilter(filterItem.id)}
                                        className={`px-4 py-2 rounded-lg transition-all ${filter === filterItem.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300' : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}
                                    >
                                        {filterItem.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <TargetIcon className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Sort By</h3>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-900/50 border border-gray-700/50 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all w-full md:w-auto"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-700/50">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all">
                            <DownloadIcon className="w-4 h-4" />
                            Export All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all">
                            <ShareIcon className="w-4 h-4" />
                            Share Progress
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-green-300 hover:bg-green-500/20 transition-all">
                            <TrendingUpIcon className="w-4 h-4" />
                            View Trends
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 mb-8">
                    {filteredHistory.length === 0 ? (
                        <div className="text-center py-12 md:py-16">
                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                                <CalendarIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Interviews Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8">
                                {filter === 'all' 
                                    ? "You haven't completed any interviews yet. Start your first one to track your progress here."
                                    : "No interviews match your current filter. Try adjusting your filter settings."}
                            </p>
                            <button
                                onClick={onStartNew}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/30"
                            >
                                Start Your First Interview
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h3 className="text-2xl font-bold text-white">
                                    Interview Sessions ({filteredHistory.length})
                                </h3>
                                <div className="text-gray-400 text-sm">
                                    Showing {filteredHistory.length} of {history.length} interviews
                                </div>
                            </div>
                            
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredHistory.map((report, index) => (
                                    <div key={report.id || index} className="group">
                                        <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 p-6 rounded-2xl border border-gray-700/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row items-start justify-between mb-3 gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-xl text-white group-hover:text-cyan-100 transition-colors">
                                                            {report.jobRole}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className="flex items-center gap-2 text-sm text-gray-400">
                                                                <CalendarIcon className="w-4 h-4" />
                                                                {report.date}
                                                            </span>
                                                            <span className="flex items-center gap-2 text-sm text-gray-400">
                                                                <ClockIcon className="w-4 h-4" />
                                                                25 min
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                                            {report.scores.overall.toFixed(1)}
                                                        </div>
                                                        <div className="text-sm text-gray-400">Overall Score</div>
                                                    </div>
                                                </div>
                                                
                                                {report.fraudStatus && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 text-sm font-bold mb-4">
                                                        <AlertTriangleIcon className="w-4 h-4" />
                                                        Malpractice Detected
                                                    </div>
                                                )}
                                                
                                                {/* Score Breakdown */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                    {[
                                                        { label: 'Communication', value: report.scores.communication, color: 'cyan' },
                                                        { label: 'Technical', value: report.scores.technical, color: 'blue' },
                                                        { label: 'Logic', value: report.scores.logic, color: 'purple' },
                                                        { label: 'Confidence', value: report.scores.confidence || 7.5, color: 'pink' }
                                                    ].map((score, idx) => (
                                                        <div key={idx} className="text-center">
                                                            <div className={`text-2xl font-bold text-${score.color}-300`}>
                                                                {score.value.toFixed(1)}
                                                            </div>
                                                            <div className="text-xs text-gray-400">{score.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                                <button
                                                    onClick={() => onViewReport(report)}
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
                                                >
                                                    View Full Report
                                                </button>
                                                <button className="py-3 px-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-500/30 transition-all w-full sm:w-auto">
                                                    Compare
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Performance Insights */}
                {history.length > 0 && (
                    <div className="mt-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Performance Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-300 mb-4">Score Progression</h4>
                                <div className="h-48 flex items-end gap-2">
                                    {history.slice(-6).map((report, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center">
                                            <div 
                                                className="w-8 md:w-12 rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-500 transition-all hover:from-cyan-400 hover:to-blue-400"
                                                style={{ height: `${report.scores.overall * 10}%` }}
                                                title={`Score: ${report.scores.overall.toFixed(1)}`}
                                            ></div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                {report.date.split('/')[0]}/{report.date.split('/')[1]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-300 mb-4">Skill Distribution</h4>
                                <div className="space-y-4">
                                    {[
                                        { skill: 'Technical', value: stats.averageScore, color: 'from-cyan-500 to-blue-500' },
                                        { skill: 'Communication', value: stats.averageScore - 0.3, color: 'from-blue-500 to-purple-500' },
                                        { skill: 'Problem Solving', value: stats.averageScore + 0.2, color: 'from-purple-500 to-pink-500' }
                                    ].map((skill, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">{skill.skill}</span>
                                                <span className="text-white font-bold">{skill.value.toFixed(1)}</span>
                                            </div>
                                            <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                                                    style={{ width: `${skill.value * 10}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryScreen;