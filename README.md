<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# PrepTrack AI

PrepTrack is a full-stack interview preparation app with a React frontend and an Express API.

View your app in AI Studio: https://ai.studio/apps/6826c2ad-b88e-4e1e-a6b3-b5331029bb20

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm run install:all`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` if you want AI-powered resume analysis. The app uses an in-memory store when `MONGO_URI` is empty.
3. Run the app:
   `npm run dev`

Open http://localhost:3000. The same server provides the API and frontend in development. For a production build, run `npm run build` and then `npm start`.
