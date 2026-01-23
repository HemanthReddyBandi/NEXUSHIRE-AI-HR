# HR Live Interview - Unified Conference Page

## Overview
A complete single-screen video conferencing solution where both HR and Candidates can join an interview session together. Includes real-time video feed, audio/video controls, and HR-side scoring interface.

## Components

### 1. **InterviewLiveConferencePage.tsx**
The landing/setup page where users select their role (HR or Candidate).

**Features:**
- Role selection interface (HR or Candidate)
- Interview information display
- Session ID generation
- User name input for joining
- Pre-interview checklist

**Usage:**
```tsx
import InterviewLiveConferencePage from '@/components/InterviewLiveConferencePage';

export default function Page() {
  return <InterviewLiveConferencePage sessionId="interview-123" />;
}
```

### 2. **HRCandidateUnifiedInterview.tsx**
The main video conference component showing both participants.

**Props:**
```typescript
interface UnifiedInterviewProps {
  sessionId: string;           // Unique session identifier
  userRole: 'hr' | 'candidate'; // Role of current user
  userName: string;             // Display name of current user
  peerName?: string;            // Display name of other participant
  onInterviewEnd?: () => void;  // Callback when interview ends
}
```

**Features:**
- Two-panel video layout (local & remote video)
- Audio/Video controls (toggle mute/video)
- Join Interview button with full WebRTC initialization
- Call duration timer
- HR Scoring Panel (visible only to HR users)
- Connection status monitoring
- Fullscreen mode
- Settings menu

## How It Works

### 1. **Role Selection Flow**
```
User visits page
    ↓
InterviewLiveConferencePage shows role selection
    ↓
User selects HR or Candidate
    ↓
HRCandidateUnifiedInterview loads with selected role
```

### 2. **Video Conference Initialization**
```
User clicks "Join Interview"
    ↓
getUserMedia() requests camera/microphone permissions
    ↓
Local video stream displayed in left panel
    ↓
WebRTC peer connection established (via signaling server)
    ↓
Remote video displayed in right panel
    ↓
Call duration timer starts
```

### 3. **HR Scoring (HR Only)**
```
During interview, HR sees scoring panel:
  - Confidence (30% weight)
  - Technical (40% weight)
  - Communication (30% weight)
    ↓
Overall score calculated in real-time:
  Overall = (Conf × 0.3) + (Tech × 0.4) + (Comm × 0.3)
    ↓
Color-coded feedback:
  - Green (80+): Excellent
  - Yellow (60-79): Good
  - Orange (40-59): Fair
  - Red (<40): Needs Improvement
```

### 4. **Candidate Info (Candidate Only)**
```
During interview, candidate sees:
  - Interviewer name
  - Position details
  - Interview type
  - Current duration
  - Interview tips
```

## Integration Points

### Backend Requirements
The frontend is ready for backend integration at these endpoints:

1. **Session Creation**
   ```
   POST /api/interviews/create
   Body: {
     candidateId: string,
     hrId: string,
     position: string,
     scheduledTime: ISO8601
   }
   Response: { sessionId: string }
   ```

2. **WebRTC Signaling** (WebSocket)
   ```
   Events:
   - offer: { type: 'offer', sdp: string, from: string }
   - answer: { type: 'answer', sdp: string, from: string }
   - ice-candidate: { type: 'ice-candidate', candidate: RTCIceCandidate, from: string }
   ```

3. **Score Submission**
   ```
   POST /api/interviews/{sessionId}/scores
   Body: {
     confidence: number (0-100),
     technical: number (0-100),
     communication: number (0-100),
     feedback: {
       confidence: string,
       technical: string,
       communication: string
     }
   }
   ```

4. **Interview History**
   ```
   GET /api/interviews/{userId}
   GET /api/interviews/{sessionId}/details
   GET /api/interviews/{sessionId}/result
   ```

## Component Breakdown

### Video Section
- **Local Video**: HR/Candidate's own camera feed (left panel)
- **Remote Video**: Connected participant's feed (right panel)
- Participant labels with role indicators
- Connection status badges
- Camera off indicator when video is disabled

### Controls Section
- **Join Interview Button**: Starts WebRTC connection and media capture
- **Mute/Unmute Button**: Toggles audio track
- **Stop/Start Video Button**: Toggles video track
- **End Call Button**: Ends session and cleans up resources

### Sidebar (HR Mode)
- **Confidence Slider**: 0-100 scale with feedback textarea
- **Technical Slider**: 0-100 scale with feedback textarea
- **Communication Slider**: 0-100 scale with feedback textarea
- **Overall Score**: Real-time weighted calculation
- Color-coded visual feedback

### Sidebar (Candidate Mode)
- Interviewer information
- Position details
- Interview type
- Duration counter
- Interview tips checklist

## Styling

Uses **Tailwind CSS** with dark theme:
- **Primary Colors**: Cyan (HR), Purple (Candidate feedback)
- **Alert Colors**: Green (Connected), Red (Error), Yellow (Warning)
- **Background**: Gray-950 (darkest), Gray-900, Gray-800
- **Responsive**: Mobile-first design, optimized for desktop with 2-column layout

## State Management

### Interview State
```typescript
- isJoined: boolean (user clicked join)
- isCallActive: boolean (WebRTC connected)
- callDuration: number (seconds elapsed)
- mediaSettings: { audioEnabled, videoEnabled, screenShareEnabled }
```

### WebRTC State (via useWebRTC hook)
```typescript
- localStream: MediaStream
- remoteStream: MediaStream
- isConnected: boolean
- isLoading: boolean
- connectionState: RTCIceConnectionState
```

### Scoring State (HR only)
```typescript
- scores: { confidence, technical, communication }
- feedback: { confidence, technical, communication }
- overallScore: number (calculated)
```

## Key Features

✅ **Real-time Video**: Two-way video using WebRTC  
✅ **Audio/Video Controls**: Toggle mic/camera independently  
✅ **Live Scoring**: HR scores candidate during interview  
✅ **Connection Monitoring**: Visual status indicators  
✅ **Responsive Design**: Works on desktop, tablet, mobile  
✅ **Role-Based UI**: Different interface for HR vs Candidate  
✅ **Call Timer**: Tracks interview duration  
✅ **Fullscreen Mode**: Toggle fullscreen for better viewing  
✅ **Error Handling**: Graceful error messages and recovery  
✅ **Type Safety**: Full TypeScript support  

## Usage Example

```tsx
// In your routing or page component
import InterviewLiveConferencePage from '@/components/InterviewLiveConferencePage';

export default function InterviewPage() {
  return (
    <InterviewLiveConferencePage 
      sessionId="interview-session-12345"
    />
  );
}
```

Or with Next.js App Router:

```tsx
// app/interview/[sessionId]/page.tsx
'use client';

import InterviewLiveConferencePage from '@/components/InterviewLiveConferencePage';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  
  return (
    <InterviewLiveConferencePage 
      sessionId={params.sessionId as string}
    />
  );
}
```

## WebRTC Integration

The component uses the existing `useWebRTC` hook which requires:

1. **Signaling Server**: Must exchange offer/answer SDP
2. **ICE Candidates**: Must relay ICE candidates between peers
3. **Session Management**: Track session lifecycle

Example signaling flow:
```
HR Browser          Signaling Server        Candidate Browser
     │                    │                        │
     ├──→ offer SDP ──→ │                        │
     │                    ├─→ offer SDP ────→ │
     │                    │ ←──── answer SDP ─┤
     │ ←── answer SDP ──┤                        │
     │                    │                        │
     ├──→ ICE candidate → │                        │
     │                    ├─→ ICE candidate ──→ │
     │                    │ ←──── ICE candidate ─┤
     │ ←── ICE candidate ┤                        │
     │                    │                        │
```

## Performance Considerations

- **Video Resolution**: Uses browser defaults (usually 720p or 1080p)
- **Bitrate**: WebRTC adapts based on network conditions
- **Latency**: P2P connection = ~30-50ms (depends on network)
- **Bundle Size**: ~730KB uncompressed, ~167KB gzipped
- **Memory**: ~100-200MB per video stream (depending on resolution)

## Browser Support

✅ Chrome/Chromium 74+  
✅ Firefox 60+  
✅ Safari 14.1+  
✅ Edge 79+  

**Note**: HTTPS required for WebRTC in production

## Security Considerations

- HTTPS enforced for production (required for getUserMedia)
- CORS configured for WebRTC signaling
- Session IDs should be cryptographically random
- Authentication tokens for API endpoints
- Encrypted WebRTC connections (DTLS-SRTP by default)

## Troubleshooting

### Camera/Microphone Not Working
1. Check browser permissions
2. Verify device is connected and not in use
3. Try different browser or device
4. Check for permission prompts

### No Remote Video
1. Verify signaling server is running
2. Check WebRTC console logs for connection errors
3. Ensure both users have internet connectivity
4. Verify firewall/NAT settings allow P2P connections

### Audio Issues
1. Check speaker/microphone levels
2. Verify audio isn't muted in browser
3. Try different audio input/output devices

## Future Enhancements

- Screen sharing capability
- Chat messaging during interview
- Whiteboard/code collaboration
- Interview recording (backend)
- Automatic candidate notifications
- Interview rescheduling
- Performance analytics dashboard
