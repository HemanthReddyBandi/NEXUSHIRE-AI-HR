
export enum AppState {
  WELCOME,
  SETUP,
  PERMISSIONS,
  INTERVIEW,
  EVALUATION,
  REPORT,
  HISTORY,
}

export type InterviewPurpose = 'job-interview' | 'college-admission' | 'promotion' | 'practice' | 'mock-test';

export interface Resume {
  name: string;
  content: string; // Base64 encoded or simple text
  uploaded?: string;
  size?: string;
}

export interface Score {
  communication: number;
  technical: number;
  logic: number;
  overall: number;
}

export interface QuestionAndAnswer {
  question: string;
  answer: string;
  feedback: string;
  score: number;
  // Metadata for enhanced feedback analysis
  responseTime?: number; // seconds taken to answer
  confidence?: number; // 0-10 confidence level based on hesitations and pauses
  hesitationCount?: number; // number of pauses/filler words detected
  clarityScore?: number; // 0-10 clarity of speech
  tone?: 'confident' | 'uncertain' | 'neutral' | 'defensive'; // detected tone
  keywordsMatched?: string[]; // relevant keywords used in answer
}

export interface InterviewReport {
  id: string;
  date: string;
  jobRole: string;
  scores: Score;
  summary: {
    strengths: string;
    weaknesses: string;
    suggestions: string;
  };
  details: QuestionAndAnswer[];
  fraudStatus: boolean;
  purpose?: InterviewPurpose;
  duration?: string;
  insights?: Array<{
    type: 'strength' | 'improvement' | 'suggestion';
    content: string;
  }>;
  additionalMetrics?: Record<string, any>;
}

export interface EnhancedInterviewReport {
  purpose: InterviewPurpose;
  jobRole: string;
  date: string;
  duration?: string;
  scores: Record<string, number>; // Dynamic score categories
  summary: {
    strengths: string;
    weaknesses: string;
    suggestions: string;
  };
  insights?: Array<{ // Optional AI-generated insights
    type: 'strength' | 'improvement' | 'suggestion';
    content: string;
  }>;
  details: Array<{ // Question-by-question analysis
    question: string;
    answer: string;
    score: number;
    category?: string;
    topic?: string;
    metrics?: Record<string, any>; // Dynamic metrics per question
    feedback: string;
  }>;
  additionalMetrics?: Record<string, any>; // Any extra metrics AI provides
  fraudStatus?: boolean;
}

/**
 * Dynamic question generation metadata
 * Tracks question generation context and history
 */
export interface QuestionGenerationMetadata {
  generatedAt: string;
  jobRole: string;
  resumeHash: string; // Hash of resume for tracking
  apiProvider: 'chatgpt' | 'gemini' | 'fallback';
  previouslyAskedQuestionsCount: number;
  diversityScore?: number; // 0-100 indicating question uniqueness
}

/**
 * Extended question interface with metadata
 */
export interface GeneratedQuestion {
  text: string;
  category?: 'technical' | 'behavioral' | 'problem-solving' | 'situational';
  difficulty?: 'easy' | 'medium' | 'hard';
  metadata?: QuestionGenerationMetadata;
}

export interface InterviewState {
  jobRole: string;
  resume: Resume | null;
  questions: string[];
  currentQuestionIndex: number;
  transcript: QuestionAndAnswer[];
  isRecording: boolean;
  warnings: number;
  webcamStream: MediaStream | null;
  report: InterviewReport | null;
  history: InterviewReport[];
  dailyAttempts: { count: number; date: string };
  questionMetadata?: QuestionGenerationMetadata;
}
