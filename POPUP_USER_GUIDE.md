# Candidate Join Popup - User Guide

## Quick Start: 3 Simple Steps

### Step 1: HR Starts Interview
1. Open HR Dashboard
2. Click **"Start Interview"** on any scheduled interview
3. **Popup appears automatically** ✨

### Step 2: Copy & Share Link
1. Click **"Copy Link to Clipboard"** button
2. Link is copied automatically ✓
3. Share with candidate via:
   - Email
   - Chat/Messaging app
   - WhatsApp
   - SMS

### Step 3: Candidate Joins
1. Candidate clicks the link
2. Camera auto-activates
3. Role auto-selects as "Candidate"
4. **Interview starts** 🎥
5. **Both see each other** 👥

---

## What You'll See

### The Popup (When HR Starts Interview)

```
╔════════════════════════════════════════╗
║  ✕                                     ║
║                                        ║
║  Interview Started                     ║
║  Share this link with the candidate    ║
║  to join the interview                 ║
║                                        ║
║  ✓ Ready for Candidate                 ║
║  Session ID: session-xxx-xxx           ║
║                                        ║
║  Interview Link:                       ║
║  ┌────────────────────────────────────┐║
║  │ http://domain.com/interview/...  📋║
║  └────────────────────────────────────┘║
║                                        ║
║  How to Share:                         ║
║  • Copy the link                       ║
║  • Send to candidate                   ║
║  • Candidate clicks link               ║
║  • Interview begins                    ║
║                                        ║
║  ╔════════════════════════════════════╗║
║  ║ 📋 Copy Link to Clipboard         ║║
║  ╚════════════════════════════════════╝║
║                                        ║
║  ╔════════════════════════════════════╗║
║  ║ Continue Interview                ║║
║  ╚════════════════════════════════════╝║
║                                        ║
╚════════════════════════════════════════╝
```

### The Interview (Both Cameras Active)

```
┌─────────────────────────────────────────┐
│  Interview Session | ID: session-xxx    │
│  ⏱️  00:05:23                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┬──────────────────┐│
│  │                  │                  ││
│  │   HR Camera      │  Candidate Camera││
│  │   (You - HR)     │  (Waiting...)    ││
│  │                  │                  ││
│  │  🎥 Video ON     │  🎥 Video ON     ││
│  │  🎤 Audio ON     │  🎤 Audio ON     ││
│  │                  │                  ││
│  └──────────────────┴──────────────────┘│
│                                         │
│  [🔇 Mute] [📹 Stop Video] [☎️ End Call]│
│                                         │
├─────────────────────────────────────────┤
│  HR Scoring Panel                       │
│  Confidence:  ████░░░░░░  40%           │
│  Technical:   ███░░░░░░░  30%           │
│  Communication: ██████░░░░ 60%          │
│  Overall: 43/100                        │
└─────────────────────────────────────────┘
```

---

## Feature Highlights

### ✨ For HR

- **One-Click Sharing**: Copy interview link in one click
- **Automatic Popup**: No manual setup needed
- **Clear Instructions**: Step-by-step guide in popup
- **Professional UI**: Modern, easy-to-read design
- **Status Indicators**: Know when candidate is ready
- **Live Scoring**: Evaluate while interviewing
- **Connection Status**: See real-time connection info

### ✨ For Candidate

- **Simple Link**: Just click and join
- **Auto Role Selection**: No need to choose roles
- **Instant Camera**: Camera starts automatically
- **Clear Labels**: Know who is who on screen
- **Interview Info**: See position and duration
- **Audio/Video Controls**: Easy access to settings
- **Professional Environment**: Clean, focused UI

---

## Common Scenarios

### Scenario 1: HR Starts, Then Shares Link

```
HR clicks "Start Interview"
    ↓
Popup appears
    ↓
HR clicks "Copy Link to Clipboard"
    ↓
HR sends link via email to candidate
    ↓
Candidate clicks link in email
    ↓
Candidate's camera activates
    ↓
Both see each other
    ↓
Interview begins ✓
```

### Scenario 2: HR Waits for Candidate to Join

```
HR clicks "Start Interview"
    ↓
Popup appears
    ↓
HR clicks "Continue Interview"
    ↓
HR waits for candidate
    ↓
[HR sees: "Waiting to join..." on candidate's video]
    ↓
Candidate clicks link
    ↓
[HR sees: Candidate's camera feed activates]
    ↓
Interview begins ✓
```

### Scenario 3: Candidate Uses Dashboard

```
Candidate opens Candidate Dashboard
    ↓
Clicks "Join Interview"
    ↓
Selects "Join as Candidate"
    ↓
Camera activates
    ↓
Waits for HR to join
    ↓
[Sees: "Waiting for HR to join..."]
    ↓
HR joins
    ↓
Interview begins ✓
```

---

## Troubleshooting

### Q: Popup doesn't appear
**A:** Make sure you're logged in as HR and clicked "Start Interview" from HR Dashboard

### Q: Copy button doesn't work
**A:** Check browser permissions. Your browser may be blocking clipboard access.

### Q: Can't see candidate's camera
**A:** 
1. Wait 5-10 seconds for connection
2. Ensure candidate granted camera permission
3. Check internet connection
4. Try refreshing the page

### Q: Camera permission denied
**A:** 
1. Go to browser settings
2. Find "Camera" permissions
3. Allow access to interview website
4. Reload the page

### Q: Candidate says they can't see my camera
**A:**
1. Check your camera is turned ON (green dot)
2. Ensure you didn't click "Stop Video"
3. Try refreshing the page
4. Test camera with another app

### Q: Connection lost during interview
**A:**
1. Check internet connection
2. Refresh the page
3. Try rejoining with same URL
4. Restart your router if needed

---

## Best Practices

### For HR

✅ **DO:**
- Ensure your camera works before starting
- Share link immediately after starting
- Keep popup visible until candidate joins
- Greet candidate when they join
- Start interview within reasonable time
- End call properly when done

❌ **DON'T:**
- Start interview and leave immediately
- Share link with multiple candidates at once
- Modify or shorten the interview URL
- Close browser while interviewing
- Forget to end the interview

### For Candidates

✅ **DO:**
- Test camera before clicking link
- Click link in a quiet environment
- Allow camera/microphone permissions
- Be professional and friendly
- Follow HR's instructions
- Let HR know if you have connection issues

❌ **DON'T:**
- Share interview link with others
- Modify the URL
- Close browser during interview
- Use the link multiple times
- Ignore HR when they're speaking

---

## Technical Details (For IT Support)

### Browser Requirements
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓

### Required Permissions
- Camera access (getUserMedia)
- Microphone access (getUserMedia)
- Clipboard write (navigator.clipboard.writeText)

### Network Requirements
- Minimum 2 Mbps upload/download
- Stable internet connection
- No proxy blocking WebRTC
- Firewall allows WebRTC ports

### Session Duration
- Maximum 4 hours per session
- Auto-cleanup after session ends
- Sessions expire after 1 hour inactivity

---

## Support & Feedback

**Having Issues?**

1. Check this guide
2. Review troubleshooting section
3. Contact IT Support with:
   - Your browser name & version
   - Interview ID (session-xxx-xxx)
   - Specific error message
   - Steps you took before error

**Feature Requests?**

Contact: support@company.com
Subject: Interview Platform Feature Request

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Live & Ready  
**Support:** 24/7 Available
