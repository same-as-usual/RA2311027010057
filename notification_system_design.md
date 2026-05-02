# Notification System Design

## Stage 1

### Problem
Users lose track of important notifications due to high volume. A Priority Inbox
is needed that always surfaces the most important unread notifications first.

### Priority Algorithm

Notifications are ranked using a weighted score combining type priority and recency.

**Type weights:**
- Placement: 3
- Result: 2
- Event: 1

**Score formula:**
score = typeWeight * 1000 + 1 / (secondsSincePosted + 1)

This ensures type priority is the dominant factor. Among notifications of the
same type, more recent ones rank higher. The top N are selected by sorting all
notifications by score descending and slicing to n.

**Handling incoming notifications efficiently:**
As new notifications arrive they are scored and inserted into the sorted list.
Only the top N are kept at any time, so memory usage stays constant regardless
of total notification volume.

## Stage 2

### Architecture

The frontend is a React + TypeScript application running on localhost:3000.
It has two main pages:

- **All Notifications** — displays every notification with filter by type
  (Placement, Result, Event). Each card shows read/unread state. Clicking
  a card marks it as viewed.

- **Priority Inbox** — displays the top N notifications ranked by the priority
  algorithm above. N is adjustable via a slider (5, 10, 15, 20).

### Read/Unread tracking
Viewed notification IDs are stored in React state as a Set. This avoids any
backend dependency while keeping the distinction clear within a session. A
blue left border indicates unread, grey indicates already viewed.

### API Integration
All API calls go through the Vite dev server proxy to avoid CORS issues.
Auth tokens are fetched once and cached for the session.

### Logging
Every significant event (page load, API call success/failure, notification
viewed) is logged via the reusable Log() middleware to the evaluation server.