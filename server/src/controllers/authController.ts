import {Request, Response} from 'express';
import authService from '../services/authService';

const sendError = (code: number, message: string, res: Response) => {
    res.status(code).json({ message });
};

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, address, phoneNumber } = req.body;
        const tokens = await authService.register(username, email, password, address, phoneNumber);
        res.status(201).json(tokens);
    } catch (error: any) {
        return sendError(400, error, res);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const tokens = await authService.login(email, password);
        res.status(200).json(tokens);
    } catch (error: any) {
        return sendError(401, error, res);
    }
};  

const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.logout(refreshToken);
        res.status(200).json(result);
    } catch (error: any) {
        return sendError(401, error, res);
    }
};

const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshToken(refreshToken);
        res.status(200).json(tokens);
    } catch (error: any) {
        return sendError(401, error, res);
    }
};

const googleLogin = async (req: Request, res: Response) => {
    try {
        const { credential } = req.body;
        const tokens = await authService.googleLogin(credential);
        res.status(200).json(tokens);
    } catch (error: any) {
        return sendError(401, error, res);
    }
};

export default {
    register,
    login,
    logout,
    refreshToken,
    googleLogin
};