import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './backend/config/db.js';
import { initializeData } from './backend/services/dbStore.js';
import { createApiApp } from './backend/server.js';
import { errorHandler, notFound } from './backend/middleware/errorMiddleware.js';

const projectRoot = path.basename(process.cwd()).toLowerCase() === 'backend'
  ? path.resolve(process.cwd(), '..')
  : process.cwd();

const frontendRoot = path.join(projectRoot, 'frontend');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Connect to Database and seed questions
  await connectDB();
  await initializeData();

  // Mount the shared API before the frontend middleware.
  app.use(createApiApp({ includeErrorHandlers: false }));

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: frontendRoot,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(frontendRoot, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handlers
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PrepTrack full-stack Backend server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
