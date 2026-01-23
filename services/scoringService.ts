/**
 * Interview Scoring Service
 * Handles all scoring calculations and interview result management
 */

export interface ScoreData {
  confidence: number;
  technical: number;
  communication: number;
}

export interface InterviewResult {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  hrId: string;
  hrName: string;
  scores: ScoreData & { overall: number };
  feedback: {
    confidence: string;
    technical: string;
    communication: string;
    general: string;
  };
  timestamp: string;
  duration: number; // in seconds
}

/**
 * Calculate overall score based on weighted average
 * Confidence: 30%, Technical: 40%, Communication: 30%
 */
export const calculateOverallScore = (scores: ScoreData): number => {
  const overall = Math.round(
    scores.confidence * 0.3 +
    scores.technical * 0.4 +
    scores.communication * 0.3
  );
  return Math.min(100, Math.max(0, overall));
};

/**
 * Determine grade based on score
 */
export const getGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  return 'D';
};

/**
 * Get performance level description
 */
export const getPerformanceLevel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Improvement';
  return 'Below Expectations';
};

/**
 * Validate scores are within acceptable range
 */
export const validateScores = (scores: ScoreData): boolean => {
  return (
    scores.confidence >= 0 && scores.confidence <= 100 &&
    scores.technical >= 0 && scores.technical <= 100 &&
    scores.communication >= 0 && scores.communication <= 100
  );
};

/**
 * Create interview result object
 */
export const createInterviewResult = (
  sessionId: string,
  candidateId: string,
  candidateName: string,
  hrId: string,
  hrName: string,
  scores: ScoreData,
  feedback: { confidence: string; technical: string; communication: string; general: string },
  durationSeconds: number
): InterviewResult => {
  if (!validateScores(scores)) {
    throw new Error('Invalid scores provided');
  }

  return {
    sessionId,
    candidateId,
    candidateName,
    hrId,
    hrName,
    scores: {
      ...scores,
      overall: calculateOverallScore(scores),
    },
    feedback,
    timestamp: new Date().toISOString(),
    duration: durationSeconds,
  };
};

/**
 * Generate performance summary based on scores
 */
export const generatePerformanceSummary = (scores: ScoreData & { overall: number }): string => {
  const overallLevel = getPerformanceLevel(scores.overall);
  const strengths = [];
  const areasForImprovement = [];

  if (scores.confidence >= 75) strengths.push('strong confidence');
  else if (scores.confidence < 50) areasForImprovement.push('building confidence');

  if (scores.technical >= 75) strengths.push('solid technical knowledge');
  else if (scores.technical < 50) areasForImprovement.push('improving technical expertise');

  if (scores.communication >= 75) strengths.push('excellent communication');
  else if (scores.communication < 50) areasForImprovement.push('enhancing communication skills');

  let summary = `${overallLevel} overall performance (${scores.overall}/100). `;

  if (strengths.length > 0) {
    summary += `Strengths include ${strengths.join(', ')}. `;
  }

  if (areasForImprovement.length > 0) {
    summary += `Areas for improvement: ${areasForImprovement.join(', ')}.`;
  }

  return summary;
};

/**
 * Format interview result for storage
 */
export const formatResultForStorage = (result: InterviewResult): Record<string, any> => {
  return {
    sessionId: result.sessionId,
    candidateId: result.candidateId,
    candidateName: result.candidateName,
    hrId: result.hrId,
    hrName: result.hrName,
    confidenceScore: result.scores.confidence,
    technicalScore: result.scores.technical,
    communicationScore: result.scores.communication,
    overallScore: result.scores.overall,
    confidenceFeedback: result.feedback.confidence,
    technicalFeedback: result.feedback.technical,
    communicationFeedback: result.feedback.communication,
    generalFeedback: result.feedback.general,
    timestamp: result.timestamp,
    durationSeconds: result.duration,
    grade: getGrade(result.scores.overall),
    performanceLevel: getPerformanceLevel(result.scores.overall),
  };
};

/**
 * Compare two interview results
 */
export const compareResults = (
  result1: InterviewResult,
  result2: InterviewResult
): { improved: boolean; scoreDifference: number; details: string } => {
  const scoreDiff = result2.scores.overall - result1.scores.overall;
  const improved = scoreDiff > 0;

  let details = `Score changed from ${result1.scores.overall} to ${result2.scores.overall} `;
  details += `(${improved ? '+' : ''}${scoreDiff} points). `;
  details += `Confidence: ${result1.scores.confidence}→${result2.scores.confidence}, `;
  details += `Technical: ${result1.scores.technical}→${result2.scores.technical}, `;
  details += `Communication: ${result1.scores.communication}→${result2.scores.communication}.`;

  return { improved, scoreDifference: scoreDiff, details };
};

/**
 * Calculate statistics for multiple results
 */
export const calculateStatistics = (results: InterviewResult[]): Record<string, number> => {
  if (results.length === 0) {
    return {
      averageScore: 0,
      averageConfidence: 0,
      averageTechnical: 0,
      averageCommunication: 0,
      highestScore: 0,
      lowestScore: 0,
    };
  }

  const scores = results.map(r => r.scores.overall);
  const confidenceScores = results.map(r => r.scores.confidence);
  const technicalScores = results.map(r => r.scores.technical);
  const communicationScores = results.map(r => r.scores.communication);

  return {
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    averageConfidence: Math.round(confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length),
    averageTechnical: Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length),
    averageCommunication: Math.round(communicationScores.reduce((a, b) => a + b, 0) / communicationScores.length),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
  };
};

export default {
  calculateOverallScore,
  getGrade,
  getPerformanceLevel,
  validateScores,
  createInterviewResult,
  generatePerformanceSummary,
  formatResultForStorage,
  compareResults,
  calculateStatistics,
};
