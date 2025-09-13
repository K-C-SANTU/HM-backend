import { JwtPayload as JwtPayloadBase } from "jsonwebtoken";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface JwtPayload extends JwtPayloadBase {
    userId: string;
}
