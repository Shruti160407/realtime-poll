# 🗳 Real-Time Poll Application

A full-stack real-time polling application built using **Next.js (App Router)**, **PostgreSQL (Neon)**, **Prisma ORM**, and **Pusher**.

The app allows users to create polls, share them via a public link, and vote in real time with built-in fairness mechanisms.

---

## 🔗 Public URL

**Live App:**  
https://realtime-poll-zeta.vercel.app  

**GitHub Repository:**  
https://github.com/Shruti160407/realtime-poll  

---

# ✅ Core Features

## 1️⃣ Poll Creation

- Users can create a poll with:
  - A question
  - At least 2 options
- After creation, a unique shareable link is generated:
/poll/{pollId}

- A built-in **Copy Link / Share** button allows easy sharing.

---

## 2️⃣ Join by Link

- Anyone with the link can:
- View the poll
- Vote on one option (single-choice)
- No authentication required.
- Fully accessible via public URL.

---

## 3️⃣ Real-Time Voting

- Built using **Pusher**.
- Vote updates are reflected instantly for all connected users.
- No page refresh required.

---

# 🛡 Fairness / Anti-Abuse Mechanisms

The system includes **two fairness controls** to reduce repeat or abusive voting.

---

##  1. Composite Unique Constraint (Database-Level Protection)

A composite unique constraint is applied in the Prisma schema:

```prisma
@@unique([pollId, voterId])
```
##  1. Rate Limiting (2-Second Cooldown for Vote Switching)

Users are allowed to change their vote
A 2-second cooldown is enforced between vote changes.


Edge Cases Handled

The application handles the following scenarios:

✅ Missing required fields (pollId, optionId, voterId)

✅ Invalid poll ID (poll not found)

✅ Duplicate vote attempts

✅ Rapid vote switching (rate limit applied)

✅ Page refresh (data persists)

✅ Direct link access

✅ Simultaneous users (real-time sync works correctly)

Known Limitations

Voter identity is based on a generated voterId stored in localStorage.

If a user clears storage or switches devices, they can vote again.

Stronger identity mechanisms (authentication or IP hashing) could improve this.

Rate limiting is time-based only.

More advanced protection could include:

IP-based throttling

CAPTCHA

Bot detection

JWT-based authentication

No poll expiration feature.

Future improvement: add poll start/end time.

Persistence

Polls and votes are stored in PostgreSQL (Neon).

Refreshing the page does not remove data.

Share links remain valid over time.

Data persists across sessions.

⚙️ Tech Stack

Frontend: Next.js 16 (App Router)

Backend: Next.js API Routes

Database: PostgreSQL (Neon)

ORM: Prisma

Real-Time: Pusher

Deployment: Vercel

Running Locally

Clone the repository:

git clone https://github.com/Shruti160407/realtime-poll.git
cd realtime-poll


Install dependencies:

npm install


Create a .env.local file and add:

DATABASE_URL=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=


Generate Prisma client:

npx prisma generate


Run the development server:

npm run dev

  
