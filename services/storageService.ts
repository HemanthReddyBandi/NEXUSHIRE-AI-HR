
import { InterviewReport } from '../types';

const HISTORY_KEY = 'interviewHistory';
const ATTEMPTS_KEY = 'dailyAttempts';
const ACTIVE_SESSIONS_KEY = 'activeSessions';
const HR_RESULTS_KEY = 'hrResults';
const CANDIDATE_RESULTS_KEY = 'candidateResults';

interface InterviewSession {
  sessionId: string;
  candidateName: string;
  hrName: string;
  position: string;
  startTime: string;
  participants: {
    hr: boolean;
    candidate: boolean;
  };
  status: 'active' | 'completed' | 'cancelled';
}

export function getHistory(): InterviewReport[] {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Could not parse interview history:", error);
    return [];
  }
}

export function saveHistory(history: InterviewReport[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getDailyAttempts(): { count: number; date: string } {
    try {
        const attemptsJson = localStorage.getItem(ATTEMPTS_KEY);
        if (attemptsJson) {
            const attempts = JSON.parse(attemptsJson);
            const today = new Date().toISOString().split('T')[0];
            if (attempts.date === today) {
                return attempts;
            }
        }
        return { count: 0, date: new Date().toISOString().split('T')[0] };
    } catch (error) {
        console.error("Could not parse daily attempts:", error);
        return { count: 0, date: new Date().toISOString().split('T')[0] };
    }
}

export function saveDailyAttempts(attempts: { count: number; date: string }): void {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

// Interview Session Management Functions
export function createInterviewSession(sessionData: Omit<InterviewSession, 'startTime'>): InterviewSession {
  const session: InterviewSession = {
    ...sessionData,
    startTime: new Date().toISOString()
  };
  
  const sessions = getActiveSessions();
  sessions.push(session);
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
  
  return session;
}

export function getActiveSessions(): InterviewSession[] {
  try {
    const sessionsJson = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error("Could not parse active sessions:", error);
    return [];
  }
}

export function getSession(sessionId: string): InterviewSession | null {
  const sessions = getActiveSessions();
  return sessions.find(s => s.sessionId === sessionId) || null;
}

export function updateSessionParticipant(sessionId: string, role: 'hr' | 'candidate', joined: boolean): void {
  const sessions = getActiveSessions();
  const session = sessions.find(s => s.sessionId === sessionId);
  
  if (session) {
    session.participants[role] = joined;
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
  }
}

export function updateSessionStatus(sessionId: string, status: 'active' | 'completed' | 'cancelled'): void {
  const sessions = getActiveSessions();
  const session = sessions.find(s => s.sessionId === sessionId);
  
  if (session) {
    session.status = status;
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
  }
}

export function endSession(sessionId: string): void {
  updateSessionStatus(sessionId, 'completed');
}

export function clearExpiredSessions(): void {
  const sessions = getActiveSessions();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  const activeSessions = sessions.filter(session => {
    const startTime = new Date(session.startTime);
    return startTime > oneHourAgo && session.status === 'active';
  });
  
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(activeSessions));
}

// HR Result Management Functions
export interface HRResult {
  id: string;
  sessionId: string;
  candidateName: string;
  candidateEmail: string;
  hrName: string;
  interviewDate: string;
  scores: {
    confidence: number;
    technical: number;
    communication: number;
    overall: number;
  };
  feedback: {
    confidence: string;
    technical: string;
    communication: string;
    general: string;
  };
  grade: string;
  performanceLevel: string;
  sentAt?: string;
  sentToCandidateAt?: string;
}

export function saveHRResult(result: HRResult): void {
  try {
    const results = getHRResults();
    results.push(result);
    localStorage.setItem(HR_RESULTS_KEY, JSON.stringify(results));
  } catch (error) {
    console.error("Could not save HR result:", error);
  }
}

export function getHRResults(): HRResult[] {
  try {
    const resultsJson = localStorage.getItem(HR_RESULTS_KEY);
    return resultsJson ? JSON.parse(resultsJson) : [];
  } catch (error) {
    console.error("Could not parse HR results:", error);
    return [];
  }
}

export function sendResultToCandidate(resultId: string): boolean {
  try {
    const results = getHRResults();
    const resultIndex = results.findIndex(r => r.id === resultId);
    
    if (resultIndex !== -1) {
      // Mark as sent to candidate
      results[resultIndex].sentToCandidateAt = new Date().toISOString();
      localStorage.setItem(HR_RESULTS_KEY, JSON.stringify(results));
      
      // Save to candidate results
      const candidateResults = getCandidateResults();
      candidateResults.push({
        ...results[resultIndex],
        receivedAt: new Date().toISOString()
      });
      localStorage.setItem(CANDIDATE_RESULTS_KEY, JSON.stringify(candidateResults));
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Could not send result to candidate:", error);
    return false;
  }
}

export function getCandidateResults(): (HRResult & { receivedAt: string })[] {
  try {
    const resultsJson = localStorage.getItem(CANDIDATE_RESULTS_KEY);
    return resultsJson ? JSON.parse(resultsJson) : [];
  } catch (error) {
    console.error("Could not parse candidate results:", error);
    return [];
  }
}

export function getCandidateResultsByName(candidateName: string): (HRResult & { receivedAt: string })[] {
  try {
    const results = getCandidateResults();
    return results.filter(r => r.candidateName.toLowerCase() === candidateName.toLowerCase());
  } catch (error) {
    console.error("Could not get candidate results:", error);
    return [];
  }
}
