# HR Interview Platform - Architecture & Data Flow Diagrams

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HR Interview Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Frontend (React)                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────────┐  ┌──────────────────────────┐   │  │
│  │  │  HRLiveInterview   │  │  HRScoringPanel         │   │  │
│  │  │  ├─ Video Feed     │  │  ├─ Confidence Score    │   │  │
│  │  │  ├─ Candidate Info │  │  ├─ Technical Score     │   │  │
│  │  │  ├─ Controls       │  │  ├─ Communication Score │   │  │
│  │  │  └─ Feedback       │  │  └─ Overall Calc        │   │  │
│  │  └────────────────────┘  └──────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  HRInterviewResult                                 │  │  │
│  │  │  ├─ Score Display                                  │  │  │
│  │  │  ├─ Grade Assignment                               │  │  │
│  │  │  ├─ Feedback Summary                               │  │  │
│  │  │  └─ Analytics Charts                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
│                           ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Custom Hooks                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  useWebRTC                                         │  │  │
│  │  │  ├─ LocalStream  ──────────────┐                  │  │  │
│  │  │  ├─ RemoteStream ──────────────┤                  │  │  │
│  │  │  ├─ isConnected  ──────────────┤                  │  │  │
│  │  │  └─ startCall()  ──────────────┤                  │  │  │
│  │  └────────────────────────────────┘                  │  │  │
│  │                                                       │  │  │
│  └──────────────────────────────────────────────────────┘  │  │
│                           │                                    │
│                           ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Services                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌──────────────────┐    ┌──────────────────────────┐   │  │
│  │  │ scoringService   │    │ webrtcService            │   │  │
│  │  │                  │    │                          │   │  │
│  │  │ • Calculate      │    │ • Peer Connection        │   │  │
│  │  │   Overall Score  │    │ • Media Streams          │   │  │
│  │  │ • Get Grade      │    │ • ICE Candidates         │   │  │
│  │  │ • Validate       │    │ • Data Channel           │   │  │
│  │  │ • Compare        │    │ • Connection State       │   │  │
│  │  │ • Statistics     │    │ • Signal Handling        │   │  │
│  │  │                  │    │                          │   │  │
│  │  └──────────────────┘    └──────────────────────────┘   │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
│                           ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Type System (TypeScript)                    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • ScoreData          • InterviewSession                 │  │
│  │  • InterviewResult    • CandidateProfile                 │  │
│  │  • FeedbackData       • WebRTCStats                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│                           │                                    │
│                           ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              WebRTC (Browser API)                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • getUserMedia()     • RTCPeerConnection                │  │
│  │  • MediaStream        • ICE Candidates                   │  │
│  │  • RTCDataChannel     • Signaling                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
         (Requires Backend) │
                            ↓
        ┌───────────────────────────────────┐
        │    Signaling Server               │
        │  (WebSocket/Socket.io)            │
        │  ├─ Offer/Answer Exchange         │
        │  ├─ ICE Candidate Exchange        │
        │  └─ Session Management            │
        └───────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ↓                  ↓                  ↓
    ┌─────────┐        ┌─────────┐       ┌─────────┐
    │Database │        │Storage  │       │Cache    │
    │         │        │(Videos) │       │(Sessions)
    └─────────┘        └─────────┘       └─────────┘
```

---

## 📊 Data Flow Diagram

### Interview Flow
```
START INTERVIEW
    │
    ├──→ [HRLiveInterview] Initializes
    │    │
    │    ├──→ getUserMedia() - Get camera/mic
    │    │    │
    │    │    └──→ [WebRTCService] Creates Peer Connection
    │    │         │
    │    │         └──→ createOffer() → Send to Candidate
    │    │
    │    ├──→ Candidate Answers with createAnswer()
    │    │
    │    ├──→ ICE Candidates Exchanged
    │    │
    │    └──→ Video Streams Connected ✓
    │
    ├──→ [HRScoringPanel] Becomes Active
    │    │
    │    ├──→ Confidence Score Input (0-100)
    │    ├──→ Technical Score Input (0-100)
    │    └──→ Communication Score Input (0-100)
    │         │
    │         └──→ calculateOverallScore()
    │             Overall = (C×0.3) + (T×0.4) + (Com×0.3)
    │
    └──→ Interview Active - Real-time Scoring ✓


END INTERVIEW
    │
    ├──→ User Clicks "End Interview"
    │
    ├──→ [Confirmation Dialog] Shows Final Scores
    │
    ├──→ User Confirms Submission
    │
    ├──→ createInterviewResult() Generates Result Object
    │    │
    │    ├──→ Validate all scores (0-100)
    │    ├──→ Calculate overall score
    │    ├──→ Assign grade (A, B+, B, C+, C, D)
    │    ├──→ Get performance level
    │    └──→ Format for database
    │
    ├──→ POST /api/scores (Send to Backend)
    │
    ├──→ Backend Saves to Database
    │
    └──→ [HRInterviewResult] Component Displays Results ✓
         │
         ├──→ Score Cards
         ├──→ Circular Progress Charts
         ├──→ Feedback Summary
         └──→ Download/Share Options
```

---

## 🔄 Scoring Calculation Flow

```
INPUT SCORES
    │
    ├─→ Confidence: 85
    ├─→ Technical: 90
    └─→ Communication: 80
         │
         ├─→ validateScores()
         │   └─→ Check all 0-100? ✓
         │
         ├─→ calculateOverallScore()
         │   │
         │   ├─→ (85 × 0.30) = 25.5
         │   ├─→ (90 × 0.40) = 36.0
         │   ├─→ (80 × 0.30) = 24.0
         │   │
         │   ├─→ Sum = 85.5
         │   └─→ Round = 86
         │
         ├─→ getGrade(86)
         │   └─→ 80-89 range = 'B+'
         │
         ├─→ getPerformanceLevel(86)
         │   └─→ 80-89 range = 'Very Good'
         │
         └─→ Create InterviewResult Object
             │
             └─→ {
                   sessionId: 'session-123',
                   scores: { confidence: 85, technical: 90, communication: 80, overall: 86 },
                   grade: 'B+',
                   performanceLevel: 'Very Good',
                   feedback: { ... },
                   timestamp: '2026-01-02T10:30:00Z'
                 }


DISPLAY RESULTS
    │
    ├─→ [HRInterviewResult] Renders
    │
    ├─→ Shows Overall Score: 86
    │
    ├─→ Shows Grade: B+
    │
    ├─→ Shows Individual Scores
    │   ├─→ Confidence: 85 (Visual bar)
    │   ├─→ Technical: 90 (Visual bar)
    │   └─→ Communication: 80 (Visual bar)
    │
    ├─→ Shows Feedback
    │   ├─→ Per Category
    │   └─→ General
    │
    └─→ Candidate Views Results ✓
```

---

## 🎬 WebRTC Connection Flow

```
INITIATOR (HR)              |              RECEIVER (Candidate)
                            |
startCall()                 |
  │                         |
  ├─ getUserMedia()         |
  │   ├─ Video ✓           |
  │   └─ Audio ✓           |
  │                         |
  ├─ initializePeerConnection()
  │   ├─ Setup callbacks    |
  │   └─ Create PC          |
  │                         |
  ├─ createOffer()          |
  │   └─ Generate SDP       |
  │                         |
  ├─ setLocalDescription()  |
  │                         |
  ├─ Send Offer via Signaling Server
  │ ────────────────────────────────→  Receive Offer
  │                                        │
  │                                        ├─ getUserMedia()
  │                                        │   ├─ Video ✓
  │                                        │   └─ Audio ✓
  │                                        │
  │                                        ├─ initializePeerConnection()
  │                                        │
  │                                        ├─ setRemoteDescription(offer)
  │                                        │
  │                                        ├─ createAnswer()
  │                                        │
  │                                        └─ setLocalDescription()
  │                                             │
  │ ←────── Send Answer via Signaling Server ──┤
  │                         |
  ├─ setRemoteDescription(answer)
  │                         |
  │ ←───── ICE Candidates ──┐
  │        Exchange         │
  │ ─────────────────────→  │
  │                         |
  │                         ├─ addIceCandidate()
  │                         |
  ├─ addIceCandidate()      |
  │                         |
  ├─ connectionState: 'connected'
  │                         ├─ connectionState: 'connected'
  │                         |
  ├─ Remote Stream Received ←─────────────────┤
  │   ontrack event fired                     |
  │                                             |
  └─ CONNECTED ✓ ──────────────── CONNECTED ✓─┘
```

---

## 📱 Component Hierarchy

```
App
└── HRLiveInterview (Main Interview View)
    ├── Header (Session Info)
    ├── Main Content Grid
    │   ├── Left Column (2/3 width)
    │   │   ├── VideoConference Area
    │   │   │   └── Video Feed Placeholder
    │   │   ├── CandidateInfo Card
    │   │   │   ├── Name
    │   │   │   ├── Email
    │   │   │   ├── Role
    │   │   │   └── Status Badge
    │   │   └── InterviewControls
    │   │       ├── Start Button
    │   │       ├── Stop Button
    │   │       └── Record Toggle
    │   │
    │   └── Right Column (1/3 width)
    │       └── HRScoringPanel
    │           ├── Confidence Score
    │           │   ├── Slider
    │           │   ├── Feedback Textarea
    │           │   └── Color Indicator
    │           ├── Technical Score
    │           │   ├── Slider
    │           │   ├── Feedback Textarea
    │           │   └── Color Indicator
    │           ├── Communication Score
    │           │   ├── Slider
    │           │   ├── Feedback Textarea
    │           │   └── Color Indicator
    │           └── Overall Score Display
    │
    ├── Feedback Section
    │   └── General Feedback Textarea
    │
    ├── End Interview Dialog (Modal)
    │   ├── Score Summary
    │   ├── Cancel Button
    │   └── Confirm Button
    │
    └── [After Interview]
        └── HRInterviewResult
            ├── Header
            ├── Session Info
            ├── Overall Score Display
            ├── Individual Score Cards
            │   ├── Confidence
            ├── Technical
            │   └── Communication
            ├── Score Breakdown Charts
            ├── General Feedback
            └── Action Buttons
                ├── Download
                └── Share
```

---

## 🔄 State Management Flow

```
Component State
    │
    ├─ isInterviewActive: boolean
    │   ├─ true → Scoring panel enabled
    │   └─ false → Scoring panel disabled
    │
    ├─ scores: ScoreData
    │   ├─ confidence: 0-100
    │   ├─ technical: 0-100
    │   └─ communication: 0-100
    │
    ├─ comments: Record<string, string>
    │   ├─ confidence: string
    │   ├─ technical: string
    │   └─ communication: string
    │
    ├─ localStream: MediaStream | null
    │   └─ HR's camera/mic stream
    │
    ├─ remoteStream: MediaStream | null
    │   └─ Candidate's camera/mic stream
    │
    ├─ connectionState: RTCPeerConnectionState
    │   ├─ 'new' → Initializing
    │   ├─ 'connecting' → Handshaking
    │   ├─ 'connected' → Active
    │   ├─ 'disconnected' → Lost connection
    │   ├─ 'failed' → Connection failed
    │   └─ 'closed' → Ended
    │
    ├─ timer: number (seconds elapsed)
    │
    ├─ isRecording: boolean
    │
    ├─ showEndDialog: boolean
    │   └─ Confirmation dialog visibility
    │
    └─ interviewFeedback: string
        └─ General feedback textarea
```

---

## 🎯 Score Visualization

```
Score Range (0-100)

 0 ─────────────────┬─────────────────┬─────────────────┬─────────────────┬─ 100
                    │                  │                  │                  │
              RED   │    ORANGE        │     YELLOW      │     GREEN        │
            (0-49)  │    (40-59)       │     (60-79)     │     (80-100)     │
                    │                  │                  │                  │
              "D"   │    "C/C+"        │     "B/B+"      │     "A"          │
            Below   │  Improvement     │      Good       │   Excellent      │
        Expectations│   Needed         │                 │                  │
                    │                  │                  │                  │
          ▀▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀    ▀▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀


Color Feedback System:

  Confidence   │  Slider Color  │  Text Color  │  Background
  ─────────────┼────────────────┼──────────────┼────────────
      85       │   🟢 Green     │  Green-400   │  Green-900/40
      70       │   🟡 Yellow    │  Yellow-400  │  Yellow-900/40
      45       │   🟠 Orange    │  Orange-400  │  Orange-900/40
      15       │   🔴 Red       │  Red-400     │  Red-900/40
```

---

## 🔐 Data Security Flow

```
Candidate Interview Data
    │
    ├─→ [HRLiveInterview] Component
    │   │
    │   ├─→ Scores Validated (0-100 range)
    │   │
    │   ├─→ TypeScript Types Enforced
    │   │
    │   └─→ Sensitive Data Isolated
    │
    ├─→ Scoring Service Processing
    │   │
    │   ├─→ validateScores() - Check ranges
    │   │
    │   ├─→ Create sealed InterviewResult
    │   │
    │   └─→ formatResultForStorage() - Clean data
    │
    ├─→ API Transmission (HTTPS Required)
    │   │
    │   ├─→ Authorization Header (JWT)
    │   │
    │   ├─→ Data Payload Encrypted
    │   │
    │   └─→ Rate Limiting Applied
    │
    └─→ Backend Database
        │
        ├─→ Data Encryption at Rest
        │
        ├─→ Access Control (HR-only)
        │
        ├─→ Audit Logging
        │
        └─→ GDPR Compliance
```

---

## 📈 Performance Flow

```
Interview Performance Metrics
    │
    ├─ WebRTC Statistics
    │   ├─ Video Bitrate (kbps)
    │   ├─ Audio Bitrate (kbps)
    │   ├─ Video Resolution (px)
    │   ├─ Frame Rate (fps)
    │   ├─ Jitter (ms)
    │   ├─ Latency (ms)
    │   └─ Packet Loss (%)
    │
    ├─ Interview Duration
    │   └─ Elapsed Time: HH:MM:SS
    │
    ├─ Scoring Metrics
    │   ├─ Average Score: X/100
    │   ├─ Score Trend: ↑ (improving)
    │   └─ Final Grade: X
    │
    └─ System Performance
        ├─ Component Load Time: Xms
        ├─ Score Calculation: <1ms
        ├─ Bundle Size: 726KB
        └─ Build Time: 22.12s
```

---

## 🎬 Complete Interview Lifecycle

```
┌──────────────────────────────────────────────────────┐
│            INTERVIEW LIFECYCLE                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. PREPARATION                                       │
│     ├─ Candidate notified                             │
│     ├─ HR prepares                                    │
│     └─ System checks                                  │
│                                                       │
│  2. INITIATION                                        │
│     ├─ HRLiveInterview component loaded              │
│     ├─ WebRTC connection established                  │
│     ├─ Camera/mic permissions granted                │
│     └─ Video streams active                           │
│                                                       │
│  3. INTERVIEW                                         │
│     ├─ HRScoringPanel active                         │
│     ├─ Scores updated in real-time                   │
│     ├─ Comments recorded                              │
│     ├─ Timer running                                  │
│     └─ Recording (optional)                           │
│                                                       │
│  4. COMPLETION                                        │
│     ├─ End Interview button clicked                  │
│     ├─ Confirmation dialog shown                      │
│     ├─ Final scores calculated                        │
│     └─ Result submitted                               │
│                                                       │
│  5. RESULTS                                           │
│     ├─ HRInterviewResult displayed                   │
│     ├─ Scores visualized                              │
│     ├─ Feedback displayed                             │
│     ├─ Grade assigned                                 │
│     └─ Candidate notified                             │
│                                                       │
│  6. ARCHIVAL                                          │
│     ├─ Data stored in database                        │
│     ├─ Recording archived                             │
│     ├─ Analytics updated                              │
│     └─ History maintained                             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

**All diagrams are accurate as of January 2, 2026**
