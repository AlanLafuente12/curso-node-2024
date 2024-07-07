import express from 'express';
import morgan from 'morgan';
import { authenticateToken } from './middlewares/authenticate.middleware.js'

const app = express();

// Import Routes
import usersRoutes from './routes/users.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users/', usersRoutes);
app.use('/api/tasks/', authenticateToken, tasksRoutes);
app.use('/api/login/', authRoutes);

export default app;