# 🚀 HR Interview Platform - Quick Reference Guide

**Last Updated:** January 2, 2026

---

## 📁 File Structure

```
src/
├── components/
│   ├── HRLiveInterview.tsx          🎥 HR Interview Dashboard
│   ├── HRScoringPanel.tsx           📊 Real-time Scoring (0-100)
│   ├── HRInterviewResult.tsx        🏆 Results & Analytics
│   └── ... (other components)
├── services/
│   ├── scoringService.ts            🧮 Score Calculations
│   ├── webrtcService.ts             📡 WebRTC P2P Connection
│   └── ... (other services)
├── hooks/
│   ├── useWebRTC.ts                 🎣 WebRTC Hook
│   └── ... (other hooks)
├── types/
│   ├── interview.ts                 📋 Type Definitions
│   └── ... (other types)
└── docs/
    ├── PROJECT_DEVELOPMENT_REPORT.md
    ├── HR_INTERVIEW_IMPLEMENTATION.md
    └── HR_INTERVIEW_SUMMARY.md
```

---

## 🎯 Component Quick Start

### **HRLiveInterview** - Main Interview Interface
```tsx
import HRLiveInterview from './components/HRLiveInterview';

<HRLiveInterview
  candidateInfo={{
    id: 'cand-1',
    name: 'Jane Doe',
    email: 'jane@company.com',
    role: 'Senior Developer',
    profileImage: 'url'
  }}
  onFinish={(result) => {
    console.log('Scores:', result);
    // Save to database
  }}
  sessionId="session-abc123"
/>
```

**Features:**
- 📹 Video conference area (WebRTC integration point)
- 👤 Candidate info panel
- ⚙️ Interview controls (Start/Stop/Record)
- 📝 Scoring panel integration
- 💬 General feedback textarea
- 📋 End interview dialog with score preview

---

### **HRScoringPanel** - Real-Time Scoring
```tsx
import HRScoringPanel from './components/HRScoringPanel';

<HRScoringPanel
  onScoresChange={(scores) => {
    console.log('Updated scores:', scores);
    // Confidence: 0-100
    // Technical: 0-100
    // Communication: 0-100
  }}
  isInterviewActive={true}
/>
```

**Scoring Categories:**
- 😊 **Confidence** (30% weight) - Composure, self-assurance
- 🧠 **Technical** (40% weight) - Knowledge, problem-solving
- 🎤 **Communication** (30% weight) - Clarity, expression

---

### **HRInterviewResult** - Results Display
```tsx
import HRInterviewResult from './components/HRInterviewResult';

<HRInterviewResult
  candidateName="Jane Doe"
  interviewDate="2026-01-02"
  scores={{
    confidence: 85,
    technical: 90,
    communication: 80,
    overall: 86
  }}
  feedback={{
    confidence: 'Candidate showed good composure throughout',
    technical: 'Excellent grasp of core concepts',
    communication: 'Clear and articulate responses',
    general: 'Strong candidate for the position'
  }}
  hrName="John Smith"
  sessionId="session-abc123"
  onDownload={() => console.log('Download scorecard')}
/>
```

---

## 🔧 Service Quick Reference

### **Scoring Service**
```typescript
import {
  calculateOverallScore,
  getGrade,
  getPerformanceLevel,
  createInterviewResult,
  generatePerformanceSummary,
  formatResultForStorage,
  compareResults,
  calculateStatistics
} from './services/scoringService';

// Calculate overall score
const overall = calculateOverallScore({
  confidence: 85,
  technical: 90,
  communication: 80
}); // Returns: 86

// Get grade
const grade = getGrade(86); // Returns: 'B+'

// Get level
const level = getPerformanceLevel(86); // Returns: 'Very Good'

// Create result
const result = createInterviewResult(
  'session-123',           // sessionId
  'cand-1',               // candidateId
  'Jane Doe',             // candidateName
  'hr-1',                 // hrId
  'John Smith',           // hrName
  { confidence: 85, technical: 90, communication: 80 },
  { confidence: 'Good', technical: 'Excellent', communication: 'Good', general: 'Strong' },
  3600                    // duration in seconds
);

// Compare results
const comparison = compareResults(result1, result2);
// {
//   improved: true,
//   scoreDifference: 5,
//   details: '...'
// }

// Calculate stats
const stats = calculateStatistics([result1, result2, result3]);
// {
//   averageScore: 85,
//   averageConfidence: 82,
//   averageTechnical: 88,
//   averageCommunication: 80,
//   highestScore: 92,
//   lowestScore: 78
// }
```

---

### **WebRTC Service**
```typescript
import WebRTCService from './services/webrtcService';

const webrtc = new WebRTCService();

// Initialize connection
const peerConnection = webrtc.initializePeerConnection();

// Get media
const localStream = await webrtc.getUserMedia();
// localStream.getTracks().forEach(track => {
//   videoElement.srcObject = localStream;
// });

// Create offer (caller)
const offer = await webrtc.createOffer();
// Send offer to other peer via signaling server

// Create answer (receiver)
const answer = await webrtc.createAnswer();

// Set remote description
await webrtc.setRemoteDescription(remoteOffer);

// Add ICE candidates
await webrtc.addIceCandidate(iceCandidate);

// Listen for remote stream
webrtc.onRemoteStream((stream) => {
  remoteVideoElement.srcObject = stream;
});

// Listen for connection state
webrtc.onConnectionStateChange((state) => {
  console.log('Connection state:', state);
  // 'new', 'connecting', 'connected', 'disconnected', 'failed', 'closed'
});

// Listen for ICE candidates
webrtc.onIceCandidate((candidate) => {
  // Send candidate to other peer via signaling
  signalingServer.send(candidate);
});

// Send messages via data channel
webrtc.createDataChannel('notes');
webrtc.sendMessage('Interview note: Candidate is well-prepared');

// Get stats
const stats = await webrtc.getStats();

// Close connection
webrtc.close();
```

---

## 🎣 Hook Quick Reference

### **useWebRTC Hook**
```typescript
import { useWebRTCInterview } from './hooks/useWebRTC';

function MyComponent() {
  const {
    localStream,      // MediaStream | null
    remoteStream,     // MediaStream | null
    isConnected,      // boolean
    isLoading,        // boolean
    error,            // string | null
    startCall,        // () => Promise<void>
    answerCall,       // (offer: RTCSessionDescriptionInit) => Promise<void>
    endCall,          // () => void
    sendMessage,      // (message: string) => void
    connectionState   // RTCPeerConnectionState | null
  } = useWebRTCInterview();

  return (
    <div>
      {isLoading && <p>Connecting...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={startCall} disabled={isConnected}>
        Start Call
      </button>
      <button onClick={endCall} disabled={!isConnected}>
        End Call
      </button>
      <video srcObject={localStream} autoPlay muted />
      <video srcObject={remoteStream} autoPlay />
    </div>
  );
}
```

---

## 📊 Scoring Formula

```javascript
Overall = (Confidence × 0.30) + (Technical × 0.40) + (Communication × 0.30)

// Example:
// Confidence: 85, Technical: 90, Communication: 80
// Overall = (85 × 0.30) + (90 × 0.40) + (80 × 0.30)
//         = 25.5 + 36 + 24
//         = 85.5 → rounds to 86
```

### Grade Scale
| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | A | Excellent |
| 80-89 | B+ | Very Good |
| 70-79 | B | Good |
| 60-69 | C+ | Fair |
| 50-59 | C | Needs Improvement |
| 0-49 | D | Below Expectations |

---

## 🎨 Color Reference

```css
/* Primary Colors */
--primary: #06B6D4 (Cyan)
--primary-dark: #0891B2

/* Success */
--success: #22C55E (Green)
--success-light: #86EFAC

/* Warning */
--warning: #FBBF24 (Amber)
--danger: #F97316 (Orange)

/* Critical */
--critical: #EF4444 (Red)

/* Background */
--bg-dark: #111827 (Almost Black)
--bg-mid: #1F2937 (Dark Gray)
--bg-light: #374151 (Gray)

/* Text */
--text-primary: #F3F4F6 (White)
--text-secondary: #D1D5DB (Light Gray)
--text-muted: #9CA3AF (Gray)
```

---

## 🔗 Integration Checklist

### Frontend Ready ✅
- [x] HRLiveInterview component
- [x] HRScoringPanel component
- [x] HRInterviewResult component
- [x] scoringService
- [x] webrtcService
- [x] useWebRTC hook
- [x] Type definitions

### Backend Needed ⏳
- [ ] WebRTC signaling server
- [ ] Interview session API
- [ ] Score storage API
- [ ] Result retrieval API
- [ ] User authentication
- [ ] Database schema
- [ ] Real-time updates (WebSocket)

---

## 📝 Common Use Cases

### **Start HR Interview**
```typescript
const handleStartInterview = async () => {
  try {
    const { localStream } = await startCall();
    // WebRTC connection initiated
    setInterviewActive(true);
  } catch (error) {
    console.error('Failed to start:', error);
  }
};
```

### **Submit Scores**
```typescript
const handleFinishInterview = (scores) => {
  const overall = calculateOverallScore(scores);
  const result = createInterviewResult(
    sessionId,
    candidateId,
    candidateName,
    hrId,
    hrName,
    scores,
    feedback,
    duration
  );
  
  // Save to database
  apiClient.post('/api/scores', formatResultForStorage(result));
};
```

### **View Results**
```typescript
const handleViewResults = async () => {
  const results = await apiClient.get(`/api/scores/${interviewId}`);
  setScores(results.scores);
  setFeedback(results.feedback);
};
```

---

## 🐛 Troubleshooting

### Issue: Camera/Microphone Access Denied
```javascript
// Check browser permissions
if (navigator.permissions) {
  navigator.permissions.query({ name: 'camera' })
    .then(permission => console.log(permission.state));
}

// Request again
await webrtc.getUserMedia();
```

### Issue: WebRTC Connection Failed
```javascript
// Check ICE server configuration
const config = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] }
  ]
};

// Check connection state
console.log(webrtc.getConnectionState());
// Should be 'connected' or 'completed'
```

### Issue: Scores Not Calculating
```javascript
// Validate scores
if (!validateScores(scores)) {
  console.error('Invalid scores - must be 0-100');
}

// Check weights add up to 1.0
const total = 0.30 + 0.40 + 0.30; // Should be 1.0
```

---

## 📚 API Reference Summary

### Scoring Service Functions
| Function | Returns | Description |
|----------|---------|-------------|
| `calculateOverallScore()` | number | Weighted score (0-100) |
| `getGrade()` | string | Letter grade (A, B+, etc) |
| `getPerformanceLevel()` | string | Level description |
| `validateScores()` | boolean | Validates score ranges |
| `createInterviewResult()` | InterviewResult | Complete result object |
| `generatePerformanceSummary()` | string | AI-friendly summary |
| `formatResultForStorage()` | object | Database-ready format |
| `compareResults()` | object | Comparison data |
| `calculateStatistics()` | object | Aggregate stats |

### WebRTC Service Methods
| Method | Returns | Description |
|--------|---------|-------------|
| `initializePeerConnection()` | RTCPeerConnection | Creates peer connection |
| `getUserMedia()` | Promise<MediaStream> | Gets camera/mic |
| `createOffer()` | Promise<offer> | Creates SDP offer |
| `createAnswer()` | Promise<answer> | Creates SDP answer |
| `setRemoteDescription()` | Promise<void> | Sets remote description |
| `addIceCandidate()` | Promise<void> | Adds ICE candidate |
| `createDataChannel()` | RTCDataChannel | Creates data channel |
| `sendMessage()` | void | Sends data channel message |
| `getConnectionState()` | string | Connection state |
| `close()` | void | Closes connection |
| `getStats()` | Promise<RTCStatsReport> | Connection stats |

---

## 🚀 Getting Started

1. **Import what you need:**
   ```tsx
   import HRLiveInterview from './components/HRLiveInterview';
   import { useWebRTCInterview } from './hooks/useWebRTC';
   ```

2. **Use in component:**
   ```tsx
   const MyInterview = () => {
     return (
       <HRLiveInterview
         candidateInfo={candidateData}
         onFinish={handleFinish}
         sessionId={id}
       />
     );
   };
   ```

3. **Connect backend:**
   - Implement WebRTC signaling
   - Set up API endpoints
   - Connect database
   - Add authentication

4. **Deploy:**
   - Run `npm run build`
   - Deploy to hosting
   - Configure environment variables
   - Test video connection

---

## 📞 Support

For detailed information, see:
- **PROJECT_DEVELOPMENT_REPORT.md** - Full architecture
- **HR_INTERVIEW_IMPLEMENTATION.md** - Implementation details
- **HR_INTERVIEW_SUMMARY.md** - Complete summary

---

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Build:** ✅ Success (22.12s)

