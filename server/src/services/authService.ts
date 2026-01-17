import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/userModel';

type GeneratedTokens = {
    token: string;
    refreshToken: string;
};

const generateTokens = (userId: string): GeneratedTokens => {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN!);
    const token = jwt.sign(
        { _id: userId },
        secret,
        { expiresIn: expiresIn }
    );

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
    const refreshExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!);
    const rand = Math.floor(Math.random() * 1000);
    const refreshToken = jwt.sign(
        { _id: userId, rand },
        refreshSecret,
        { expiresIn: refreshExpiresIn }
    );
    return { token, refreshToken };
};

const register = async (username: string, email: string, password: string, address: object, phoneNumber: string) => {
    const existingUser = await user.findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
        throw new Error('Username or email already in use');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new user({
            "username": username,
            "email": email,
            "password": hashedPassword,
            "address": address,
            "phoneNumber": phoneNumber
        });

        const tokens = generateTokens(newUser._id.toString());
        newUser.refreshToken.push(tokens.refreshToken);
        await newUser.save();
        return tokens;
    }
    catch (error) {
        throw new Error('Error registering user: ' + error);
    }
};

const login = async (email: string, password: string): Promise<GeneratedTokens> => {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
        throw new Error('Invalid email or password');
    }
    try {
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const tokens = generateTokens(existingUser._id.toString());
        existingUser.refreshToken.push(tokens.refreshToken);
        await existingUser.save();
        return tokens;
    }
    catch (error) {
        throw new Error('Error logging in: ' + error);
    }
};

const logout = async (refreshToken: string) => {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
    try {
        const userPayload: any = jwt.verify(refreshToken, refreshSecret);
        const existingUser = await user.findById(userPayload._id);

        if (!existingUser) {
            throw new Error('Invalid refresh token');
        }

        if (!existingUser.refreshToken.includes(refreshToken)) {
            existingUser.refreshToken = [];
            await existingUser.save();
            console.log("**** Possible token theft detected for user ID: " + existingUser._id);
            throw new Error('Invalid refresh token');
        }
        
        existingUser.refreshToken = existingUser.refreshToken.filter(
            (token) => token !== refreshToken
        );
        await existingUser.save();
        return { message: 'Logged out successfully', success: true } ;
    }
    catch (error) {
        throw new Error('Error logging out: ' + error);
    }
};

// refresh token function to be implemented
const refreshToken = async (oldRefreshToken: string): Promise<GeneratedTokens> => {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
    try {
        const userPayload: any = jwt.verify(oldRefreshToken, refreshSecret);
        const existingUser = await user.findById(userPayload._id);
        if (!existingUser) {
            throw new Error('Invalid refresh token');
        }

        if (!existingUser.refreshToken.includes(oldRefreshToken)) {
            existingUser.refreshToken = [];
            await existingUser.save();
            console.log("**** Possible token theft detected for user ID: " + existingUser._id);
            throw new Error('Invalid refresh token');
        }

        const tokens = generateTokens(existingUser._id.toString());
        existingUser.refreshToken = existingUser.refreshToken.filter(
            (token) => token !== oldRefreshToken
        );
        existingUser.refreshToken.push(tokens.refreshToken);
        await existingUser.save();
        return tokens;
    }
    catch (error) {
        throw new Error('Error refreshing token: ' + error);
    }
};

const googleLogin = async (credential: string): Promise<GeneratedTokens> => {
    try {
        // Verify Google credential and extract user info (pseudo-code)
        const respose = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const googleUser = await respose.json();
        if (!googleUser.email) {
            throw new Error('Invalid Google token');
        }

        let existingUser = await user.findOne({ email: googleUser.email });
        if (!existingUser) {
            existingUser = await user.create({
                "username": googleUser.name || googleUser.email.split('@')[0],
                "email": googleUser.email,
                "password": 'google-auth-'+ Math.random().toString(36),
                "profileImage": googleUser.picture,
            });
        }
        const tokens = generateTokens(existingUser._id.toString());
        existingUser.refreshToken.push(tokens.refreshToken);
        await existingUser.save();
        return tokens;
    }
    catch (error) {
        throw new Error('Error with Google login: ' + error);
    }
};      

export default {
    register,
    login,
    logout,
    refreshToken,
    googleLogin
};