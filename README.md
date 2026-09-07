# PrepTrack AI

PrepTrack AI is a full-stack career preparation platform designed for students and job seekers preparing for software engineering roles. It combines interview practice, revision tracking, goal management, resume optimization, and placement monitoring into a single dashboard.

The platform helps candidates stay consistent with their preparation by tracking DSA performance, revising problems with spaced repetition, monitoring application pipelines, and using AI-powered insights to improve resume quality and interview readiness.

## Overview

PrepTrack AI brings together the following core workflows:

- DSA problem tracking and progress monitoring
- Intelligent revision and retention planning
- Goal-based preparation tracking
- Placement application progress monitoring
- Resume ATS analysis with AI feedback
- Candidate profile and progress insights
- Secure authentication and user-specific dashboards

## Key Features

### 1. Smart Preparation Dashboard
The dashboard provides an at-a-glance summary of:

- DSA questions solved and in progress
- Revision tasks due today
- Total active applications
- Goal completion progress
- Topic mastery overview
- Recent activity tracking

### 2. DSA Practice Management
Users can:

- Browse interview-style questions
- Track solution progress and difficulty levels
- View detailed question information
- Maintain notes and revision history

### 3. Revision Center
The revision system promotes long-term retention using a structured review cycle, helping users revisit topics at the right time instead of relying on random repetition.

### 4. Placement Tracker
Candidates can manage their job search pipeline by tracking:

- Applications sent
- Interview stages
- Offers received
- Company and role progress

### 5. AI-Powered Resume Analyzer
Using Gemini-based analysis, the resume module evaluates ATS compatibility and highlights improvements for better job match outcomes.

### 6. Goal and Insight Tracking
Users can set personal preparation goals and view actionable insights generated from their learning and application progress.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript/JSX
- Modern responsive UI components

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- File upload handling for resume processing

### AI and Parsing
- Google Gemini API
- PDF parsing
- DOCX support via Mammoth

## Project Structure

```text
preptrack_AI/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .env
├── package.json
├── server.js
├── README.md
└── metadata.json
```

## Architecture

This project uses a full-stack architecture with:

- A React frontend for the user interface
- A Node/Express API for business logic and data access
- MongoDB for persistent storage
- Gemini integration for AI-powered resume and insight analysis
- A unified root server for local development and production serving

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas connection
- Gemini API key

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd preptrack_AI
npm install
npm run install:all
```

### Environment Variables

Create environment variables for both the root app and backend service.

#### Root or backend environment example

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/preptrack
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

> Note: The project is configured to look for environment files in the root and backend directories depending on how it is launched.

## Running the Application

### Development mode

Run the full stack app from the project root:

```bash
npm run dev
```

This starts the main server and serves the frontend through the app shell.

### Backend only

```bash
npm run dev:api
```

### Frontend only

```bash
cd frontend
npm run dev
```

## Production Build

Build the frontend and bundle the app for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Core API Routes

The backend exposes API endpoints under the `/api` prefix, including:

- `/api/auth` — login and registration
- `/api/questions` — question bank and problem data
- `/api/revisions` — revision tracking
- `/api/placements` — job/application tracking
- `/api/goals` — goal management
- `/api/dashboard` — dashboard insights
- `/api/insights` — AI and performance insights
- `/api/resume` — resume analysis
- `/api/profile` — user profile management

## Use Cases

PrepTrack AI is ideal for:

- Computer science students preparing for coding interviews
- Job seekers tracking interview readiness
- Career-focused learners managing structured preparation
- Users who want an organized system that combines study, application tracking, and resume feedback

## Future Enhancements

Potential improvements for the project include:

- Interview simulation and mock question scoring
- Calendar-based study reminders
- Company-specific job preparation roadmaps
- More advanced analytics and forecasting
- Improved AI-generated improvement recommendations

## Contributing

Contributions are welcome. If you would like to improve the platform:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

## License

This project does not currently include a license file. If you intend to distribute or publish it publicly, it is recommended to add an appropriate open-source license before release.

## Contact

For questions or collaboration opportunities, please contact the project maintainer or repository owner.
