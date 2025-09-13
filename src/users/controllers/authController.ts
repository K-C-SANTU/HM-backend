import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils";
import { sendErrorResponse } from "../utils/errorUtils";
import { RegisterRequest, LoginRequest } from "../../types";

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return sendErrorResponse(res, 400, "All fields are required");
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(res, 400, "User already exists");
        }

        const hashedPassword = await hashPassword(password);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        const token = generateToken({ userId: user._id as string });
        res.status(201).json({ message: "User registered", token });
    } catch (error) {
        sendErrorResponse(res, 500, "Server error");
    }
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return sendErrorResponse(res, 400, "Email and password are required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        const token = generateToken({ userId: user._id as string });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        sendErrorResponse(res, 500, "Server error");
    }
};
