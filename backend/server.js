import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { connectDB } from './config/db.js';
import { initializeData } from './services/dbStore.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import revisionRoutes from './routes/revisionRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const projectRoot = path.basename(process.cwd()).toLowerCase() === 'backend'
  ? path.resolve(process.cwd(), '..')
  : process.cwd();
const backendRoot = path.join(projectRoot, 'backend');

dotenv.config({ path: path.join(projectRoot, '.env') });
dotenv.config({ path: path.join(backendRoot, '.env') });

export const createApiApp = ({ includeErrorHandlers = true } = {}) => {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'PrepTrack API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/revisions', revisionRoutes);
  app.use('/api/placements', placementRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/insights', insightRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/profile', profileRoutes);

  if (includeErrorHandlers) {
    app.use(notFound);
    app.use(errorHandler);
  }

  return app;
};

const startServer = async () => {
  const port = Number(process.env.PORT) || 3000;

  await connectDB();
  await initializeData();

  const app = createApiApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`PrepTrack API server running on http://localhost:${port}`);
  });
};

const isBackendEntryPoint = process.argv[1]
  && path.basename(process.argv[1]) === 'server.js'
  && path.basename(path.dirname(process.argv[1])).toLowerCase() === 'backend';

if (isBackendEntryPoint) {
  startServer().catch((error) => {
    console.error('Failed to start API server:', error);
    process.exitCode = 1;
  });
}