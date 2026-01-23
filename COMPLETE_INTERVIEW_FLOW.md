# Complete Interview Flow: From HR to Candidate - User Guide

## 🎯 The Complete End-to-End Interview Process

### Step-by-Step Workflow

---

## PHASE 1: HR STARTS INTERVIEW

### Step 1: HR Opens Dashboard
```
URL: http://localhost:3000/hr-dashboard (or /hr)
Screen: HR Dashboard with list of scheduled interviews
```

### Step 2: HR Clicks "Start Interview"
```
Location: In the Upcoming Interviews table
Button: "Start Interview" (cyan/blue gradient)
Action: Navigates to /interview/{id} with HR role pre-selected
```

### Step 3: HR's Camera Activates
```
Screen: Interview Session page
What happens:
✓ Browser requests camera/microphone permission
✓ HR grants permission
✓ HR's camera activates
✓ Video shows in left half of screen
✓ Status: "Ready" with green indicator
```

### Step 4: 🎉 POPUP APPEARS 🎉
```
Modal overlay appears with:
✓ "Interview Started"
✓ "Share this link with the candidate to join the interview"
✓ Status badge: "Ready for Candidate"
✓ Session ID: (e.g., "2")
✓ Interview link: http://localhost:3000/interview/2
✓ Copy button: "📋 Copy Link to Clipboard"
✓ Continue button: "Continue Interview"
```

### Step 5: HR Copies Link
```
Action: Click "📋 Copy Link to Clipboard" button
Feedback: Button turns green, shows "✓ Copied!"
Result: URL is copied to clipboard
Example: http://localhost:3000/interview/2
```

### Step 6: HR Shares Link
```
Methods:
- Email
- Chat/Messaging
- WhatsApp
- SMS
- Any communication platform
```

### Step 7: HR Dismisses Popup
```
Action: Click "Continue Interview" button
Result:
✓ Popup closes
✓ Interview interface shows
✓ HR sees:
  - Their camera (left side)
  - Remote video slot (right side) showing "Waiting to join..."
✓ HR can now adjust settings, check audio/video
```

---

## PHASE 2: CANDIDATE JOINS

### Step 1: Candidate Receives Link
```
Example link:
http://localhost:3000/interview/2

Received via:
- Email from HR
- Chat message
- Text message
- Any communication
```

### Step 2: Candidate Clicks Link
```
Action: Click the link in email/message
Navigation: Browser opens interview page
URL bar shows: http://localhost:3000/interview/2
```

### Step 3: Interview Page Loads
```
Screen: Shows role selection page
Title: "Interview Session"
Subtitle: "Join the live video conference"
Visible information:
- Session ID: session-{id}
- Interview details card
- Position, candidate, HR name
```

### Step 4: Candidate Selects Role
```
Screen: Two role selection options shown:
1. "Join as HR" (with HR icon)
2. "Join as Candidate" (with candidate icon)

Candidate clicks: "Join as Candidate" button
Result: Role is selected
```

### Step 5: ✨ WAITING SCREEN APPEARS ✨
```
Animated screen shows:
┌─────────────────────────────────┐
│   ⏱️ (spinning clock)            │
│   Waiting for HR                │
│   The interview is waiting for  │
│   the HR to join...             │
│                                 │
│   ● ● ● (bouncing dots)         │
│                                 │
│   Session ID: 2                 │
│                                 │
│   What happens next:            │
│   ✓ HR joins the interview      │
│   ✓ Your camera will activate   │
│   ✓ You'll see HR on screen     │
│   ✓ Interview begins            │
│                                 │
│  [📹 Join Interview Now]        │
│                                 │
│  Your camera and microphone     │
│  permissions will be requested  │
│  when you join.                 │
└─────────────────────────────────┘

Features:
- Animated spinner
- Bouncing status dots
- Session ID confirmation
- Clear next steps
- Professional design
```

### Step 6: Candidate Clicks "Join Interview Now"
```
Action: Click the blue/cyan button
Result:
✓ Waiting screen closes
✓ Browser requests camera/microphone
✓ Permission prompt appears
```

### Step 7: Candidate Grants Permissions
```
Prompt 1: "Allow access to your camera?"
Action: Candidate clicks "Allow"

Prompt 2: "Allow access to your microphone?"
Action: Candidate clicks "Allow"
```

### Step 8: Candidate's Camera Activates
```
What happens:
✓ Local video stream starts
✓ Camera feed appears on screen
✓ Microphone is ready
✓ Waiting for HR to connect
```

---

## PHASE 3: BOTH CONNECTED - INTERVIEW BEGINS

### Scenario A: HR Already Waiting

If HR already clicked "Continue Interview":

```
Timeline:
1. Candidate clicked "Join Interview Now" → Camera starts
2. WebRTC connection initiates (same session ID: "2")
3. Connection established
4. HR's camera appears on candidate's screen
5. Candidate's camera appears on HR's screen
6. Both see each other immediately
7. 👥 Interview begins
```

### Scenario B: Candidate Joins, HR Continues Later

```
Timeline:
1. Candidate clicked "Join Interview Now" → Camera starts
2. Candidate sees:
   ┌─────────────────┬──────────────────┐
   │ Candidate Video │  Waiting for HR  │
   │  (Local)        │  "Connecting..." │
   └─────────────────┴──────────────────┘

3. HR clicks "Continue Interview"
4. WebRTC connection establishes
5. HR's camera appears on candidate's screen
6. Both see each other
7. 👥 Interview begins
```

---

## THE INTERVIEW INTERFACE

### What Both See

```
┌─────────────────────────────────────────────────────┐
│  Interview Session │ ID: 2 │ Duration: 00:05:23    │
├─────────────────┬───────────────────────────────────┤
│                 │                                   │
│  YOUR CAMERA    │       THEIR CAMERA               │
│  (50% width)    │       (50% width)                 │
│                 │                                   │
│  📹 Video ON    │       📹 Video ON                 │
│  🎤 Audio ON    │       🎤 Audio ON                 │
│                 │                                   │
│  Label:         │       Label:                      │
│  "{Name} (You)" │       "{Name}"                    │
│  "HR"           │       "Candidate"                 │
│                 │                                   │
└─────────────────┴───────────────────────────────────┘

Controls (at bottom):
┌─────────────────────────────────────────────────────┐
│  [🔇 Mute] [📹 Stop Video] [☎️ End Call]             │
└─────────────────────────────────────────────────────┘

HR's Scoring Panel (right side):
┌─────────────────────────────────────────────────────┐
│  Candidate Evaluation                               │
│  Confidence:  ████░░░░░░  40% [Feedback...]        │
│  Technical:   ███░░░░░░░  30% [Feedback...]        │
│  Comm:        ██████░░░░  60% [Feedback...]        │
│  Overall: 43/100                                    │
└─────────────────────────────────────────────────────┘

Candidate's Info Panel (right side):
┌─────────────────────────────────────────────────────┐
│  Interview Information                              │
│  HR Interviewer: {Name}                             │
│  Position: Frontend Developer                       │
│  Interview Type: Live Technical                     │
│  Duration: 00:05:23                                 │
│                                                     │
│  Interview Tips:                                    │
│  ✓ Ensure good lighting                             │
│  ✓ Keep background clean                            │
│  ✓ Check audio/video before joining                 │
│  ✓ Be professional and friendly                     │
└─────────────────────────────────────────────────────┘
```

### Features Available

#### For HR
```
✅ Live camera feed (candidate's video)
✅ Local camera control
✅ Real-time scoring:
   - Confidence (30% weight)
   - Technical (40% weight)
   - Communication (30% weight)
✅ Feedback recording for each category
✅ Overall score calculation
✅ Audio/Video controls
✅ Mute/Unmute microphone
✅ Stop/Start camera
✅ Fullscreen mode
✅ Session timer
✅ End call option
```

#### For Candidate
```
✅ Live camera feed (HR's video)
✅ Local camera control
✅ Interview information
✅ HR name display
✅ Position information
✅ Interview type
✅ Call duration timer
✅ Audio/Video controls
✅ Mute/Unmute microphone
✅ Stop/Start camera
✅ Interview tips panel
✅ Connection status
✅ End call option
```

---

## AUDIO & VIDEO CONTROLS

### Available Controls

```
Button 1: Mute / Unmute
├─ When ON: Shows microphone icon (green)
├─ When OFF: Shows microphone-off icon (red)
└─ Action: Toggles your microphone

Button 2: Stop / Start Video
├─ When ON: Shows video camera icon (green)
├─ When OFF: Shows video-off icon (red)
└─ Action: Toggles your camera

Button 3: End Call
├─ Icon: Phone hang-up (red)
└─ Action: Ends interview and returns to dashboard
```

### Status Indicators

```
Connected: ✓ Green badge showing "Connected"
Waiting:   ⏱️ Yellow badge showing "Waiting to join..."
Error:     ⚠️ Red badge with error message
Duration:  ⏱️ Timer showing: MM:SS format
```

---

## WHAT HAPPENS WHEN BOTH ARE CONNECTED

### Real-Time Communication

```
Video Streaming:
- 30 FPS HD quality
- Synchronized video
- <100ms latency
- Both directions

Audio Streaming:
- Crystal clear audio
- Simultaneous (both can talk)
- Noise suppression
- Echo cancellation

Data Sync:
- Connection status updates
- Score updates (HR side)
- Participant status
- Session duration
```

### Connection Quality Indicators

```
Excellent:  🟢 Green - All systems go
Good:       🟡 Yellow - Working but may have issues
Poor:       🔴 Red - Connection problems
```

---

## ENDING THE INTERVIEW

### HR Ends Interview

```
Action: HR clicks "☎️ End Call" button
Result:
✓ Both cameras stop streaming
✓ Both disconnected from session
✓ Both returned to dashboard
✓ HR can save scores/feedback
✓ Session marked as "completed"
```

### Candidate Ends Interview

```
Action: Candidate clicks "☎️ End Call" button
Result:
✓ Both cameras stop streaming
✓ Both disconnected from session
✓ Candidate returns to dashboard
✓ Interview marked as "completed"
```

---

## TROUBLESHOOTING

### Camera Not Working

**HR:**
1. Check camera permission in browser settings
2. Ensure no other app is using camera
3. Refresh the page
4. Try different browser

**Candidate:**
1. Grant camera permission when prompted
2. Check browser settings
3. Allow camera access in system settings
4. Restart browser

### No Audio

```
Check:
✓ Microphone not muted
✓ Browser has microphone permission
✓ System sound not muted
✓ Check volume levels
✓ Try different microphone if available
```

### Can't See Other Person's Video

```
Check:
✓ Their camera is ON (not button showing OFF)
✓ Wait 5-10 seconds for connection
✓ Their internet connection is good
✓ No firewall blocking
✓ Refresh the page
```

### Waiting Screen Won't Close

```
For Candidate:
✓ Check if button is clickable
✓ Try refreshing the page
✓ Check internet connection
✓ Try again in a few seconds
```

### Connection Lost During Interview

```
What happens:
✓ Status changes to "Disconnected"
✓ Video stream stops
✓ Audio stops

To recover:
✓ Check internet connection
✓ Wait a few seconds (auto-reconnect)
✓ Refresh page if needed
✓ Rejoin interview using same link
```

---

## BEST PRACTICES

### For HR

```
✅ DO:
- Test camera/audio before interview
- Greet candidate when they join
- Make eye contact with camera
- Speak clearly and professionally
- Save scores before ending
- End interview properly

❌ DON'T:
- Start interview and leave
- Close browser during interview
- Share screen without permission
- Talk over candidate
- End interview abruptly
```

### For Candidate

```
✅ DO:
- Test camera/audio before interview
- Arrive early (have link ready)
- Join in quiet environment
- Dress professionally
- Make eye contact with camera
- Listen carefully
- Answer questions clearly

❌ DON'T:
- Be late
- Share interview link with others
- Multitask during interview
- Look away from camera
- Have distractions in background
- Close browser during interview
```

---

## COMPLETE TIMELINE EXAMPLE

```
1:00 PM  → HR receives interview notification
1:05 PM  → HR opens HR Dashboard
1:10 PM  → HR clicks "Start Interview"
1:10:30  → HR's camera activates
1:10:45  → Popup appears with link
1:11:00  → HR copies link to clipboard
1:11:15  → HR sends link to candidate via email
1:11:30  → HR clicks "Continue Interview"
1:11:45  → Candidate receives email
1:15:00  → Candidate clicks link
1:15:15  → Candidate sees role selection
1:15:30  → Candidate clicks "Join as Candidate"
1:15:45  → Waiting screen appears
1:16:00  → Candidate clicks "Join Interview Now"
1:16:15  → Browser requests permissions
1:16:30  → Candidate grants permissions
1:16:45  → Candidate's camera activates
1:17:00  → WebRTC connection established
1:17:15  → Both see each other ✓
1:17:30  → Interview begins

                  45 seconds from candidate joining to interview start
                  12 minutes from HR starting to interview beginning
```

---

## SUCCESS INDICATORS

### When Everything is Working

```
HR Side:
✓ Can see candidate's camera
✓ Candidate sees HR's camera
✓ Audio flows both directions
✓ Scoring panel works
✓ Duration timer running
✓ Connection status: "Connected"
✓ No lag in video

Candidate Side:
✓ Can see HR's camera
✓ HR sees candidate's camera
✓ Audio flows both directions
✓ Interview info visible
✓ Duration timer running
✓ Connection status: "Connected"
✓ No lag in video
```

---

## SUPPORT & HELP

**Issue:**              **Solution:**
No camera permission    → Check browser settings → Allow camera
Can't hear audio        → Check microphone muted → Unmute
Other person can't see  → Check their camera button → Enable video
Connection issues       → Refresh page → Rejoin interview
Waiting screen stuck    → Refresh page → Try again
Browser crashes         → Use different browser → Try again

---

**Last Updated:** January 2, 2026  
**Status:** ✅ Complete  
**Ready:** For Production Use
