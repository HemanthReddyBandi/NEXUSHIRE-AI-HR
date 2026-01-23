# Dual Camera Screen Layout - Visual Guide

## Screen Layout Overview

```
╔══════════════════════════════════════════════════════════════════════╗
║                       INTERVIEW SESSION                              ║
║  ID: 2                                        ⚙️  ⛶  (Settings/FS)   ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  ┌─────────────────────────────────┐   ┌────────────────────────┐  ║
║  │                                 │   │                        │  ║
║  │  YOUR CAMERA                    │   │  OTHER PARTICIPANT    │  ║
║  │  (LOCAL VIDEO)                  │   │  (REMOTE VIDEO)       │  ║
║  │                                 │   │                        │  ║
║  │  50% width           gap: 16px  │   │    50% width           │  ║
║  │                                 │   │                        │  ║
║  │  Full screen object-fit: cover  │   │  Full screen fit       │  ║
║  │                                 │   │                        │  ║
║  │  ┌─ Name (You) [You]            │   │  ┌─ Name [CANDIDATE]   │  ║
║  │  HR      🎤 (green)             │   │  CANDIDATE  ✓Connected │  ║
║  │                                 │   │  🎤 (green)            │  ║
║  └─────────────────────────────────┘   └────────────────────────┘  ║
║                                                                      ║
║  [🔊 Mute]  [🎥 Stop Video]  [📞 End Call]     [Scoring Panel]      ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

## Two-Column Grid Layout

```
Available Space: Full interview area
Gap Between Columns: 16px (1rem)

Left Column (50%):         Right Column (50%):
┌─────────────────┐       ┌──────────────────┐
│                 │       │                  │
│  Local Camera   │       │  Remote Camera   │
│  (You)          │       │  (Participant)   │
│                 │       │                  │
│                 │       │                  │
└─────────────────┘       └──────────────────┘
```

## Camera Card Components

### Local Camera Card (Left)
```
┌────────────────────────────────────────┐
│                                        │
│   [Full Video Feed - Your Camera]     │
│                                        │
│   ┌──────────────────────────────┐    │
│   │ John Doe (You)               │ 🎤 │ (Green = Mic On)
│   │ HR                           │    │
│   └──────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘

Border: 2px solid #1f2937 (gray-800)
Rounded: 8px
Background: #111827 (gray-900)
```

### Remote Camera Card (Right)

#### State 1: Waiting to Join
```
┌────────────────────────────────────────┐
│                                        │
│            ⚠️  (Alert Icon)            │
│          [Jane Smith]                  │
│       Waiting to join...               │
│                                        │
└────────────────────────────────────────┘
```

#### State 2: Connected (Video Streaming)
```
┌────────────────────────────────────────┐
│                                        │
│   [Full Video Feed - Remote Camera]   │
│                                        │
│   ┌──────────────────────────────┐    │
│   │ Jane Smith                   │ 🎤 │ (Green = Mic On)
│   │ CANDIDATE                    │ ✓  │ ("Connected" badge)
│   └──────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

#### State 3: Connected but Camera Off
```
┌────────────────────────────────────────┐
│                                        │
│            📷 off (Icon)               │
│          Camera Off                    │
│                                        │
│   ┌──────────────────────────────┐    │
│   │ Jane Smith                   │    │
│   │ CANDIDATE                    │ ✓  │ (Still Connected)
│   └──────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

## Before Joining (Single Column)

```
┌─────────────────────────────────────────────┐
│                                             │
│           Your Camera Only                  │
│        (grid-cols-1 applied)                │
│                                             │
│       Full width, not 2 columns             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ John Doe (You)                    🎤  │ │
│  │ HR                                    │ │
│  └───────────────────────────────────────┘ │
│                                             │
│      [Join Interview] Button Below         │
│                                             │
└─────────────────────────────────────────────┘
```

## After Joining (Two Columns)

```
┌──────────────────────┬────────────────────────┐
│                      │                        │
│   Your Camera        │   Remote Camera        │
│   (grid-cols-2)      │   (Dual Display)       │
│                      │                        │
│                      │                        │
└──────────────────────┴────────────────────────┘
```

## Video Metadata Badges

### Name & Role Badge (Bottom-Left of each video)
```
┌─────────────────────┐
│ John Doe (You)      │  ← Local (Cyan: #06b6d4)
│ HR                  │     Role in uppercase
└─────────────────────┘

┌─────────────────────┐
│ Jane Smith          │  ← Remote (Purple: #a78bfa)
│ CANDIDATE           │     Role in uppercase
└─────────────────────┘
```

### Microphone Indicator (Top-Right of each video)
```
Local Video:
🎤 Green = Microphone ON (pulsing animation)
X Red = Microphone OFF

Remote Video:
🎤 Green = Remote Microphone ON (pulsing animation)
X Red = Remote Microphone OFF
```

### Connection Status Badge (Top-Right of Remote Video Only)
```
When Connected:
┌──────────────────┐
│ ✓ Connected      │  ← Green background (#064e3b)
│                  │     Green border (#15803d)
│                  │     Green text (#4ade80)
└──────────────────┘

When Waiting:
(No badge shown - "Waiting to join..." text instead)
```

## Full Screen Example

```
╔═══════════════════════════════════════════════════════════════════╗
║                    INTERVIEW SESSION                              ║
║  ID: 2                             ⚙️    ⛶                         ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌──────────────────────────────┬──────────────────────────┐     ║
║  │                              │                          │     ║
║  │  [John's Camera Stream]      │  [Jane's Camera Stream]  │     ║
║  │                              │                          │     ║
║  │  [Video playing...]          │  [Video playing...]      │     ║
║  │                              │                          │     ║
║  │  John Doe (You)              │  Jane Smith              │     ║
║  │  HR              🟢 mic      │  CANDIDATE  ✓ Connected  │     ║
║  │                              │            🟢 mic        │     ║
║  │                              │                          │     ║
║  └──────────────────────────────┴──────────────────────────┘     ║
║                                                                   ║
║  [🔇 Mute]  [📵 Stop Video]  [☎️ End Call]    [Scoring Panel]    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

## CSS Grid Structure

```css
/* Video Grid Container */
display: grid;
gap: 1rem; /* 16px between columns */

/* When joined: 2 equal columns */
grid-template-columns: 1fr 1fr;  /* 50% | 50% */

/* When not joined: 1 column */
grid-template-columns: 1fr;       /* 100% */
```

## Responsive Behavior

### Desktop (Large Screens)
- Both cameras visible side-by-side
- Full height videos
- Gap: 16px
- Names & badges clearly visible

### Tablet (Medium Screens)
- Both cameras visible side-by-side
- Slightly smaller due to screen width
- Gap: 16px maintained
- All labels visible

### Mobile (Small Screens)
- Still 2-column layout
- Very narrow columns
- Labels may overlap
- Consider future mobile optimization

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Local Name Badge | Cyan (#06b6d4) | "You" identifier |
| Remote Name Badge | Purple (#a78bfa) | "Other participant" |
| Microphone On | Green (#16a34a) | Pulsing indicator |
| Microphone Off | Red (#dc2626) | Static indicator |
| Connected Badge | Green/Dark Green | Connection status |
| Card Border | Gray-800 (#1f2937) | Subtle separator |
| Card Background | Gray-900 (#111827) | Dark video background |
| Role Text | Gray-400 (#9ca3af) | Subdued secondary text |

## Interaction Points

### Controls (Always visible when joined)
```
[Mute/Unmute]  [Stop/Start Video]  [End Call]
```

### Settings
```
⚙️ Click for settings menu
⛶ Click for fullscreen toggle
```

### Video Area
```
Click on video = Focus/Zoom (future feature)
```

## Animation Elements

### Microphone Indicator (Local when enabled)
```
🟢 Green dot with pulse animation
Repeats infinitely
Indicates microphone active
```

### During Connection Wait
```
⚠️ Alert icon
Bouncing status dots (3 dots with staggered timing)
Rotating clock icon
```

## Accessibility Features

- ✓ All icons have title attributes (hover tooltips)
- ✓ Role badges clearly indicate HR vs Candidate
- ✓ Connection status explicitly shown
- ✓ Name labels for participant identification
- ✓ Color contrast meets WCAG AA standards
- ✓ Microphone indicators show state without relying on color alone

---

## Quick Reference: State Transitions

### Candidate's Screen Journey

```
1. Waiting Screen
   ┌─────────────────────┐
   │ Waiting for HR      │
   │ [Join Now] button   │
   └─────────────────────┘
        ↓ (clicks button)
        
2. Loading (2-3 seconds)
   ┌─────────────────────┐
   │ [Your Camera]       │ ← Left side visible
   │ Permission prompt   │
   └─────────────────────┘
        ↓ (grants permission)
        
3. Connected (Dual View)
   ┌──────────────┬─────────┐
   │ [You]        │ [HR]    │
   │ Left         │ Right   │
   └──────────────┴─────────┘
```

### HR's Screen Journey

```
1. Join Interview
   ┌─────────────────────┐
   │ [Your Camera]       │
   │ [Join Interview]    │
   └─────────────────────┘
        ↓ (clicks button)
        
2. Joined + Modal
   ┌─────────────────────┐
   │ [Your Camera]       │
   │ [+] Popup Modal     │ (with shareable link)
   └─────────────────────┘
        ↓ (closes modal)
        
3. Waiting for Candidate
   ┌─────────────────────┐
   │ [Your Camera]       │
   │ (single column)     │ (remote section hidden)
   │ Waiting...          │
   └─────────────────────┘
        ↓ (candidate joins)
        
4. Dual View Active
   ┌──────────────┬─────────┐
   │ [You]        │ [Candi- │
   │ Left         │  date]  │
   │              │ Right   │
   └──────────────┴─────────┘
```

---

## Summary

✅ **Two cameras always visible after joining**
✅ **Side-by-side grid layout (50% | 50%)**
✅ **Full-screen video with object-fit: cover**
✅ **Clear participant identification**
✅ **Real-time connection status**
✅ **Professional appearance**
✅ **Dark mode design with cyan/purple accents**
