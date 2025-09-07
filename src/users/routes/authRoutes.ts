import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../middleware/joiValidationMiddleware';

const router = express.Router();

// Rate limiter: max 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

router.post('/register', limiter, validate(registerSchema), register);
router.post('/login', limiter, validate(loginSchema), login);

export default router;