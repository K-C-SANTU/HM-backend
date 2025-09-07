import { Response } from 'express';

export const sendErrorResponse = (res: Response, status: number, message: string) => {
  res.status(status).json({ error: message });
};