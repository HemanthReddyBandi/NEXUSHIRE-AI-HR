# Quick Start: Dual Access Interview

## What Changed?

Both HR and candidates can now join the **same interview session** using a **unified URL**.

## For HR Users

### Starting an Interview
1. Open **HR Dashboard** (`/hr` or `/hr-dashboard`)
2. Find your scheduled interview in the table
3. Click **"Start Interview"** button
4. You're now in the interview room as HR
5. (Optional) Click **"Share Link"** to copy the interview URL and send to candidate

### What You Get
- Pre-selected HR role (no role selection needed)
- Live scoring panel for evaluating the candidate
- Real-time feedback recording
- Video conferencing with candidate

## For Candidates

### Option 1: Join via Dashboard
1. Open **Candidate Dashboard** (`/candidate-dashboard`)
2. Find your upcoming interview
3. Click **"Join Interview"** button
4. Select **"Join as Candidate"**
5. Start the interview

### Option 2: Join via Shared Link (NEW!)
1. Click the interview link shared by HR
2. Candidate role auto-selects automatically
3. Interview starts immediately
4. No additional steps needed

### What You Get
- Video conferencing with HR
- Interview information panel
- Real-time status updates
- Professional interview environment

## The Key Difference

| Before | After |
|--------|-------|
| HR and Candidate had separate URLs | Same URL for both parties |
| Had to manually select roles | Roles auto-selected when navigating from dashboard |
| Sharing was complicated | "Share Link" button copies URL instantly |
| Not flexible on who joins first | Either party can join first |

## URL Structure

```
Frontend: https://domain.com/interview/{sessionId}

Examples:
- https://domain.com/interview/session-1234567890
- https://domain.com/interview/interview-001
```

## How to Use the Share Link Feature

### HR Side
1. In HR Dashboard, click **"Share Link"** on any scheduled interview
2. Link is copied to clipboard automatically
3. An alert shows the link: `https://domain.com/interview/{id}`
4. Share this link with candidate via:
   - Email
   - Slack/Teams
   - SMS
   - Any messaging platform

### Candidate Side
1. Click the link from HR
2. Page loads with role pre-selected as "Candidate"
3. Click **"Enter as Candidate"** button
4. Interview starts instantly
5. See HR in video feed when they're ready

## Session Management

### Active Sessions Tracking
The system now tracks:
- Session ID
- Candidate name & HR name
- Position being interviewed for
- When session started
- Current participants (HR joined? Candidate joined?)
- Session status (active/completed/cancelled)

### Automatic Session Cleanup
- Sessions older than 1 hour are automatically removed
- Completed sessions are archived
- Expired sessions are cleaned up on app restart

## Technical Details

### Modified Files
1. **`components/Hr-Dashboard.tsx`** - Updated interview actions
2. **`components/InterviewLiveConferencePage.tsx`** - Added role state handling
3. **`services/storageService.ts`** - Added session management functions

### New API Functions
```typescript
// Create a new session
createInterviewSession(sessionData)

// Get all active sessions
getActiveSessions()

// Get specific session
getSession(sessionId)

// Track participant joins
updateSessionParticipant(sessionId, role, joined)

// Update session status
updateSessionStatus(sessionId, status)

// End session
endSession(sessionId)

// Clean old sessions
clearExpiredSessions()
```

### Routes
```
GET  /interview/:sessionId              - Load interview page
POST /interview/:sessionId/start         - HR starts interview
POST /interview/:sessionId/join          - Candidate joins interview
GET  /interview/:sessionId/status        - Get session status
```

## Troubleshooting

### "Role selection screen shows instead of auto-selecting"
- Check that you're clicking from HR/Candidate dashboard
- Or ensure the link includes proper session ID

### "Can't see the other person's video"
- Ensure both participants granted camera permission
- Check network connection
- Verify no other app is using the camera

### "Share Link button doesn't work"
- Check browser clipboard permissions
- Try using the manual method - copy URL from address bar

### "Session says completed but should be active"
- Refresh the page
- Check if session expired (older than 1 hour)
- Restart from dashboard

## Best Practices

✅ **DO**
- Share link with candidate immediately after scheduling
- Allow candidate to join a few minutes early
- Have both parties test audio/video before starting
- Keep interview URL confidential
- End session properly after interview completes

❌ **DON'T**
- Share interview URL publicly
- Close browser mid-interview (session continues)
- Use same URL for multiple interviews
- Block clipboard access in browser settings
- Try to join same session with multiple accounts

## Support

For issues or questions:
1. Check this guide first
2. Review the main implementation document
3. Check browser console for errors
4. Ensure all permissions are granted
5. Try refreshing the page

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Implemented and Tested  
**Build Status:** ✅ Successful
