import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import './src/db.js';
import authRouter from './src/routes/auth.js';
import teamsRouter from './src/routes/teams.js';
import projectsRouter from './src/routes/projects.js';
import tasksRouter from './src/routes/tasks.js';
import commentsRouter from './src/routes/comments.js';
import usersRouter from './src/routes/users.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet());
app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(morgan('dev'));

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);

// Serve Angular Frontend Static Files
const frontendPath = path.join(__dirname, '../team-tasks/dist/team-tasks/browser');
app.use(express.static(frontendPath));

// SPA Fallback - לכל בקשה שלא תופסת API, חזור ל-index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on port ${PORT}`);
});
