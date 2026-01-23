/**
 * Interview Platform Type Definitions
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'candidate' | 'hr' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface CandidateProfile extends User {
  role: 'candidate';
  phoneNumber?: string;
  resume?: string;
  skills: string[];
  experience: number; // years
}

export interface HRProfile extends User {
  role: 'hr';
  department: string;
  phoneNumber?: string;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  hrId: string;
  candidateName: string;
  hrName: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
  notes?: string;
  duration?: number; // in seconds
}

export interface ScoreData {
  confidence: number;
  technical: number;
  communication: number;
  overall?: number;
}

export interface FeedbackData {
  confidence: string;
  technical: string;
  communication: string;
  general: string;
}

export interface InterviewResult {
  id: string;
  sessionId: string;
  candidateId: string;
  candidateName: string;
  hrId: string;
  hrName: string;
  scores: ScoreData & { overall: number };
  feedback: FeedbackData;
  grade: string;
  performanceLevel: string;
  timestamp: string;
  duration: number;
}

export interface Question {
  id: string;
  text: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionAndAnswer {
  question: Question;
  answer: string;
  duration: number; // in seconds
}

export interface InterviewState {
  questions: Question[];
  currentQuestionIndex: number;
  qaHistory: QuestionAndAnswer[];
  webcamStream: MediaStream | null;
  warnings: number;
  startTime: number;
}

export interface InterviewConfig {
  maxQuestions: number;
  maxWarnings: number;
  timePerQuestion: number; // in seconds
  enableRecording: boolean;
  enableVideoFeed: boolean;
  aiProvider: 'openai' | 'gemini' | 'ollama';
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'start' | 'end';
  data?: any;
  from: string;
  to: string;
  sessionId: string;
  timestamp: string;
}

export interface WebRTCStats {
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  connectionHealth: 'good' | 'fair' | 'poor';
  videoBitrate: number;
  audioBitrate: number;
  videoResolution: { width: number; height: number };
  audioLevel: number;
  jitter: number;
  latency: number;
}

export interface NotificationEvent {
  id: string;
  type: 'interview-scheduled' | 'interview-started' | 'interview-ended' | 'result-ready';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  averageConfidence: number;
  averageTechnical: number;
  averageCommunication: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // percentage
  averageDuration: number;
  candidatesInterviewed: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
