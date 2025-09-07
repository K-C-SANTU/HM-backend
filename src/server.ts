import express, { Application } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './users/routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: '*' })); // Allow all origins; restrict as needed
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => res.send('Hotel Management Backend Running'));

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server with async DB connection
async function startServer() {
  try {
    await prisma.$connect(); // Connect to MongoDB
    console.log('MongoDB connected via Prisma');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1); // Exit on connection failure
  }
}

startServer();