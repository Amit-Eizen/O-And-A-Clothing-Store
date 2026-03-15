import type { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";

export interface IUser {
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

export const saveTokenInLocalStorage = (data: { token: string; refreshToken: string; userId: string; username: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);
}

export const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
};

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post('/login', { email, password });
    saveTokenInLocalStorage(response.data);
    return response.data;
};

export const registerUser = async (userData: IUser) => {
    const response = await apiClient.post('/register', userData);
    saveTokenInLocalStorage(response.data);
    return response.data;
}

export const googleSignIn = async (credentialResponse: CredentialResponse) => {
    const response = await apiClient.post('/google', credentialResponse);
    saveTokenInLocalStorage(response.data);
    return response.data;
}

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        await apiClient.post('/logout', { refreshToken });
    }

    clearAuthData();
}