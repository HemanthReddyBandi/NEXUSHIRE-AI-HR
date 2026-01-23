# How to Use the Dual Camera Interview Feature

## Quick Start

### For HR:
1. Go to HR Dashboard
2. Click "Start Interview"
3. See popup with shareable link
4. Copy link and send to candidate
5. Both cameras appear side-by-side once candidate joins

### For Candidate:
1. Open the interview link
2. Select "Join as Candidate"
3. Click "Join Interview Now"
4. Grant camera/microphone permissions
5. See both cameras side-by-side with HR

---

## Complete Step-by-Step Guide

### HR Process

#### Step 1: Open HR Dashboard
```
Navigate to: http://localhost:3000/hr-dashboard
OR from home screen → Click "HR Dashboard" button
```

#### Step 2: Start Interview
```
1. Find the candidate in the interview list
2. Click "Start Interview" button
3. Camera permission popup appears
4. Click "Allow" to grant camera access
```

#### Step 3: See Your Camera
```
Your camera feed should appear:
- Shows live video from your camera
- Green microphone indicator at top-right
- Your name and "HR" label at bottom-left
- Single column layout (waiting for candidate)
```

#### Step 4: See the Popup Modal
```
After camera activates:
- Popup appears with shareable link
- Shows interview session ID
- "Copy Link to Clipboard" button
- "Continue Interview" button to close
```

#### Step 5: Copy and Share Link
```
1. Click "Copy Link to Clipboard"
2. See confirmation that link was copied
3. Open your messaging app/email
4. Paste and send link to candidate
```

#### Step 6: Wait for Candidate
```
- Keep this window open
- Remote camera area shows "Waiting to join..."
- Once candidate joins:
  - Remote area switches to 2-column layout
  - Candidate's camera appears on the right
  - Status changes to "✓ Connected"
```

#### Step 7: Interview Active
```
Both cameras now visible:
- Left: Your camera (HR)
- Right: Candidate's camera
- Both audio/video enabled
- Scoring panel on right side
- Can rate candidate as you interview
```

#### Step 8: End Interview
```
1. Click "End Call" button
2. Both cameras stop streaming
3. Session ends and recordings/scores saved
4. Can return to dashboard
```

---

### Candidate Process

#### Step 1: Receive Interview Link
```
You receive a link that looks like:
http://localhost:3000/interview/2
```

#### Step 2: Open the Link
```
1. Click the link
2. Page loads
3. You see "Select Your Role" or go directly to join screen
```

#### Step 3: Select "Join as Candidate"
```
- If prompted for role, click "Candidate"
- OR system auto-selects candidate role
```

#### Step 4: See "Waiting for HR" Screen
```
You see:
- Animated clock icon with spinning rings
- "Waiting for HR" message
- Bouncing status dots
- Session ID displayed
- Instructions: What will happen next
- "Join Interview Now" button
```

#### Step 5: Click "Join Interview Now"
```
1. Click the button
2. Camera/microphone permissions requested
3. Click "Allow" to grant permissions
4. Waiting screen closes
```

#### Step 6: Your Camera Activates
```
- Your camera feed appears on LEFT side
- Shows live video from your camera
- Green microphone indicator
- Your name and "CANDIDATE" label
- Right side initially shows "Waiting to join..."
```

#### Step 7: HR's Camera Appears
```
Once HR camera stream arrives:
- Right side changes to show video
- HR's name and "HR" label visible
- Green microphone indicator
- "✓ Connected" status badge appears
- Both cameras fully visible side-by-side
```

#### Step 8: Interview Begins
```
- You can see HR on screen
- HR can see you
- Audio works both ways
- Can mute/unmute or stop video
- HR may take notes/score
```

#### Step 9: Interview Ends
```
When HR clicks "End Call":
- Your video stream stops
- You're taken back to dashboard
- Interview results/feedback shown
```

---

## What Each Camera Shows

### Your Camera (Local)
**Left side:**
- Your live video feed
- Your name with "(You)" suffix
- Your role: "HR" or "CANDIDATE"
- Microphone status indicator (green = on, red = off)
- Always muted (no audio feedback)

### Other Person's Camera (Remote)
**Right side (after they join):**
- Their live video feed
- Their name
- Their role: "HR" or "CANDIDATE"
- Microphone status indicator
- Connection status "✓ Connected"

---

## Controls Available

### Audio Control
```
[Mute] button
- Click to mute your microphone (turns button red)
- Click again to unmute
- Red "Muted" button indicates current state
```

### Video Control
```
[Stop Video] button
- Click to turn off your camera (turns button red)
- You see "Camera Off" placeholder
- Click to restart camera
```

### End Interview
```
[End Call] button
- Ends the interview session for both participants
- Both cameras stop streaming
- Takes you back to dashboard
```

### Settings
```
⚙️ (gear icon)
- Opens settings menu for audio/video options
- Can test camera/microphone
```

### Fullscreen
```
⛶ (maximize icon)
- Enters fullscreen mode
- Makes interview take full screen
- Click again to exit fullscreen
```

---

## What's Happening Behind the Scenes

### Connection Steps:

```
1. HR Joins
   ✓ Camera activated
   ✓ Local stream created
   ✓ WebRTC peer created
   ✓ Modal appears with link

2. Candidate Opens Link
   ✓ Page loads
   ✓ Candidate role detected
   ✓ Waiting screen shown
   ✓ Session ID matched

3. Candidate Clicks "Join Now"
   ✓ Waiting screen closes
   ✓ Candidate camera activates
   ✓ Candidate's stream created
   ✓ WebRTC connection initiated
   ✓ 2-column layout activates

4. Streams Exchange
   ✓ HR receives candidate's stream
   ✓ Candidate receives HR's stream
   ✓ Connection established
   ✓ Both cameras visible
   ✓ Audio channels opened
   ✓ "Connected" badge shown
```

---

## Troubleshooting

### Problem: Camera Not Showing
**Solution:**
1. Check camera permissions granted
2. Look for browser permission popup
3. Click "Allow" if you see it
4. Close and retry page

### Problem: Only See Your Camera
**Solution:**
1. Wait 5-10 seconds for connection
2. Check other person joined (they should see waiting screen)
3. Verify they clicked "Join Interview Now"
4. Refresh page if stuck on "Waiting to join..."

### Problem: No Audio
**Solution:**
1. Check microphone permissions granted
2. Ensure speakers/headphones connected
3. Test microphone on your computer
4. Restart browser tab

### Problem: Other Person Can't See You
**Solution:**
1. Check your camera is working
2. Verify [Stop Video] button isn't red
3. Check internet connection
4. Try refreshing page

### Problem: Lag or Freezing
**Solution:**
1. Close other apps using internet
2. Move closer to router
3. Check internet speed (need 2+ Mbps)
4. Refresh page and retry

### Problem: Browser Shows Permission Error
**Solution:**
1. Check address bar for permission requests
2. Click camera/microphone icons
3. Select "Allow" instead of "Block"
4. Reload page after granting permission

---

## Interview Scoring (HR Only)

The HR can score the candidate while viewing:

### Three Scoring Categories:

**1. Confidence (30% weight)**
- Slider from 0-100
- Text field for feedback
- Color-coded score display

**2. Technical Knowledge (40% weight)**
- Slider from 0-100
- Text field for feedback
- Color-coded score display

**3. Communication (30% weight)**
- Slider from 0-100
- Text field for feedback
- Color-coded score display

### Overall Score Calculation:
```
Overall = (Confidence × 0.30) + (Technical × 0.40) + (Communication × 0.30)
```

**Score Breakdown:**
- 80-100: Green (Excellent)
- 60-79: Yellow (Good)
- 40-59: Orange (Fair)
- 0-39: Red (Poor)

---

## Video Quality Tips

### For Best Results:

1. **Lighting**
   - Face light source (window or lamp)
   - Avoid backlighting
   - No harsh shadows

2. **Background**
   - Clean, professional background
   - Neutral colors preferred
   - No distracting movement

3. **Camera Angle**
   - Camera at eye level
   - About 12-18 inches away
   - Slightly above horizontal

4. **Internet**
   - Stable WiFi or wired connection
   - 2+ Mbps upload/download speed
   - Close to router if possible

5. **Audio**
   - Quiet environment
   - Microphone near mouth (not touching)
   - No background noise

6. **Appearance**
   - Professional clothing
   - Well-groomed
   - Appropriate for company culture

---

## Session Information Display

### Interview Header Shows:
```
Interview Session          [Settings] [Fullscreen]
ID: 2
🟢 Duration: 15:30 (when active)
```

### Participant Labels Show:
```
Local (Left):              Remote (Right):
[Your Name] (You)          [Their Name]
HR / CANDIDATE role        HR / CANDIDATE role
```

### Connection Indicators:
```
✓ Connected  (green badge - when remote is online)
🎤 (green) - Microphone on
🎤 (red)   - Microphone off
```

---

## Security & Privacy

✅ **Encrypted Connections** - All video/audio encrypted
✅ **Session IDs** - Unique per interview
✅ **Permissions Required** - Must approve camera/microphone
✅ **No Recording** (unless enabled) - Videos don't auto-save
✅ **Local Processing** - Video processing happens on your device
✅ **Peer-to-Peer** - Direct connection between participants

---

## Expected Performance

### Video Quality:
- 720p (HD) at 30fps typical
- May reduce on slower connections
- Auto-adjusts for network conditions

### Latency:
- 100-300ms typical delay
- Normal for video conferencing
- Should not be noticeable in conversation

### Browser Support:
- ✅ Chrome/Chromium (88+)
- ✅ Firefox (90+)
- ✅ Safari (15+)
- ✅ Edge (88+)

---

## Frequently Asked Questions

**Q: Can I use mobile for interviews?**
A: Yes, but desktop is recommended for better visibility

**Q: Can I see recorded video?**
A: Depends on system settings - contact HR

**Q: What if connection drops?**
A: Refresh page and rejoin - previous scoring is saved

**Q: Can multiple candidates interview at once?**
A: No, 1-on-1 interviews only (design requirement)

**Q: Where do I access interview results?**
A: Dashboard shows results after interview ends

**Q: Can I test my camera before starting?**
A: Yes, click Settings ⚙️ to test first

---

## Key Differences from Previous Version

### Before This Update:
- Only one camera visible at a time
- Had to switch between cameras
- Candidate couldn't see HR during interview
- Separate UI for each participant

### After This Update:
- ✅ Both cameras visible simultaneously
- ✅ Side-by-side grid layout
- ✅ Full dual-access experience
- ✅ Real-time connection status
- ✅ Professional video conference setup
- ✅ Scoring available during interview
- ✅ Smooth transition from waiting to active

---

## Quick Reference Card

```
╔════════════════════════════════════════════╗
║        DUAL CAMERA INTERVIEW GUIDE         ║
╠════════════════════════════════════════════╣
║ HR: Start Interview → See camera → Modal   ║
║ HR: Copy link → Share with candidate       ║
║ Candidate: Open link → Waiting screen      ║
║ Candidate: Click "Join Now" → Camera on    ║
║ Both: See 2-column grid, left/right camera ║
║ Both: Mute/Video/End controls available    ║
║ HR: Score candidate with 3 categories      ║
╠════════════════════════════════════════════╣
║ Layout: 50% | 50% grid with 16px gap      ║
║ Status: Green = Online, "Waiting..." = no  ║
║ Audio: Green mic = on, Red = muted         ║
║ End: Both can click "End Call" to exit     ║
╚════════════════════════════════════════════╝
```

---

## Support

For technical issues:
1. Check browser console (F12) for errors
2. Verify camera/microphone permissions
3. Try refreshing the page
4. Test on different browser if available
5. Check internet connection

---

**Version 1.0** - Dual Camera Interview Feature
Last Updated: January 2, 2026
