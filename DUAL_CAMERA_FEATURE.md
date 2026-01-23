# Dual Camera Activation Feature

## Overview
After the candidate clicks "Join Interview Now" on the waiting screen, both the HR and candidate cameras will activate and display side-by-side on the same screen.

## Implementation Changes

### 1. Video Grid Layout (HRCandidateUnifiedInterview.tsx)
**Updated the video grid to always show 2 columns when user joins:**

```tsx
<div className={`flex-1 grid gap-4 ${isJoined ? 'grid-cols-2' : 'grid-cols-1'}`}>
```

**Key Changes:**
- When `isJoined` is true → `grid-cols-2` (two-column layout)
- When `isJoined` is false → `grid-cols-1` (single column)
- Gap between videos: 1 rem (16px)

### 2. Remote Video Visibility Enhancement
**Updated the remote video stream handling:**

```tsx
{isJoined && (
  <div className="relative bg-gray-900 rounded-lg...">
    <video
      ref={remoteVideoRef}
      style={{ display: participants.remote.videoEnabled && participants.remote.isOnline ? 'block' : 'none' }}
    />
    {/* Shows remote participant's video when both conditions are true */}
  </div>
)}
```

**Visibility Rules:**
- Remote video container renders only when `isJoined` is true
- Video element displays when:
  - `participants.remote.videoEnabled` is true AND
  - `participants.remote.isOnline` is true
- Shows placeholder if remote participant hasn't joined yet

### 3. Waiting Screen Dismissal
**Updated handleJoinInterview() to properly close waiting screen:**

```tsx
if (userRole === 'candidate') {
  setShowWaitingForHR(false);
  console.log('Candidate waiting screen dismissed, activating camera...');
}
```

### 4. Participant State Updates
**Enhanced participant tracking with videoEnabled flag:**

```tsx
setParticipants(prev => ({
  ...prev,
  local: { ...prev.local, isOnline: true, videoEnabled: true }
}));
```

**When WebRTC connects:**
```tsx
setParticipants(prev => ({
  ...prev,
  remote: { 
    ...prev.remote, 
    isOnline: true,
    videoEnabled: true 
  }
}));
```

## User Flow

### Step 1: HR Starts Interview
- HR clicks "Join Interview" button
- HR's camera activates
- HR sees popup modal with shareable link

### Step 2: Candidate Opens Link
- Candidate opens the shared interview link
- Candidate sees "Waiting for HR" screen with animations

### Step 3: Candidate Joins Interview
- Candidate clicks "Join Interview Now" button
- Waiting screen closes
- Candidate's camera activates (requested permissions)

### Step 4: Dual Camera Display
- Both cameras now visible side-by-side
- **Left side:** Your camera (local participant)
- **Right side:** Other participant's camera (remote)
- Each camera has:
  - Name and role label (bottom-left)
  - Audio indicator (top-right green = on, red = off)
  - "Connected" status badge (top-right, when connected)
  - Full-screen video feed with object-fit: cover

## Camera Display Features

### Each Camera Shows:
1. **Video Feed** - Full-screen, centered, object-fit: cover
2. **Name Label** 
   - Local: Cyan color with "(You)" suffix
   - Remote: Purple color
3. **Role Badge**
   - Shows "HR" or "CANDIDATE" in uppercase
4. **Audio Status Indicator**
   - Green pulsing dot = microphone active
   - Red dot = microphone muted
5. **Connection Status** (Remote only)
   - Shows "Connected" badge when remote is active
   - Shows "Waiting to join..." if not yet connected

### Video Containers:
- Rounded corners: 8px
- Border: 2px solid gray-800
- Background: dark gray for loading state
- Aspect ratio: Fills available space with object-fit: cover

## Connection Status Display

### Remote Video States:

**Waiting State (Before Remote Joins):**
```
┌─────────────────────┐
│                     │
│  ⚠️  (Alert Icon)   │
│  [Remote Name]      │
│  Waiting to join... │
│                     │
└─────────────────────┘
```

**Connected State (Remote Video Playing):**
```
┌─────────────────────┐
│   [Remote Video]    │
│   [Remote Name]     │
│   ✓ Connected       │
│   [Audio Indicator] │
└─────────────────────┘
```

**Camera Off State (Remote Camera Disabled):**
```
┌─────────────────────┐
│                     │
│   🎥 off (Icon)     │
│   Camera Off        │
│   [Remote Name]     │
│                     │
└─────────────────────┘
```

## Layout Structure

```
┌────────────────────────────────────────────────┐
│                   Header                       │
│  Title | Session ID | Duration | Settings     │
└────────────────────────────────────────────────┘
┌────────────────┬────────────────────────────────┐
│                │                                │
│  Local Camera  │      Remote Camera             │
│  (Left Side)   │      (Right Side)              │
│                │                                │
│  Your Video    │   HR/Candidate Video          │
│  [Your Name]   │   [Their Name]                │
│                │   ✓ Connected                  │
│                │                                │
└────────────────┴────────────────────────────────┘
│  Controls: Mute | Stop Video | End Call | etc. │
└────────────────────────────────────────────────┘
```

## Technical Details

### Video Elements:
- **Local Video Ref:** `localVideoRef` - Muted, shows self-view
- **Remote Video Ref:** `remoteVideoRef` - Shows remote participant

### State Management:
- `isJoined` - Controls grid visibility and layout
- `mediaSettings.videoEnabled` - Controls local video display
- `participants.remote.videoEnabled` - Controls remote video display
- `participants.remote.isOnline` - Shows connection status

### WebRTC Integration:
- When WebRTC connection established: `webrtcHook.isConnected` becomes true
- Remote stream attached: `remoteVideoRef.current.srcObject = webrtcHook.remoteStream`
- Call becomes active: `setIsCallActive(true)`
- Call duration timer starts

## Browser Support
- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 11+)
- Edge: ✅ Full support

## Permissions Required
Both participants must grant:
1. **Camera Permission** - To share video feed
2. **Microphone Permission** - To share audio

## Testing the Feature

### Local Testing (Two Tabs):
1. Open `http://localhost:3000` in Tab 1 (HR)
2. Open `http://localhost:3000` in Tab 2 (Candidate)
3. Tab 1: Go to HR Dashboard → Click "Start Interview"
4. Tab 1: See popup with link
5. Tab 1: Copy link
6. Tab 2: Paste link → Click "Join as Candidate"
7. Tab 2: See waiting screen
8. Tab 2: Click "Join Interview Now"
9. Both: Grant camera/microphone permissions
10. **Result:** Both cameras visible side-by-side with audio working

### Network Testing:
- Test from different devices on same network
- Use hostname instead of localhost for remote access
- Monitor browser console for connection status logs

## Troubleshooting

### Remote Video Not Showing
1. Check browser console for WebRTC errors
2. Verify camera permissions granted for both users
3. Check firewall/network settings allow WebRTC
4. Try refreshing the page

### One-Way Video (Only See Your Camera)
1. Wait a few seconds for WebRTC connection to establish
2. Check remote participant's camera is enabled
3. Verify both on same session ID

### Audio Issues
1. Check microphone permissions granted
2. Test speakers/headphones on your device
3. Ensure no other app is using microphone

## Future Enhancements
- [ ] Screen sharing alongside video
- [ ] Picture-in-picture mode
- [ ] Virtual backgrounds
- [ ] Recording functionality
- [ ] Chat alongside video
- [ ] Call quality indicators
