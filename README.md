# icl — I Can't Lie

icl is an anonymous messaging app for sharing honest notes, compliments, confessions, and questions. Create an account, share your profile link, and read messages in your dashboard.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Add these values to `.env.local`:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
RESEND_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

MongoDB, NextAuth, and Resend are used for app data, authentication, and verification emails. The Google AI key enables message suggestions.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
