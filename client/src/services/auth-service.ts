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

/* export const authService = {
    login: (user: IUser) =>
        apiClient.post('/login', { email: user.email, password: user.password }),

    register: (data: { user : IUser}) => 
        apiClient.post('/register', data)
}; */

export const loginUser = (user: IUser) => {
    apiClient.post('/login', { email: user.email, password: user.password });
}

export const registerUser = (data: { user : IUser}) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user with data:", data);
        apiClient.post('/register', data).then(response => {
            console.log(response);
            resolve(response.data);
        }).catch(error => {
            console.error("Registration error:", error);
            reject(error);
        })
    })
}

export const googleSignIn = (credentialResponse: CredentialResponse) => {
    return new Promise((resolve, reject) => {
        console.log("Google login successful");
        apiClient.post('/google', credentialResponse).then(response => {
            console.log(response);
            resolve(response.data);
        }).catch(error => {
            console.error("Google login error:", error);
            reject(error);
        })
    })
}
