import { useState } from "react";
import { Typography, TextField, Checkbox, FormControlLabel,
  IconButton, InputAdornment, Link } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthForm from "./AuthForm";

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        phoneNumber?: string;
        password?: string;
        confirmPassword?: string;
        agreeToTerms?: string;
    }>({});
    
    const validate = () => {
        const newErrors: typeof errors = {};
        if (!username) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleRegister = () => {
        if (!validate()) return;
        console.log("Registering with:", { username, email, phoneNumber, password });
    };

    return (
        <AuthForm
            submitText="Create Account"
            onFormSubmit={handleRegister}
            switchText="Already have an account?"
            switchLinkText="Sign In"
            onSwitchForm={onSwitchToLogin}
        >
            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Username</Typography>
            <TextField 
                fullWidth placeholder="Enter your username" 
                size="small" value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                error={!!errors.username}
                helperText={errors.username}
                sx={{ mb: 2 }} 
            />

            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Email</Typography>
            <TextField 
                fullWidth placeholder="Enter your email" 
                size="small" value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                error={!!errors.email} 
                helperText={errors.email} 
                sx={{ mb: 2 }} 
            />

            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Phone Number</Typography>
            <TextField 
                fullWidth placeholder="+972 50 123 4567" 
                size="small" value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                error={!!errors.phoneNumber} 
                helperText={errors.phoneNumber} 
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
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb:2 }}
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

            <Typography fontWeight="bold" sx={{mb:1, mt:1}}>Confirm Password</Typography>
            <TextField 
                fullWidth placeholder="Confirm your password" 
                type= "password" size="small"  
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                error={!!errors.confirmPassword} 
                helperText={errors.confirmPassword} 
                sx={{ mb: 2 }} 
            />

            <FormControlLabel
                control={<Checkbox size="small" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)}  />}
                label={
                    <Typography variant="body2">
                        I agree to the <Link sx={{ color: "#c8a951" }}>Terms of Service</Link> and <Link sx={{ color: "#c8a951" }}>Privacy Policy</Link>
                    </Typography>
                }
            />
            {errors.agreeToTerms && (
                <Typography color="error" variant="caption" sx={{ display: "block", mb: 2 }}>
                    {errors.agreeToTerms}
                </Typography>
            )}
        </AuthForm>
    );
};

export default RegisterForm;