import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";
import { sendErrorResponse } from "../utils/errorUtils";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) {
        return sendErrorResponse(res, 401, "No token provided");
    }

    try {
        const decoded = verifyToken(token);
        (req as any).userId = decoded.userId; // Attach userId to req
        next();
    } catch (error) {
        sendErrorResponse(res, 401, "Invalid token");
    }
};
