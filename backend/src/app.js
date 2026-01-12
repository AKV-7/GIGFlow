import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security
app.use(helmet());
app.use(mongoSanitize()); // Prevents NoSQL injection

// Rate limiting - prevents brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import bidRoutes from './routes/bids.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.get('/', (req, res) => res.send('GigFlow API Running'));

// Health check endpoint for load balancers/deployment
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error Handler
app.use(errorHandler);

export default app;
