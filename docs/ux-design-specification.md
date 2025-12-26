---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 14]
inputDocuments:
  - docs/prd.md
  - docs/epics.md
  - docs/architecture-mobile.md
  - docs/analysis/brainstorming-session-2025-12-05.md
workflowType: 'ux-design'
lastStep: 14
project_name: 'managercheck'
user_name: 'ThanhThanhThanh'
date: '2025-12-25'
---

# UX Design Specification - ManagerCheck Mobile

**Author:** ThanhThanhThanh
**Date:** 2025-12-25

---

## Executive Summary

### Project Vision

ManagerCheck Mobile brings the focused "Leader-Member Delegation Loop" to Android and iOS. It prioritizes accountability and clarity over feature bloat, ensuring work progress and blockers are communicated efficiently without constant meetings or micromanagement.

### Target Users

**Manager (Leader)**
- Creates teams, assigns tasks with full context.
- Needs a quick overview of team workload and blocker alerts.
- Device: Primarily desktop (web), but needs mobile for quick checks and on-the-go assignments.

**Member (Executor)**
- Receives tasks, executes, and reports status.
- Primary goal: Know exactly what to do and communicate progress/blockers easily.
- Device: Often mobile-first, checking tasks in the field or between meetings.

### Key Design Challenges

1. **Enforcing the "Closed Loop":** Mandatory blocker comments must feel like a helpful prompt, not accusatory.
2. **Information Density:** Task cards need to balance visual clarity with rich context.
3. **Multi-Team Context:** Users switch between "Manager" and "Member" hats; UI must be unambiguous.
4. **Notification Saturation:** Real-time alerts must be useful, not overwhelming.

### Design Opportunities (Refined via Party Mode)

1. **"Help Requested" Blocker UI:**
   - Use supportive language ("Help Needed") instead of accusatory ("Blocked").
   - Amber color treatment (warm, not alarming).
   - One-tap "Offer Help" button for Managers to respond instantly.

2. **Smart Escalation Notifications:**
   - Initial: Quiet toast notification.
   - After 4 hours: Prominent banner in Manager Dashboard.
   - Technical: Calculate `Date.now() - blockedAt` at render time.

3. **Rewarding Micro-Interactions:**
   - Satisfying animations for "Done" transitions (confetti? checkmark?).

4. **Celebratory Empty States:**
   - "You're all caught up! 🎉" when Member has zero tasks.

---

## Core User Experience

### Defining Experience

The core user action is **Task Status Update**. Members must be able to transition tasks (Todo → In Progress → Done/Blocked) with minimal friction. This is the "heartbeat" of the app.

### Platform Strategy

- **Platform:** React Native (Expo 54) for Android & iOS.
- **Input:** Touch-first (tap, swipe, pull-to-refresh).
- **Offline:** Graceful error handling; offline queuing deferred to V2.
- **Device Features:** Push notifications, secure credential storage.

### Effortless Interactions

1. **Status Change:** 1-tap action sheet, no full-page navigation.
2. **Task Details:** Bottom sheet overlay (swipe up to expand).
3. **Blocker Comment:** Auto-triggered modal when "Help Needed" is selected.
4. **Team Switching:** Left-side drawer, single tap to switch context.

### Critical Success Moments

1. **First Task View:** Must not overwhelm. Prioritized list or empty state celebration.
2. **Reporting Blocker:** Frictionless flow encourages early reporting.
3. **Blocker Notification (Manager):** Smart escalation ensures visibility.
4. **Marking Done:** Micro-animation reward loop.

### Experience Principles

1. **"One Tap to Status"** – Status updates require 1-2 taps maximum.
2. **"Blockers Are Not Failures"** – UI encourages early blocker reporting.
3. **"Glanceable Dashboards"** – Managers understand workload in 5 seconds.
4. **"Celebrate Completion"** – Micro-animations for "Done" transitions.

---

## Desired Emotional Response

### Primary Emotional Goals

| User | Emotional Goal | Why It Matters |
|---|---|---|
| Member | **Confident & Clear** – "I know exactly what to do" | Reduces work anxiety |
| Manager | **In Control & Assured** – "Team is on track, I see blockers instantly" | Trust in the system |
| Both | **Accomplished** – Completing tasks = dopamine hit | Creates habit loop |

### Emotional Journey Mapping

| Stage | Desired | To Avoid |
|---|---|---|
| First app open | Curious, Simple | Overwhelmed |
| Viewing task list | Focused, Clear | Anxious |
| Updating status | Effortless, Quick | Frustrated |
| Reporting blocker | Supported | Blamed |
| Marking Done | **Satisfied, Accomplished** 🎉 | Empty |
| Network error | Informed, Patient | Panicked |

### Micro-Emotions

- **Confidence:** Priority badges, clear sorting.
- **Trust:** "Help Needed" framing, smart escalation.
- **Accomplishment:** Confetti animation on "Done".
- **Relief:** "All clear" empty state for managers.

### Emotional Design Principles

1. **"Clarity Over Cleverness"** – Never sacrifice understanding for aesthetics.
2. **"Support, Don't Blame"** – Blocker reporting feels like asking for help.
3. **"Celebrate Small Wins"** – Every "Done" is a moment of joy.
4. **"Errors Are Human"** – Network failures communicate clearly, not scarefully.

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| App | UX Strengths | Patterns to Learn |
|---|---|---|
| **Todoist** | Quick-add, natural language dates | Minimal friction task entry |
| **Slack** | Notification batching, offline queue | Real-time but not overwhelming |
| **Linear** | Clean status boards, glanceable | Elegant status transitions |
| **Things 3** | Micro-interactions, emotional polish | Celebratory empty states |

### Transferable UX Patterns

1. **Quick Add Modal** – FAB opens lightweight modal (Todoist-inspired).
2. **Swipe Actions** – Status change via swipe gestures.
3. **Status Pills** – Color-coded chips (Linear style).
4. **Bottom Sheet Details** – Non-blocking task view (Google Maps).
5. **Empty State Celebration** – "All Done! 🎉" (Things 3).

### Anti-Patterns to Avoid

1. ❌ **Nested Navigation** – Confusing, hard to backtrack.
2. ❌ **Red "Blocked" Labels** – Feels blaming, discourages reporting.
3. ❌ **Force Sync on Open** – Slow, blocking UX.
4. ❌ **Notification Spam** – Users disable notifications entirely.

### Design Inspiration Strategy

| Strategy | Implementation |
|---|---|
| **Adopt** | Bottom sheets, status pills, pull-to-refresh |
| **Adapt** | Simplified quick-add, custom empty states |
| **Avoid** | Nested nav, aggressive colors, spam |

---

## Design System Foundation

### Design System Choice

**React Native Paper** (Material Design 3) – Already integrated in codebase.

### Rationale for Selection

1. **Pre-integrated** in `_layout.tsx` with Light/Dark theming.
2. **MD3 components** align with touch-first platform strategy.
3. **Built-in accessibility** and comprehensive theming support.
4. **Component library** covers FAB, Chip, Card, SegmentedButtons.

### Implementation Approach

- Use Paper primitives: `Card`, `Chip`, `FAB`, `SegmentedButtons`.
- Add `@gorhom/bottom-sheet` for task details overlay.
- Custom status colors: Amber (Help Needed), Green (Done), Blue (In Progress).

### Customization Strategy

| Component | Paper Primitive | Custom Treatment |
|---|---|---|
| Status Pills | `Chip` | Custom status colors |
| Task Card | `Card` | Compact, priority indicator |
| Add Task | `FAB` | Primary color, fixed bottom-right |
| Status Filters | `SegmentedButtons` | Dashboard filter row |

---

## Interaction Patterns (Added 2025-12-26)

*Based on PRD Gap Analysis - formalizing patterns already implemented in web frontend.*

### Optimistic UI Patterns

**Philosophy:** "Feel instant, confirm later"

| Action | Optimistic Behavior | Rollback on Error |
|---|---|---|
| **Add Comment** | Comment appears immediately in list | Remove comment + error toast |
| **Edit Comment** | Text updates instantly | Revert to original text + error toast |
| **Delete Comment** | Comment fades out immediately | Re-appear comment + error toast |
| **Status Change** | Status pill updates instantly | Revert to previous status + error toast |

**Implementation Notes:**
- Use `tempId` for optimistic items before server confirmation
- Store original state for rollback capability
- Toast notification on rollback explains what happened

### Loading State Patterns

**Philosophy:** "Show progress, never freeze"

| Context | Loading Pattern | Duration |
|---|---|---|
| **Initial Screen Load** | Centered spinner with app icon | Until first data |
| **List Refresh** | Pull-to-refresh indicator (top) | Until data received |
| **Button Action** | Button disabled + inline spinner | Until action complete |
| **Modal Submit** | Submit button shows spinner, form disabled | Until response |
| **Background Sync** | No visible indicator (silent) | N/A |

**Mobile-Specific Patterns:**
- Pull-to-refresh on all list screens (tasks, members, notifications)
- Skeleton loaders for cards (optional V2)
- Haptic feedback on successful refresh (iOS)

### Error Handling Patterns

**Philosophy:** "Explain, don't blame"

| Error Type | User Message | Toast Style |
|---|---|---|
| **Network Error** | "Connection lost. Please check your internet." | ⚠️ Warning (amber) |
| **User Not Found** | "No user found with that email." | ℹ️ Info (blue) |
| **Already Member** | "This person is already in your team." | ℹ️ Info (blue) |
| **Permission Denied** | "Only managers can do this action." | 🚫 Error (red) |
| **Validation Error** | Specific field message (e.g., "Title is required") | 🚫 Error (red) |
| **Server Error** | "Something went wrong. Please try again." | 🚫 Error (red) |

**Error Recovery:**
- Retry button for network errors
- Clear error state on user action
- Never block entire UI for non-critical errors

### Empty State Patterns

**Philosophy:** "Guide, don't abandon"

| Screen | Empty State Message | CTA |
|---|---|---|
| **Dashboard (no teams)** | "You don't have any workspaces yet!" | [Create Your First Workspace] |
| **Task List (no tasks)** | "No tasks yet. Ready to get productive?" | [Create Task] (Manager only) |
| **Member List (empty)** | "Your team is waiting! Invite your first teammate." | [Invite Teammate] |
| **Notifications (empty)** | "All caught up! 🎉" | None (celebratory) |
| **Blocked Tasks (none)** | "No blockers right now. Great job!" | None (celebratory) |

**Design Notes:**
- Use subtle illustrations or icons (not heavy graphics)
- CTAs should be primary color, prominent
- Empty states for positive scenarios should celebrate

---

## Defining Core Experience (Step 7)

### Signature Interaction

> **"Tap to update status, see progress instantly."**

This is the defining experience that:
- **Members** perform 10+ times daily
- **Managers** see results in real-time
- Creates the "closed loop" accountability that makes ManagerCheck special

### User Mental Model

**Member Mental Model:**
- "I open app → see my tasks → update status → done"
- "If stuck, I tap 'Help Needed' and manager sees immediately"
- **Expectation:** < 3 taps to complete primary action

**Manager Mental Model:**
- "I open app → see overview → if blocker exists, I act"
- "What's my team doing? Who's stuck?"
- **Expectation:** 5-second glance to understand workload

### Success Criteria

| Role | Success Metric | Target |
|---|---|---|
| Member | Status update time | < 3 seconds (1 tap) |
| Member | New task awareness | < 2 seconds (push notification) |
| Manager | Blocker awareness | < 5 seconds (notification) |
| Manager | Workload comprehension | 1 glance (5 seconds) |

### Novel UX Patterns

| Pattern | Type | Education Strategy |
|---|---|---|
| **Blocker Comment Modal** | Novel | Tooltip on first use: "This helps your manager help you" |
| **Smart Escalation** | Novel | No education needed – automatic |
| **Celebratory Empty State** | Novel | Self-explanatory design |
| Status Action Sheet | Established | Native iOS/Android pattern |
| Pull-to-refresh | Established | Universal mobile pattern |

### Experience Mechanics: Status Update Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. INITIATION                                               │
│    • Member taps task card in "My Tasks"                    │
│    • Bottom sheet slides up with task details               │
│    • Status button prominent at bottom                      │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. INTERACTION                                              │
│    • Member taps status button                              │
│    • Action sheet appears:                                  │
│      ○ Todo                                                 │
│      ○ In Progress                                          │
│      ○ Done ✓                                               │
│      ○ Help Needed 🤝 (amber, supportive)                   │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. FEEDBACK                                                 │
│    If "Done":                                               │
│    • Checkmark animation + green pill                       │
│    • Toast: "Nice work! 🎉"                                 │
│                                                             │
│    If "Help Needed":                                        │
│    • Modal: "What do you need help with?"                   │
│    • Required text (min 10 chars)                           │
│    • Submit → amber pill + Socket.io to Manager             │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. COMPLETION                                               │
│    • Bottom sheet auto-closes                               │
│    • Task list updates optimistically                       │
│    • Manager notified (if blocked)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Document Finalization (Step 14)

### Implementation Checklist

Based on this UX specification, the mobile app should implement:

#### Core Screens ✅ COMPLETE
- [x] **Dashboard** – Team selection with workspace cards
- [x] **My Tasks** – Filterable task list for members
- [x] **Task Detail** – Bottom sheet with full task info
- [x] **Team Members** – Member list with invite/remove
- [x] **Notifications** – Real-time alert list
- [x] **Login/Signup** – Email/password authentication

#### Key Interactions ✅ COMPLETE
- [x] **1-tap Status Change** – Action sheet from task card
- [x] **Blocker Comment Modal** – Auto-triggered on "Help Needed"
- [x] **Pull-to-refresh** – All list screens
- [x] **Bottom Sheet Detail** – Task details overlay
- [x] **FAB** – Create task (Manager only)

#### UX Patterns ✅ COMPLETE
- [x] **Optimistic UI** – Comments and status changes
- [x] **Loading States** – Spinner, button loading, pull-to-refresh
- [x] **Empty States** – Celebratory messages with CTAs
- [x] **Error Handling** – Friendly toasts by error type
- [ ] **Smart Escalation** – Time-based blocker notifications (V2)

### Design System Implementation

| Component | react-native-paper | Custom Styling |
|---|---|---|
| Task Card | `Card` | Priority indicator, compact layout |
| Status Pill | `Chip` | Custom status colors |
| Create Task | `FAB` | Primary color, bottom-right |
| Status Filter | `SegmentedButtons` | Dashboard filter row |
| Task Detail | `@gorhom/bottom-sheet` | Swipe-up overlay |

### Status Colors

```
todo:        #6B7280 (gray-500)
in_progress: #3B82F6 (blue-500)
done:        #10B981 (green-500)
help_needed: #F59E0B (amber-500)
```

### Priority Colors

```
low:    #6B7280 (gray-500)
medium: #F59E0B (amber-500)
high:   #EF4444 (red-500)
```

---

## Mobile Navigation Structure

### Tab Bar Architecture

| Tab | Icon | Screen | Primary Action |
|-----|------|--------|----------------|
| Dashboard | 📊 | Stats overview | View workload |
| Tasks | 📋 | Task list + filters | Update status |
| Team | 👥 | Member list | Invite/remove |
| Alerts | 🔔 | Notifications | Mark as read |

### Header Behavior

- **Consistent AppHeader:** Team name + hamburger across all tabs
- **Drawer:** Modal overlay for team switching + logout
- **Bottom Sheet:** Task details, status changes, comments

---

## Team Management UX

### Member List Patterns

| Pattern | Implementation |
|---------|----------------|
| Avatar with initials | `Avatar.Text` from Paper |
| Role badge | Manager gets `Chip` indicator |
| Remove with confirmation | `Alert.alert()` before action |
| Invite by email | Modal with email input |

### Logout Flow

1. User taps hamburger → Drawer opens
2. Scroll to footer → User info visible
3. Tap "Đăng xuất" → `reset()` store + `signOut()`
4. Redirect to login screen

---

## Form Validation UX

### Technology Stack

- **React Hook Form** – Form state management
- **Zod** – Schema validation
- **@hookform/resolvers** – Integration layer

### Validation Patterns

| Field | Rule | Error Message |
|-------|------|---------------|
| Task Title | min 3 chars | "Tiêu đề phải có ít nhất 3 ký tự" |
| Blocker Comment | min 10 chars | "X more characters needed" |
| Email (Invite) | valid email | "Email không hợp lệ" |

---

## Document Status

| Attribute | Value |
|---|---|
| **Version** | 2.0 (Post-Implementation Update) |
| **Last Updated** | 2025-12-26 |
| **Author** | ThanhThanhThanh + Sally (UX Designer) |
| **Status** | ✅ Implementation Complete |

### Implementation Progress

| Epic | Stories | UX Status |
|------|---------|-----------|
| Epic 6 - Foundation | 3/3 | ✅ Complete |
| Epic 7 - Dashboard | 2/2 | ✅ Complete |
| Epic 8 - Execution | 3/3 | ✅ Complete |
| Epic 9 - Management | 2/2 | ✅ Complete |

### Steps Completed
- ✅ Step 1-7: Core UX Design
- ✅ Step 14: Finalization
- ✅ **Post-Implementation Update** (2025-12-26)

---

**End of UX Design Specification**

