/**
 * Question History Service
 * Manages a history of used questions for each job role/resume combination
 * Ensures unique, non-repetitive questions across interview attempts
 */

interface QuestionEntry {
  question: string;
  generatedAt: string;
  usedAt?: string;
}

interface QuestionHistory {
  jobRole: string;
  resumeHash: string; // Hash of resume content for tracking
  questions: QuestionEntry[];
  createdAt: string;
  lastUpdatedAt: string;
}

const QUESTION_HISTORY_KEY = 'questionHistory';
const QUESTION_HISTORY_EXPIRY_DAYS = 30; // Keep history for 30 days

/**
 * Generate a simple hash of resume content for tracking
 */
function generateResumeHash(resumeContent: string): string {
  let hash = 0;
  for (let i = 0; i < resumeContent.length; i++) {
    const char = resumeContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get all question histories
 */
function getAllHistories(): QuestionHistory[] {
  try {
    const historiesJson = localStorage.getItem(QUESTION_HISTORY_KEY);
    return historiesJson ? JSON.parse(historiesJson) : [];
  } catch (error) {
    console.error('Could not parse question histories:', error);
    return [];
  }
}

/**
 * Save all question histories
 */
function saveAllHistories(histories: QuestionHistory[]): void {
  localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(histories));
}

/**
 * Get question history for a specific job role and resume
 */
export function getQuestionHistory(jobRole: string, resumeContent: string): QuestionEntry[] {
  try {
    const resumeHash = generateResumeHash(resumeContent);
    const histories = getAllHistories();
    const history = histories.find(h => h.jobRole === jobRole && h.resumeHash === resumeHash);
    return history ? history.questions : [];
  } catch (error) {
    console.error('Error retrieving question history:', error);
    return [];
  }
}

/**
 * Add new questions to history
 */
export function addQuestionsToHistory(
  jobRole: string,
  resumeContent: string,
  newQuestions: string[]
): void {
  try {
    const resumeHash = generateResumeHash(resumeContent);
    const histories = getAllHistories();
    let history = histories.find(h => h.jobRole === jobRole && h.resumeHash === resumeHash);

    const now = new Date().toISOString();
    const questionEntries: QuestionEntry[] = newQuestions.map(q => ({
      question: q,
      generatedAt: now,
      usedAt: now, // Mark as used when added
    }));

    if (history) {
      // Merge with existing history (avoid duplicates)
      const existingQuestions = new Set(history.questions.map(q => q.question));
      const uniqueNewQuestions = questionEntries.filter(
        q => !existingQuestions.has(q.question)
      );
      history.questions.push(...uniqueNewQuestions);
      history.lastUpdatedAt = now;
    } else {
      // Create new history entry
      history = {
        jobRole,
        resumeHash,
        questions: questionEntries,
        createdAt: now,
        lastUpdatedAt: now,
      };
      histories.push(history);
    }

    saveAllHistories(histories);
  } catch (error) {
    console.error('Error adding questions to history:', error);
  }
}

/**
 * Get unique questions that haven't been used recently
 * Returns a summary of previously asked questions for context
 */
export function getPreviouslyAskedQuestions(jobRole: string, resumeContent: string): string[] {
  try {
    const history = getQuestionHistory(jobRole, resumeContent);
    return history.map(h => h.question);
  } catch (error) {
    console.error('Error getting previously asked questions:', error);
    return [];
  }
}

/**
 * Clear old histories (older than QUESTION_HISTORY_EXPIRY_DAYS)
 */
export function cleanupOldHistories(): void {
  try {
    const histories = getAllHistories();
    const now = new Date();
    const expiryDate = new Date(now.getTime() - QUESTION_HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const validHistories = histories.filter(h => {
      const lastUpdated = new Date(h.lastUpdatedAt);
      return lastUpdated > expiryDate;
    });

    saveAllHistories(validHistories);
  } catch (error) {
    console.error('Error cleaning up old histories:', error);
  }
}

/**
 * Get statistics about question usage
 */
export function getQuestionStatistics(jobRole: string, resumeContent: string): {
  totalQuestionsAsked: number;
  uniqueQuestions: number;
  averageReuse: number;
} {
  try {
    const history = getQuestionHistory(jobRole, resumeContent);
    const totalQuestionsAsked = history.length;
    const uniqueQuestions = new Set(history.map(q => q.question)).size;
    const averageReuse = totalQuestionsAsked / uniqueQuestions || 0;

    return {
      totalQuestionsAsked,
      uniqueQuestions,
      averageReuse,
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return {
      totalQuestionsAsked: 0,
      uniqueQuestions: 0,
      averageReuse: 0,
    };
  }
}

/**
 * Export all question history for backup
 */
export function exportQuestionHistory(): string {
  const histories = getAllHistories();
  return JSON.stringify(histories, null, 2);
}

/**
 * Clear all question history (for testing or user request)
 */
export function clearAllQuestionHistory(): void {
  localStorage.removeItem(QUESTION_HISTORY_KEY);
}
