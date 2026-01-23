# Dynamic Question Generation - Quick Start & Testing Guide

## Quick Start

### Prerequisites
- Node.js and npm installed
- Gemini API key or ChatGPT API key configured
- Environment variables set in `.env` file

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Keys**
   
   Create or update `.env` file:
   ```env
   # For Gemini API
   VITE_API_KEY=your_gemini_api_key_here
   
   # For ChatGPT API
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173` (or configured port)
   - Open DevTools (F12) to monitor console logs

## Testing Checklist

### ✅ Test 1: Initial Question Generation

**Objective**: Verify questions are generated dynamically on first attempt

**Steps**:
1. Start the application
2. Go through Setup screen with job role "Frontend Developer"
3. Upload a sample resume
4. Grant camera/microphone permissions
5. Interview starts

**Expected Results**:
- [ ] Console shows: "Generating questions for role: Frontend Developer"
- [ ] Console shows "Question history before generation" with all zeros
- [ ] Interview screen displays 5 questions
- [ ] Console shows "Question history after generation" with updated stats
- [ ] Questions are relevant to Frontend Developer role

**Console Output Example**:
```
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
```

### ✅ Test 2: Question Uniqueness on Second Attempt

**Objective**: Verify questions are different on second interview with same role/resume

**Steps**:
1. Complete or skip first interview
2. Start new interview with same job role
3. Upload the SAME resume file
4. Compare questions to first interview

**Expected Results**:
- [ ] Questions are completely different from first attempt
- [ ] Console shows totalPreviouslyAsked increased (5 in this example)
- [ ] uniqueQuestions count matches totalPreviouslyAsked
- [ ] All 5 new questions are unique (not variations of previous ones)
- [ ] No questions are repeated from first interview

**Console Output Example**:
```
Question history before generation: {
  totalPreviouslyAsked: 5,
  uniqueQuestions: 5,
  averageReuse: 1
}
Question generation stats: {
  questionsGenerated: 5,
  totalQuestionsAsked: 10,
  uniqueQuestions: 10,
  averageReuse: 1
}
```

### ✅ Test 3: Different Resume = Allowed Repetition

**Objective**: Verify that different resumes can get similar questions

**Steps**:
1. Upload a completely different resume
2. Select same job role
3. Start interview
4. Compare questions to both previous attempts

**Expected Results**:
- [ ] Questions may partially match previous attempts (which is acceptable)
- [ ] Console shows different resumeHash value
- [ ] totalQuestionsAsked resets for new resume (different hash)
- [ ] System treats this as a new candidate

**Console Output**:
```
Different resumeHash indicates new candidate/resume combo
Questions can now repeat from previous attempts since resume changed
```

### ✅ Test 4: History Persistence

**Objective**: Verify question history persists across browser sessions

**Steps**:
1. Complete first interview with role "Frontend Developer"
2. Note the total questions count (should be 5)
3. Close the browser completely
4. Reopen the application
5. Start new interview with same role and resume

**Expected Results**:
- [ ] Previous questions history is preserved
- [ ] Console shows totalPreviouslyAsked = 5
- [ ] New questions are generated (5 more unique)
- [ ] Total now shows 10

### ✅ Test 5: Fallback Question Generation

**Objective**: Test that system works even without API

**Steps**:
1. Comment out API keys in `.env` file
2. Restart dev server
3. Start new interview

**Expected Results**:
- [ ] Console shows: "No API key configured. Using dynamic fallback questions."
- [ ] 5 questions are still generated
- [ ] Questions appear relevant to job role
- [ ] Questions are saved to history
- [ ] Interview continues normally

### ✅ Test 6: Multiple Job Roles

**Objective**: Verify different job roles have separate question histories

**Steps**:
1. Complete interview as "Frontend Developer" (5 questions)
2. Start new interview as "Backend Developer"
3. Upload same resume
4. Complete interview as "Data Scientist" with same resume
5. Return to "Frontend Developer" with same resume

**Expected Results**:
- [ ] Each job role maintains separate history
- [ ] Backend Developer gets fresh questions (not Frontend questions)
- [ ] Data Scientist gets fresh questions (not Frontend/Backend)
- [ ] When returning to Frontend Developer, system remembers it already had 5 questions
- [ ] Only generates new Frontend questions (5-10 total for Frontend role)

### ✅ Test 7: History Statistics

**Objective**: Verify statistics are calculated correctly

**Steps**:
1. Complete 3 interviews with same role and resume
2. Open browser console
3. Run: `localStorage.getItem('questionHistory')`

**Expected Results**:
- [ ] History object shows totalQuestionsAsked = 15 (5 x 3)
- [ ] uniqueQuestions = 15 (all different)
- [ ] averageReuse = 1.0 (each used exactly once)
- [ ] Each question has different text

### ✅ Test 8: Console Monitoring

**Objective**: Verify all console logs work correctly

**Steps**:
1. Open DevTools Console tab
2. Set filter to: "Question generation"
3. Start interview
4. Watch for log messages

**Expected Console Messages**:
```
✓ "Generating questions for role: [role]"
✓ "Question history before generation: {...}"
✓ "Question history after generation: {...}"
✓ "Gemini question generation stats: {...}" (if using Gemini)
✓ "Question generation stats: {...}" (if using ChatGPT)
```

## Debugging Commands

### Run in Browser Console

```javascript
// View all question history
localStorage.getItem('questionHistory')

// Clear all history (for testing)
localStorage.removeItem('questionHistory')

// Get specific stats
JSON.parse(localStorage.getItem('questionHistory') || '[]')
  .find(h => h.jobRole === 'Frontend Developer')

// Export history to file
copy(localStorage.getItem('questionHistory'))
```

## Monitoring & Logs

### Enable Debug Mode

Add to your code for detailed logging:
```typescript
const DEBUG = true;

if (DEBUG) {
  console.log('Question Generation Debug Info:', {
    jobRole,
    resumeLength: resumeContent.length,
    previousQuestions: previousQuestions.length,
    timestamp: new Date().toISOString(),
  });
}
```

### Check API Response

In `chatgptService.ts`, add logging:
```typescript
console.log('ChatGPT Response:', {
  model: 'gpt-3.5-turbo',
  questionsGenerated: questions.length,
  timestamp: new Date().toISOString(),
  questions: questions.slice(0, 2), // Log first 2 for brevity
});
```

## Expected Behavior Summary

| Test | Expected Result |
|------|-----------------|
| First Interview | 5 new questions generated |
| Same Role/Resume | 5 completely different questions |
| Different Resume | May have similar questions (new resume) |
| Browser Restart | History persists, no duplication |
| API Unavailable | Fallback questions still generated |
| Multiple Roles | Each role has independent history |
| Statistics | Accurate counts of unique/total questions |
| Console Logs | All generation events logged |

## Common Issues & Solutions

### Issue: Questions repeat between attempts

**Solution**:
1. Check browser DevTools > Application > Storage > Local Storage
2. Verify `questionHistory` key exists
3. Confirm resumeHash matches between attempts
4. Clear history: `localStorage.removeItem('questionHistory')`
5. Try again

### Issue: No console logs appearing

**Solution**:
1. Check DevTools > Console > Log level (should be "All" or "Verbose")
2. Filter for "Question" or "generation"
3. Check for console warnings/errors
4. Verify API calls are being made

### Issue: API errors

**Solution**:
```javascript
// Check API key
console.log('API Keys available:', {
  gemini: !!import.meta.env.VITE_API_KEY,
  openai: !!import.meta.env.VITE_OPENAI_API_KEY,
})
```

### Issue: Fallback questions not relevant

**Solution**:
1. Verify resume content is being uploaded
2. Check resume has sufficient keywords (>4 character words)
3. Ensure resume file is readable text/PDF

## Performance Testing

### Load Test

Test with many interviews:
```javascript
// Simulated - run interviews programmatically
for (let i = 0; i < 100; i++) {
  // Generate questions for same role/resume
}
// Check performance doesn't degrade
// Verify all 100 sets of questions are unique
```

### Storage Test

```javascript
// Check localStorage usage
const history = JSON.parse(localStorage.getItem('questionHistory') || '[]');
const size = new Blob([JSON.stringify(history)]).size;
console.log(`History size: ${(size / 1024).toFixed(2)} KB`);
```

## Acceptance Criteria

For production deployment, verify all of these pass:

- [ ] Questions generate dynamically (no hardcoded list)
- [ ] No repetition within same role/resume across 5+ attempts
- [ ] Different resumes/roles work independently
- [ ] History persists across browser sessions
- [ ] Fallback works when API unavailable
- [ ] Performance acceptable (< 2 seconds to generate)
- [ ] All console logs appear as expected
- [ ] localStorage doesn't exceed reasonable limits
- [ ] Error handling prevents app crashes
- [ ] Statistics are accurate

## Deployment Checklist

Before going live:

1. [ ] All API keys are securely configured
2. [ ] Question history cleanup working (30-day expiry)
3. [ ] localStorage quota won't be exceeded
4. [ ] Error handling is comprehensive
5. [ ] Console logs are appropriate for production
6. [ ] Performance meets requirements
7. [ ] Cross-browser compatibility tested
8. [ ] Mobile/tablet tested
9. [ ] Backup/export functionality available
10. [ ] Documentation complete

---

**Last Updated**: January 4, 2026  
**Status**: Ready for Testing  
**Next Step**: Execute all test cases and document results
