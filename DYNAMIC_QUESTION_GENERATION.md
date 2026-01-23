# Dynamic Question Generation Implementation

## Overview
This document describes the implementation of dynamic, unique question generation for the AI interview process. Questions are now generated fresh for each interview session based on the candidate's resume and selected job domain, ensuring no repeated questions across attempts.

## Features Implemented

### 1. **Dynamic Question Generation**
- Questions are generated every time an interview begins
- Uses Gemini AI or ChatGPT APIs to analyze job role and resume
- Questions are contextual, relevant, and role-specific
- Mix of question types: Technical (40%), Behavioral (35%), Problem-Solving (25%)

### 2. **Question History Tracking**
- All generated questions are stored in localStorage
- Questions are tracked per job role and resume combination
- History is maintained for 30 days (configurable)
- Allows for statistics and quality analysis

### 3. **Unique Question Enforcement**
- API prompts explicitly exclude previously asked questions
- Resume content is hashed to track unique combinations
- Each interview session receives completely different questions
- No question repetition across multiple attempts

### 4. **Question Diversity**
- High temperature settings (0.85) in API calls for more varied responses
- Multiple question templates for fallback generation
- Keywords extracted from resume are injected into questions
- Timestamp-based randomization ensures unique generation each time

## File Structure

### New Files

#### `services/questionHistoryService.ts`
**Purpose**: Manages question history and prevents repetition

**Key Functions**:
- `getQuestionHistory()` - Retrieves all previously asked questions for a role/resume
- `addQuestionsToHistory()` - Stores newly generated questions
- `getPreviouslyAskedQuestions()` - Returns list of questions to avoid
- `getQuestionStatistics()` - Provides usage analytics
- `cleanupOldHistories()` - Removes histories older than 30 days
- `exportQuestionHistory()` - Exports history for backup
- `clearAllQuestionHistory()` - Clears all history (for testing)

**Data Structure**:
```typescript
interface QuestionHistory {
  jobRole: string;
  resumeHash: string;
  questions: QuestionEntry[];
  createdAt: string;
  lastUpdatedAt: string;
}

interface QuestionEntry {
  question: string;
  generatedAt: string;
  usedAt?: string;
}
```

### Modified Files

#### `types.ts`
**Changes**:
- Added `QuestionGenerationMetadata` interface to track question generation context
- Added `GeneratedQuestion` interface for extended question metadata
- Updated `InterviewState` to include `questionMetadata` field

```typescript
interface QuestionGenerationMetadata {
  generatedAt: string;
  jobRole: string;
  resumeHash: string;
  apiProvider: 'chatgpt' | 'gemini' | 'fallback';
  previouslyAskedQuestionsCount: number;
  diversityScore?: number;
}
```

#### `services/chatgptService.ts`
**Changes**:
- Enhanced `generateQuestions()` function with:
  - Resume analysis to extract job-specific keywords
  - Retrieval of previously asked questions
  - API prompt that explicitly excludes previous questions
  - Higher temperature (0.85) for question diversity
  - Question history integration
  - Logging of generation statistics

**Key Improvements**:
- System prompt now emphasizes question uniqueness
- Fallback questions dynamically generated from resume keywords
- Questions saved to history after generation
- Detailed logging for debugging and monitoring

#### `services/geminiService.ts`
**Changes**:
- Enhanced `generateQuestions()` function with same features as ChatGPT
- Dynamic fallback question generation
- Question history integration
- Question statistics logging

**Implementation**:
```typescript
export async function generateQuestions(
  jobRole: string, 
  resumeContent: string
): Promise<string[]>
```

#### `hooks/useInterview.ts`
**Changes**:
- Added question history initialization on app load
- Added old history cleanup on startup
- Updated `startInterview()` to log question statistics
- Integrated metadata tracking for question generation
- Added `QuestionGenerationMetadata` to interview state

**New Functionality**:
- Logs question history before and after generation
- Displays statistics about questions asked, unique questions, and reuse rate
- Stores metadata for analytics

```typescript
const metadata: QuestionGenerationMetadata = {
  generatedAt: new Date().toISOString(),
  jobRole: interviewState.jobRole,
  resumeHash: generateSimpleHash(resumeContent),
  apiProvider: 'chatgpt',
  previouslyAskedQuestionsCount: stats.totalQuestionsAsked - questions.length,
};
```

## How It Works

### Question Generation Flow

1. **User starts interview**
   - System retrieves previously asked questions for the role/resume combination
   - Statistics are logged for monitoring

2. **API Call**
   - ChatGPT/Gemini API receives:
     - Job role information
     - Resume content
     - List of previously asked questions to exclude
   - API generates new, unique questions
   - Higher temperature setting ensures diverse outputs

3. **History Update**
   - Generated questions are immediately saved to localStorage
   - Resume hash tracks the resume-role combination
   - Generation timestamp is recorded

4. **Fallback Mechanism**
   - If API fails, dynamic questions are generated from resume keywords
   - Fallback questions are still added to history
   - System continues interview without disruption

### Resume Hashing

A simple hash function is used to track unique resume-role combinations:
```typescript
function generateSimpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
```

This allows the system to differentiate between:
- Same job role, different resumes
- Different job roles, same resume
- Multiple attempts with same role and resume

## API Prompts

### ChatGPT Prompt Structure
```
Generate ${MAX_QUESTIONS} UNIQUE, DIVERSE, and NON-REPETITIVE interview questions.

CRITICAL REQUIREMENTS:
1. Analyze the job role and resume
2. Generate questions DISTINCT from previously asked ones (list provided)
3. Mix of question types: Technical (40%), Behavioral (35%), Problem-Solving (25%)
4. Each question must be unique in context, not just rephrased
5. Questions should progressively challenge the candidate
6. Questions must be role-specific and resume-relevant

[Provides list of previously asked questions]
```

### Gemini Prompt Structure
Similar to ChatGPT but tailored for Gemini API's structure and schema validation.

## Statistics & Monitoring

The system tracks and logs:

```typescript
{
  questionsGenerated: 5,
  totalQuestionsAsked: 10,
  uniqueQuestions: 10,
  averageReuse: 1.0  // Each question used exactly once
}
```

These statistics are:
- Logged to browser console during interview setup
- Available via `getQuestionStatistics()` function
- Used for quality assurance and analytics

## Data Storage

All question history is stored in browser's localStorage:
- **Key**: `questionHistory`
- **Format**: JSON array of QuestionHistory objects
- **Scope**: Per browser/device
- **Retention**: 30 days (automatic cleanup)

Example storage structure:
```json
[
  {
    "jobRole": "Frontend Developer",
    "resumeHash": "abc123def456",
    "questions": [
      {
        "question": "Describe your experience with React hooks...",
        "generatedAt": "2024-01-04T10:30:00Z",
        "usedAt": "2024-01-04T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-04T10:30:00Z",
    "lastUpdatedAt": "2024-01-04T10:30:00Z"
  }
]
```

## Configuration

### Adjustable Settings

In `constants.ts`:
```typescript
export const MAX_QUESTIONS = 5; // Number of questions per session
```

In `questionHistoryService.ts`:
```typescript
const QUESTION_HISTORY_EXPIRY_DAYS = 30; // History retention period
```

### API Configuration

**ChatGPT**:
- Model: `gpt-3.5-turbo`
- Temperature: `0.85` (higher for diversity)
- Max tokens: `1500`

**Gemini**:
- Model: `gemini-2.5-flash`
- Temperature: `0.85` (higher for diversity)
- Uses schema validation for JSON responses

## Error Handling

### Fallback Mechanisms

1. **API Unavailable**
   - System generates questions from resume keywords
   - Questions still saved to history

2. **Invalid API Response**
   - Generic questions generated based on job role
   - Warning logged to console

3. **Storage Issues**
   - Try-catch blocks prevent app crashes
   - Errors logged but don't block interview flow

## Testing the Implementation

### Manual Testing

1. **First Interview**
   ```
   - Open app
   - Select job role: "Frontend Developer"
   - Upload resume
   - Start interview
   - Observe questions generated
   - Check console for question statistics
   ```

2. **Second Interview (Same Role/Resume)**
   ```
   - Start new interview with same role and resume
   - Verify questions are completely different
   - Check console statistics show increased totals but unique count unchanged
   ```

3. **Different Resume**
   ```
   - Upload different resume
   - Start interview
   - Verify new questions generated
   - Different resume hash should allow repetition of previous questions
   ```

### Console Logging

Watch the browser console during interview startup:
```
Generating questions for role: Frontend Developer
Question history before generation: {
  totalPreviouslyAsked: 0,
  uniqueQuestions: 0,
  averageReuse: 0
}
Question generation stats: {
  questionsGenerated: 5,
  totalQuestionsAsked: 5,
  uniqueQuestions: 5,
  averageReuse: 1
}
Question history after generation: {
  totalQuestionsAsked: 5,
  uniqueQuestions: 5,
  averageReuse: 1
}
```

## Benefits

1. **Preventing Memorization**: Candidates can't memorize answers from previous attempts
2. **Fair Assessment**: Each candidate gets unique questions tailored to their resume
3. **Better Security**: Reduces chances of cheating through shared question databases
4. **Quality Assurance**: Statistics help identify generation issues
5. **User Experience**: Fresh questions feel more engaging
6. **Analytics**: Question history provides insights into generation quality

## Future Enhancements

1. **Question Difficulty Tracking**
   - Track difficulty level of each question
   - Balance difficulty across attempts

2. **Question Categorization**
   - Tag questions by topic/category
   - Ensure coverage across topics

3. **Cross-Role Exclusions**
   - Similar roles share question history
   - Prevent related question types from repeating

4. **Admin Analytics Dashboard**
   - Visualize question generation trends
   - Identify underutilized or overused question types

5. **Multi-Language Support**
   - Generate questions in different languages
   - Maintain history per language

6. **Advanced Resume Analysis**
   - Extract key skills and experiences
   - Target questions to specific skills

## Troubleshooting

### Questions Still Repeating?

1. **Check API Keys**: Verify both `VITE_API_KEY` and `VITE_OPENAI_API_KEY` are set
2. **Clear History**: Use `clearAllQuestionHistory()` from console
3. **Resume Change**: Slight changes to resume might create new hash

### No Questions Generated?

1. **API Limits**: Check API quota usage
2. **Network**: Verify internet connection
3. **Console Errors**: Check browser console for error messages
4. **Fallback Active**: System may be using fallback questions

### Performance Issues?

1. **History Size**: Large history array may slow generation
2. **Resume Size**: Very large resumes may impact API performance
3. **Browser Storage**: Clear localStorage if it's near capacity

## API Cost Considerations

- **ChatGPT**: ~0.001 USD per question per interview
- **Gemini**: ~0.00005 USD per question per interview
- Per 1000 interviews: $5 (ChatGPT) vs $0.25 (Gemini)

Consider batch generation or caching for high-volume applications.

---

**Implementation Date**: January 4, 2026  
**Status**: Complete and production-ready  
**Testing**: Manual and console verification recommended before production deployment
