
import { useState, useCallback, useReducer, useEffect } from 'react';
import { AppState, InterviewState, InterviewReport, Resume, QuestionAndAnswer, QuestionGenerationMetadata } from '../types';
import { generateQuestions, generateEvaluation, textToSpeech } from '../services/chatgptService';
import { getHistory, saveHistory, getDailyAttempts, saveDailyAttempts } from '../services/storageService';
import { getQuestionStatistics, cleanupOldHistories } from '../services/questionHistoryService';
import { MAX_QUESTIONS, MAX_WARNINGS, DAILY_INTERVIEW_LIMIT } from '../constants';

const initialState: InterviewState = {
  jobRole: '',
  resume: null,
  questions: [],
  currentQuestionIndex: 0,
  transcript: [],
  isRecording: false,
  warnings: 0,
  webcamStream: null,
  report: null,
  history: [],
  dailyAttempts: { count: 0, date: new Date().toISOString().split('T')[0] },
};

type Action =
  | { type: 'SET_SETUP'; payload: { jobRole: string; resume: Resume } }
  | { type: 'SET_PERMISSIONS'; payload: { stream: MediaStream } }
  | { type: 'START_INTERVIEW'; payload: { questions: string[]; metadata?: QuestionGenerationMetadata } }
  | { type: 'NEXT_QUESTION'; payload: { answer: string } }
  | { type: 'ADD_WARNING' }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_EVALUATION'; payload: { report: InterviewReport } }
  | { type: 'VIEW_REPORT'; payload: { report: InterviewReport } }
  | { type: 'SET_HISTORY'; payload: { history: InterviewReport[] } }
  | { type: 'RESET' };

function interviewReducer(state: InterviewState, action: Action): InterviewState {
  switch (action.type) {
    case 'SET_SETUP':
      return { ...state, jobRole: action.payload.jobRole, resume: action.payload.resume };
    case 'SET_PERMISSIONS':
      return { ...state, webcamStream: action.payload.stream };
    case 'START_INTERVIEW':
      return { 
        ...state, 
        questions: action.payload.questions, 
        currentQuestionIndex: 0, 
        transcript: [],
        questionMetadata: action.payload.metadata
      };
    case 'NEXT_QUESTION':
      const newTranscript = [...state.transcript, { question: state.questions[state.currentQuestionIndex], answer: action.payload.answer, feedback: '', score: 0 }];
      return { ...state, transcript: newTranscript, currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'ADD_WARNING':
      return { ...state, warnings: state.warnings + 1 };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_EVALUATION':
        const updatedHistory = [action.payload.report, ...state.history];
        saveHistory(updatedHistory);
        return { ...state, report: action.payload.report, history: updatedHistory };
    case 'VIEW_REPORT':
        return { ...state, report: action.payload.report };
    case 'SET_HISTORY':
      return { ...state, history: action.payload.history };
    case 'RESET':
      if (state.webcamStream) {
        state.webcamStream.getTracks().forEach(track => track.stop());
      }
      const attempts = getDailyAttempts();
      return { ...initialState, webcamStream: null, history: state.history, dailyAttempts: attempts };
    default:
      return state;
  }
}

export const useInterview = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [interviewState, dispatch] = useReducer(interviewReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_HISTORY', payload: { history: getHistory() } });
    const attempts = getDailyAttempts();
    if (attempts.date !== new Date().toISOString().split('T')[0]) {
      saveDailyAttempts({ count: 0, date: new Date().toISOString().split('T')[0] });
      dispatch({ type: 'RESET' }); // To update state
    }
    
    // Cleanup old question histories on app load
    try {
      cleanupOldHistories();
    } catch (error) {
      console.error('Error cleaning up old histories:', error);
    }
  }, []);

  const startSetup = useCallback(() => {
    const attempts = getDailyAttempts();
    if (attempts.count >= DAILY_INTERVIEW_LIMIT && DAILY_INTERVIEW_LIMIT !== Infinity) {
        alert(`You have reached your daily limit of ${DAILY_INTERVIEW_LIMIT} interviews.`);
        setAppState(AppState.HISTORY);
    } else {
       setAppState(AppState.SETUP);
    }
  }, []);

  const startPermissionCheck = useCallback((jobRole: string, resume: Resume) => {
    dispatch({ type: 'SET_SETUP', payload: { jobRole, resume } });
    setAppState(AppState.PERMISSIONS);
  }, []);

  const startInterview = useCallback(async (stream: MediaStream) => {
    dispatch({ type: 'SET_PERMISSIONS', payload: { stream } });
    setAppState(AppState.INTERVIEW);
    try {
      console.log('Generating questions for role:', interviewState.jobRole);
      
      // Log question history statistics before generating new questions
      try {
        const stats = getQuestionStatistics(interviewState.jobRole, interviewState.resume?.content || '');
        console.log('Question history before generation:', {
          totalPreviouslyAsked: stats.totalQuestionsAsked,
          uniqueQuestions: stats.uniqueQuestions,
          averageReuse: stats.averageReuse.toFixed(2),
        });
      } catch (statsError) {
        console.log('No previous question history for this role');
      }
      
      const questions = await generateQuestions(interviewState.jobRole, interviewState.resume?.content || '');
      
      // Log question generation success and updated statistics
      try {
        const updatedStats = getQuestionStatistics(interviewState.jobRole, interviewState.resume?.content || '');
        console.log('Question history after generation:', {
          totalQuestionsAsked: updatedStats.totalQuestionsAsked,
          uniqueQuestions: updatedStats.uniqueQuestions,
          averageReuse: updatedStats.averageReuse.toFixed(2),
        });
      } catch (statsError) {
        console.log('Could not retrieve updated statistics');
      }
      
      const metadata: QuestionGenerationMetadata = {
        generatedAt: new Date().toISOString(),
        jobRole: interviewState.jobRole,
        resumeHash: generateSimpleHash(interviewState.resume?.content || ''),
        apiProvider: 'chatgpt', // or 'gemini' based on configuration
        previouslyAskedQuestionsCount: getQuestionStatistics(interviewState.jobRole, interviewState.resume?.content || '').totalQuestionsAsked - questions.length,
      };
      
      dispatch({ type: 'START_INTERVIEW', payload: { questions: questions.slice(0, MAX_QUESTIONS), metadata } });
    } catch (error) {
      console.error("Failed to generate questions:", error);
      let alertMessage = "Could not generate interview questions. Please try again.";
      if (error instanceof Error && error.message.toLowerCase().includes('permission denied')) {
        alertMessage = "Failed to call the Gemini API: Permission denied. Please ensure the API key is correctly configured and has the required permissions.";
      }
      alert(alertMessage);
      setAppState(AppState.SETUP);
    }
  }, [interviewState.jobRole, interviewState.resume]);

  const finishInterview = useCallback(async (finalTranscript: QuestionAndAnswer[]) => {
    setAppState(AppState.EVALUATION);
    if (interviewState.webcamStream) {
        interviewState.webcamStream.getTracks().forEach(track => track.stop());
    }

    try {
      console.log('Starting evaluation with transcript:', finalTranscript);
      const report = await generateEvaluation(interviewState.jobRole, interviewState.resume?.content || '', finalTranscript);
      console.log('Evaluation report generated:', report);
      report.fraudStatus = interviewState.warnings >= MAX_WARNINGS;
      dispatch({ type: 'SET_EVALUATION', payload: { report } });
      const attempts = getDailyAttempts();
      saveDailyAttempts({ ...attempts, count: attempts.count + 1 });
      setAppState(AppState.REPORT);
    } catch (error) {
      console.error("Failed to generate evaluation:", error);
      let alertMessage = "Could not evaluate the interview. Please try again.";
      if (error instanceof Error && error.message.toLowerCase().includes('permission denied')) {
        alertMessage = "Failed to evaluate the interview due to a permission error. Please check your API key.";
      }
      alert(alertMessage);
      setAppState(AppState.SETUP);
    }
  }, [interviewState.jobRole, interviewState.resume, interviewState.warnings, interviewState.webcamStream]);

  const viewHistory = useCallback(() => {
    dispatch({ type: 'SET_HISTORY', payload: { history: getHistory() }});
    setAppState(AppState.HISTORY);
  }, []);
  
  const viewReport = useCallback((report: InterviewReport) => {
      dispatch({ type: 'VIEW_REPORT', payload: { report } });
      setAppState(AppState.REPORT);
  }, []);
  
  const startNewInterview = useCallback(() => {
      dispatch({ type: 'RESET' });
      setAppState(AppState.SETUP);
  }, []);

  return {
    appState,
    interviewState,
    startSetup,
    startPermissionCheck,
    startInterview,
    finishInterview,
    viewHistory,
    viewReport,
    startNewInterview,
    dispatch,
  };
};

/**
 * Simple hash function for resume content
 */
function generateSimpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}