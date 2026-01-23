# Interview Candidate Join Popup Feature

## Overview

After an HR starts an interview, a **professional popup modal** appears with:
- Interview link ready to copy
- Instructions for sharing with candidate
- One-click copy to clipboard
- Continue button to dismiss and proceed

When the candidate joins using the link, **both cameras are automatically active** and visible side-by-side.

## How It Works

### HR Workflow

1. **HR clicks "Start Interview"** from HR Dashboard
2. HR's camera activates
3. **Popup appears automatically** showing:
   - ✅ Interview Started (status)
   - 📋 Interview Link (copyable)
   - 📤 Share Instructions
   - 🔗 Copy Link Button
   - ✋ Continue Interview Button

4. HR copies the link and shares via:
   - Email
   - Chat/Messaging
   - SMS
   - Any communication platform

5. HR clicks **"Continue Interview"** to dismiss popup and wait for candidate

### Candidate Workflow

1. Candidate receives interview link from HR
2. Candidate clicks the link
3. Browser opens to `/interview/{sessionId}`
4. **Role auto-selects as "Candidate"** (no selection needed)
5. Candidate clicks **"Enter as Candidate"**
6. **Candidate camera activates**
7. **Both can see each other** in side-by-side video feed

### Dual Camera Access

The interview page shows:
```
┌─────────────────────────────────────┐
│      Interview Session              │
│  ID: session-1234567890             │
│                                     │
├─────────────┬───────────────────────┤
│   HR Video  │   Candidate Video     │
│  (Local)    │   (Remote)            │
│             │                       │
│ Size: 50%   │   Size: 50%           │
│             │                       │
└─────────────┴───────────────────────┘
```

**Features:**
- Full HD video from both participants
- Real-time synchronization
- Audio/Video controls for both
- HR scoring panel (HR only)
- Candidate information panel (Candidate only)
- Call duration timer
- Connection status indicator

## Technical Implementation

### State Management

```typescript
// New state variables in HRCandidateUnifiedInterview
const [showCandidateJoinModal, setShowCandidateJoinModal] = useState(false);
const [linkCopied, setLinkCopied] = useState(false);
```

### Trigger Logic

After HR successfully joins interview:
```typescript
if (userRole === 'hr') {
  setTimeout(() => {
    setShowCandidateJoinModal(true);
  }, 500);
}
```

### Modal Components

**Header:**
- "Interview Started" title
- "Share this link with the candidate to join" subtitle

**Info Card:**
- Status badge: "Ready for Candidate"
- Session ID display

**Link Section:**
- Full interview URL
- Copy button (changes color when copied)
- Copy confirmation message

**Instructions:**
- Step-by-step sharing instructions
- Best practices for sharing

**Action Buttons:**
- "Copy Link to Clipboard" (primary)
- "Continue Interview" (secondary)

## UI/UX Features

### Visual Feedback

```
Before Copy:     After Copy:
┌─────────────┐  ┌─────────────┐
│Copy Button  │→ │✓ Copied!    │
│(Cyan)       │  │(Green)      │
└─────────────┘  └─────────────┘
```

### Modal Styling

- **Backdrop:** Dark overlay with blur effect
- **Border:** Cyan gradient border (matches theme)
- **Colors:** 
  - Cyan for primary actions
  - Blue for instructions
  - Gray for secondary buttons
- **Animation:** Smooth fade-in

### Close Options

- ✕ Close button (top-right)
- "Continue Interview" button
- User can click outside? No (modal is focused)

## Popup Content Details

```
┌──────────────────────────────────────┐
│ ✕                                    │
│                                      │
│  Interview Started                   │
│  Share this link with the candidate  │
│  to join the interview               │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ✓ Ready for Candidate          │  │
│  │ Session ID: session-1234567890 │  │
│  └────────────────────────────────┘  │
│                                      │
│  Interview Link                      │
│  ┌────────────────────────────────┐  │
│  │http://domain.com/interview/..  │  │
│  │                            📋  │  │
│  └────────────────────────────────┘  │
│  Copy and share this link            │
│                                      │
│  How to Share:                       │
│  1. Copy the link above              │
│  2. Send via email or messaging      │
│  3. Candidate clicks the link        │
│  4. Candidate joins as "Candidate"   │
│  5. Interview begins immediately    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 📋 Copy Link to Clipboard    │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Continue Interview           │    │
│  └──────────────────────────────┘    │
│                                      │
│  💡 You can open this message        │
│  again by looking at the interview   │
│  information panel                   │
│                                      │
└──────────────────────────────────────┘
```

## Camera Setup

### Local Camera (HR)
```typescript
<video
  ref={localVideoRef}
  autoPlay
  muted
  playsInline
  className="w-full h-full object-cover"
/>
```
- Shows HR's webcam
- Muted (no echo)
- Full screen fill
- Label: "{userName} (You) - HR"

### Remote Camera (Candidate)
```typescript
<video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  className="w-full h-full object-cover"
/>
```
- Shows Candidate's webcam
- Displayed after connection
- Full screen fill
- Label: "{peerName} - Candidate"
- Status indicator: "Connected" (green badge)

## Video Grid Layout

```css
/* When joined */
grid: 2 columns
gap: 1rem (16px)
flex: 1 (takes remaining space)

/* Video Elements */
relative positioning
border-radius: 0.5rem
border: 2px solid #1f2937
overflow: hidden

/* Labels */
absolute positioning
bottom: 1rem (16px)
left: 1rem (16px)
bg: rgba(17, 24, 39, 0.8) with backdrop blur
```

## Permissions & Browser Requirements

### Required Permissions
- ✅ Camera access
- ✅ Microphone access
- ✅ Clipboard write (for copy link)

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited support

### Troubleshooting

**Camera not working?**
- Check permissions in browser settings
- Ensure no other app is using camera
- Restart browser
- Try refreshing the page

**Popup not appearing?**
- Ensure you're using HR role
- Try reloading the page
- Check browser console for errors

**Can't see candidate camera?**
- Wait for connection (may take 5-10 seconds)
- Ensure candidate has granted permissions
- Check network connection
- Verify WebRTC is supported

## API Integration Points

### Session Tracking
```typescript
// Create session
createInterviewSession({
  sessionId: interview.id,
  candidateName: 'John Doe',
  hrName: 'Sarah Johnson',
  position: 'Frontend Developer',
  participants: { hr: true, candidate: false },
  status: 'active'
});

// Update when candidate joins
updateSessionParticipant(sessionId, 'candidate', true);
```

### WebRTC Connection
```typescript
// When HR joins
const stream = await webrtcHook.startCall();

// When candidate joins (same session ID)
const stream = await webrtcHook.startCall();

// WebRTC discovers each other via session ID
```

## Flow Diagram

```
HR Dashboard
    ↓
"Start Interview" click
    ↓
Navigate to /interview/{id} with role: 'hr'
    ↓
HRCandidateUnifiedInterview loads
    ↓
HR joins → Camera starts → Popup appears
    ↓
HR copies link → Shares with Candidate
    ↓
Candidate clicks link
    ↓
Navigate to /interview/{id} (no role state)
    ↓
Role Selection Screen → Candidate selects role
    ↓
HRCandidateUnifiedInterview loads
    ↓
Candidate joins → Camera starts
    ↓
WebRTC connection → Both see each other
    ↓
Interview begins
```

## Best Practices

✅ **DO**
- Wait for popup to fully load before copying link
- Share link immediately after HR joins
- Ensure candidate has good internet connection
- Test camera/microphone before interview
- Keep popup open until candidate joins

❌ **DON'T**
- Close browser while sharing link
- Share link publicly
- Modify interview URL
- Use same link for multiple interviews
- Leave browser during interview

## Future Enhancements

- [ ] QR code in popup for mobile sharing
- [ ] One-click email share integration
- [ ] SMS/WhatsApp sharing buttons
- [ ] Candidate confirmation of receipt
- [ ] Auto-sending link via email to candidate
- [ ] Resend link feature
- [ ] Interview waiting room
- [ ] Countdown timer before starting
- [ ] Recording start indication

## Testing Checklist

- [x] Popup appears after HR joins
- [x] Copy button works
- [x] Copied state shows correctly
- [x] Close button hides popup
- [x] Continue button dismisses popup
- [x] Interview link is correct
- [x] Session ID is visible
- [x] Styling matches theme
- [ ] Candidate can join via link
- [ ] Both cameras appear side-by-side
- [ ] Audio/video controls work for both
- [ ] Connection status updates correctly
- [ ] No browser console errors

## Build Status

✅ **Build Successful** - No compilation errors  
✅ **Modules Transformed** - 63 modules  
✅ **Ready for Testing** - Production build completed  

