import { useState } from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel,
    IconButton, InputAdornment, Link } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthForm from "./AuthForm";

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ 
        email?: string; 
        password?: string 
    }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (!validate()) return;

        console.log("Logging in with:", { email, password });
    };
    
    return (
        <AuthForm
            submitText="Login"
            onFormSubmit={handleLogin}
            switchText="Don't have an account?"
            switchLinkText="Register"
            onSwitchForm={onSwitchToRegister}
        >
            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Email</Typography>
            <TextField 
                fullWidth 
                placeholder="Enter your email" 
                size="small" value={email} 
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={!!errors.email} 
                helperText={errors.email}
                sx={{ mb: 2 }} 
            />

            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Password</Typography>
            <TextField
                fullWidth
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb:1 }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
                <Link href="#" sx={{ color: "#c8a951", textDecoration: "none" }}>Forgot Password?</Link>
            </Box>
        </AuthForm>
    );
};

export default LoginForm;