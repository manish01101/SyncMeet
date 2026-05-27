# SyncMeet

SyncMeet is a modern, enterprise-ready, peer-to-peer video conferencing application built from scratch. It leverages Next.js (App Router) for a lightning-fast, SEO-optimized frontend, WebRTC for ultra-low latency real-time video/audio streaming, and a lightweight Node.js WebSocket backend for connection signaling.

The project features a beautiful landing page styled with the **Bricolage Grotesque** font and a dynamic gallery layout that automatically scales based on the number of participants in a room.

---

## Key Features

- **Zero Friction:** No downloads, no plugins, and no user accounts required to test. Join or create rooms instantly directly from the browser.
- **Dynamic Gallery Grid Layout:** Automatically calculates screen spaces. Splits 50/50 for two participants, transitions to a 2x2 grid for 3–4 participants, and automatically adjusts for larger groups.
- **Architectural Cleanliness:** Fully modular design utilizing decoupled custom React hooks (`useLocalMedia` and `useRoomSignaling`) separating network orchestration from UI execution.
- **Safe Stream Rendering:** Prevents common HTML5 video `AbortError` race conditions using safe `srcObject` stream state matching.
- **End-to-End Encrypted Architecture:** Media streams are transmitted securely using peer-to-peer DTLS-SRTP encryption protocols.

---

## Tech Stack

- **Frontend Framework:** Next.js 16+ (App Router, Client Components, Server-Side Font Optimization)
- **Real-time Media:** Browser WebRTC API (`RTCPeerConnection`, `navigator.mediaDevices`)
- **Signaling Transport:** Native WebSockets via Node.js `ws` library
- **Styling:** Tailwind CSS (Fully responsive layout)
- **Icons:** Lucide React
- **Language:** TypeScript & JavaScript

---
