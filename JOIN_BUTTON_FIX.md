# Join Interview Button - Troubleshooting & Implementation Guide

## ✅ Fixed Issues

The join interview button has been fixed with the following improvements:

### 1. **Hook Export Fixed**
- Added `useWebRTC` export (wrapper) that calls `useWebRTCInterview`
- The component can now properly import and use the hook

### 2. **Stream Return Type Fixed**
- Updated `startCall()` to return `Promise<MediaStream | null>`
- Component can now receive the media stream directly
- Proper null checking in case of errors

### 3. **Enhanced Error Handling**
- Added detailed logging to console for debugging
- Stream validation before attaching to video element
- Better error messages with specific instructions
- Visual error display in the UI

### 4. **Loading State Added**
- Button shows "Joining..." with spinner while connecting
- Button is disabled during join process
- Prevents multiple simultaneous join attempts

## What the Button Does Now

When you click **"Join Interview"**:

```
1. Button enters loading state ("Joining..." with spinner)
2. Requests camera/microphone permissions
3. Gets media stream from user device
4. Initializes WebRTC peer connection
5. Attaches local video stream to video element
6. Marks participant as online
7. Shows audio/video/end call controls
8. Starts call duration timer
```

## Browser Permissions Required

The button needs browser permissions to work:

### ✅ Chrome/Edge
1. Allow camera access when prompted
2. Allow microphone access when prompted
3. Grant permission in system settings if blocked

### ✅ Firefox
1. Allow camera access when prompted
2. Allow microphone access when prompted
3. Check Tools → Options → Privacy → Permissions

### ✅ Safari
1. System Preferences → Security & Privacy → Camera
2. System Preferences → Security & Privacy → Microphone
3. Grant permission to browser

## Debugging Steps

### If button doesn't work:

**Step 1: Check Browser Console**
```javascript
// Open Developer Tools (F12)
// Go to Console tab
// Look for errors like:
// "Failed to start call"
// "NotAllowedError: Permission denied"
// "NotFoundError: Requested device not found"
```

**Step 2: Check Device**
```
1. Is camera/microphone connected?
2. Is it in use by another app? (Discord, Zoom, etc.)
3. Is device working in other apps? (Test with Zoom)
```

**Step 3: Check Permissions**
```
Windows:
  Settings → Privacy & Security → Camera
  Settings → Privacy & Security → Microphone

macOS:
  System Preferences → Security & Privacy → Camera
  System Preferences → Security & Privacy → Microphone

Linux:
  Check /etc/apparmor.d/ or SELinux rules
```

**Step 4: Clear Browser Cache**
```
1. Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Select "All time"
3. Check "Cookies and other site data"
4. Check "Cached images and files"
5. Click "Clear data"
```

**Step 5: Try Different Browser**
```
Test with Chrome, Firefox, and Safari
to isolate browser-specific issues
```

## Common Error Messages

### ❌ "NotAllowedError: Permission denied"
**Cause:** User denied camera/microphone permission  
**Solution:**
1. Click browser URL bar → site settings (🔒)
2. Find Camera/Microphone permissions
3. Change from "Block" to "Allow"
4. Reload page and try again

### ❌ "NotFoundError: Requested device not found"
**Cause:** No camera or microphone detected  
**Solution:**
1. Check if devices are connected
2. Check device is not in use by another app
3. Try unplugging and replugging camera/mic
4. Restart browser

### ❌ "NotReadableError: Could not start video source"
**Cause:** Device in use or driver issue  
**Solution:**
1. Close all apps using camera (Zoom, Discord, etc.)
2. Restart browser
3. Update camera drivers
4. Try different USB port for camera

### ❌ "TypeError: Cannot read property 'srcObject'"
**Cause:** Video element ref issue  
**Solution:**
- Component auto-detects and fixes this now
- If still occurs, clear cache and reload

### ❌ Button shows spinner but never completes
**Cause:** WebRTC service initialization stuck  
**Solution:**
1. Check browser console for errors
2. Try refreshing the page
3. Check network connection
4. Try different browser

## Technical Implementation Details

### Button State Machine

```
IDLE
  ↓ (user clicks)
JOINING
  ├─ Requests permissions
  ├─ Gets media stream
  ├─ Initializes WebRTC
  └─ Attaches to video
  ↓ (success)
JOINED
  ├─ Show media controls (mute/unmute)
  ├─ Show video toggle
  └─ Show end call button
  
  OR ↓ (error)
  
ERROR
  ├─ Show error message
  ├─ Allow retry
  └─ Provide diagnostic info
```

### Component State Variables

```typescript
const [isJoined, setIsJoined] = useState(false);        // User has clicked join
const [isJoining, setIsJoining] = useState(false);      // Currently in progress
const [joinError, setJoinError] = useState<string>(''); // Error message if any
const [isCallActive, setIsCallActive] = useState(false);// WebRTC connected
```

### WebRTC Hook Flow

```
useWebRTC
  ├─ Initialize WebRTCService
  ├─ Register callbacks
  ├─ startCall()
  │  ├─ getUserMedia() [asks permissions]
  │  ├─ initializePeerConnection()
  │  ├─ setLocalStream()
  │  └─ return stream
  ├─ Stream attached to <video> element
  └─ UI updates to show controls
```

## Console Logging Added

When you click the button, you'll see logs like:

```
Attempting to join interview...
  sessionId: "session-1234567890"
  userRole: "hr"
  userName: "Sarah Johnson"

Stream obtained:
  stream: MediaStream {...}
  hasVideo: 1
  hasAudio: 1

Video stream attached to ref

Successfully joined interview
```

Use these logs to diagnose issues.

## Production Checklist

Before deploying to production:

✅ Test on Chrome (desktop)  
✅ Test on Firefox (desktop)  
✅ Test on Safari (desktop)  
✅ Test on Chrome Mobile (Android)  
✅ Test on Safari Mobile (iOS)  
✅ Test with camera/mic disabled (error handling)  
✅ Test with permission denied (error handling)  
✅ Test with no devices connected (error handling)  
✅ Test with device in use (error handling)  
✅ Test with different network speeds  
✅ Test fullscreen mode  
✅ Test on HTTPS only (requirement for WebRTC)  

## Backend Integration Points

The button works client-side, but connect it to backend for:

### 1. Signaling Server (Required)
```
Exchange SDP offer/answer
Exchange ICE candidates
Manage session lifecycle
```

### 2. Session Management API
```
POST /api/interviews/create
POST /api/interviews/{sessionId}/join
POST /api/interviews/{sessionId}/leave
```

### 3. Score Submission
```
POST /api/interviews/{sessionId}/scores
GET /api/interviews/{sessionId}/result
```

## Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅ 74+  | ✅ 74+ | Best support |
| Firefox | ✅ 60+  | ✅ 60+ | Full support |
| Safari  | ✅ 14.1+| ✅ 14.1+ | Requires HTTPS |
| Edge    | ✅ 79+  | ✅ 79+ | Chromium-based |

**HTTPS Required:** WebRTC's getUserMedia() requires HTTPS in production (except localhost)

## Next Steps

1. ✅ Button now works and joins interview
2. ⏳ Connect to WebRTC signaling server
3. ⏳ Implement offer/answer exchange
4. ⏳ Test with actual remote participant
5. ⏳ Add recording capability (optional)
6. ⏳ Add analytics and monitoring

## Support

If button still not working:
1. Open browser console (F12)
2. Click join button
3. Note all console errors
4. Check device permissions
5. Try different browser
6. Report with console output
