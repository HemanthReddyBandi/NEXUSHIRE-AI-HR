// CandidateNotifications.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Award, MessageSquare, AlertCircle, CheckCircle, X, Filter, Trash2, Mail, Clock, User, Video } from './icons/Icons';

interface Notification {
  id: number;
  type: 'interview' | 'result' | 'reminder' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

const CandidateNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'type'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Mock data - Replace with API call
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Your interview for Frontend Developer has been scheduled for tomorrow at 10:30 AM.',
        timestamp: '2 hours ago',
        read: false,
        actionUrl: '/candidate/interview/1',
        priority: 'high'
      },
      {
        id: 2,
        type: 'result',
        title: 'Results Available',
        message: 'Your interview results for Senior React Developer are now available to view.',
        timestamp: '1 day ago',
        read: true,
        actionUrl: '/candidate/result/INT-2024-001',
        priority: 'high'
      },
      {
        id: 3,
        type: 'reminder',
        title: 'Interview Reminder',
        message: 'Reminder: You have an interview scheduled for tomorrow at 2:00 PM.',
        timestamp: '2 days ago',
        read: false,
        actionUrl: '/candidate/interview/2',
        priority: 'medium'
      },
      {
        id: 4,
        type: 'message',
        title: 'New Message from HR',
        message: 'Sarah Johnson sent you a message regarding your upcoming interview.',
        timestamp: '3 days ago',
        read: true,
        actionUrl: '/candidate/messages',
        priority: 'medium'
      },
      {
        id: 5,
        type: 'system',
        title: 'Profile Update Required',
        message: 'Please update your profile information to complete your application.',
        timestamp: '1 week ago',
        read: false,
        actionUrl: '/candidate/profile',
        priority: 'low'
      },
      {
        id: 6,
        type: 'interview',
        title: 'Interview Rescheduled',
        message: 'Your interview with Mike Chen has been rescheduled to next Tuesday.',
        timestamp: '1 week ago',
        read: true,
        actionUrl: '/candidate/interview/3',
        priority: 'medium'
      },
      {
        id: 7,
        type: 'result',
        title: 'Results Available',
        message: 'Your interview results for Backend Developer position are ready.',
        timestamp: '2 weeks ago',
        read: true,
        actionUrl: '/candidate/result/INT-2023-012',
        priority: 'high'
      },
      {
        id: 8,
        type: 'reminder',
        title: 'Practice Interview Available',
        message: 'Try our new AI-powered practice interview to prepare for your upcoming interview.',
        timestamp: '2 weeks ago',
        read: true,
        actionUrl: '/candidate/practice',
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'result':
        return <Award className="w-5 h-5 text-green-400" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-yellow-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'bg-gray-500/20 border-gray-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    return filtered;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

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
            onClick={() => navigate('/candidate/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white">Notifications</h1>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full ${unreadCount > 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gray-700'} text-white text-sm font-medium`}>
                {unreadCount} unread
              </div>
            </div>
          </div>
          <p className="text-gray-400">Stay updated with your interview activities and results</p>
        </div>

        {/* Stats & Filters */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Notification Stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400 text-sm">Total Notifications</span>
              </div>
              <div className="text-2xl font-bold text-white">{notifications.length}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Unread</span>
              </div>
              <div className="text-2xl font-bold text-white">{unreadCount}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Interviews</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {notifications.filter(n => n.type === 'interview').length}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Results</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {notifications.filter(n => n.type === 'result').length}
              </div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'unread'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/80'
                }`}
              >
                Unread
              </button>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none transition-all"
              >
                <option value="all">All Types</option>
                <option value="interview">Interviews</option>
                <option value="result">Results</option>
                <option value="reminder">Reminders</option>
                <option value="message">Messages</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500/50 hover:bg-green-600/30 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark All as Read
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 text-red-400 rounded-lg hover:border-red-500/50 hover:bg-red-600/30 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-gray-800/20 border border-gray-700/50 rounded-2xl overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-700/50">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-800/30 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-gray-800/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        !notification.read ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20' : 'bg-gray-800/50'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-white font-bold text-lg">{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            )}
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-gray-300">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-gray-800 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      {notification.actionUrl && (
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-600/30 transition-all duration-300 text-sm flex items-center gap-2"
                          >
                            {notification.type === 'interview' && <Video className="w-4 h-4" />}
                            {notification.type === 'result' && <Award className="w-4 h-4" />}
                            {notification.type === 'message' && <MessageSquare className="w-4 h-4" />}
                            View Details
                          </button>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="px-3 py-1 text-gray-400 hover:text-white text-sm"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-bold mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Notification Types Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-gray-800/20 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Interviews</span>
            </div>
            <p className="text-gray-400 text-sm">Schedule updates, reminders, and changes</p>
          </div>
          <div className="p-4 bg-gray-800/20 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Results</span>
            </div>
            <p className="text-gray-400 text-sm">Interview results and feedback available</p>
          </div>
          <div className="p-4 bg-gray-800/20 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Reminders</span>
            </div>
            <p className="text-gray-400 text-sm">Upcoming events and deadlines</p>
          </div>
          <div className="p-4 bg-gray-800/20 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Messages</span>
            </div>
            <p className="text-gray-400 text-sm">Communications from HR and recruiters</p>
          </div>
          <div className="p-4 bg-gray-800/20 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">System</span>
            </div>
            <p className="text-gray-400 text-sm">Platform updates and important notices</p>
          </div>
        </div>

        {/* Email Settings */}
        <div className="mt-8 bg-gray-800/20 border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Notification Settings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-6 bg-gray-700 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition"></div>
                </div>
                <span className="text-white">Email Notifications</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">Receive notifications via email</p>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-10 h-6 bg-gray-700 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition"></div>
                </div>
                <span className="text-white">Push Notifications</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">Receive browser notifications</p>
            </div>
          </div>
          <div className="mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateNotifications;