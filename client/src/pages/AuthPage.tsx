import { useState } from "react";
import { Box, Typography } from "@mui/material";
import authImage from "../assets/auth-image.jpg"; 
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh"}}>
            {/* Left side - image*/}
            <Box sx={{ flex: 1 }}>
                <img
                    src={authImage}
                    alt="Fashion"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Box>

            {/* Right side - form */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: 500, px: 4 }}>
                {/* Logo */}
                <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontFamily: "'Playfair Display', serif" }}>
                  <span style={{ fontWeight: "bold" }}>O&A</span>{" "}
                  <span style={{ color: "#c8a951" }}>Clothes</span>
                </Typography>

                {/* Switch between Login and Register  */}
                <Box sx={{ display: "flex", mb: 4, borderBottom: "1px solid #e0e0e0" }}>
                  <Box
                    sx={{ flex: 1, textAlign: "center", pb: 1, cursor: "pointer", borderBottom: isLogin ? "2px solid #c8a951" : "none" }}
                    onClick={() => setIsLogin(true)}
                  >
                    <Typography fontWeight="bold" color={isLogin ? "text.primary" : "text.secondary"}>Login</Typography>
                  </Box>
                  <Box
                    sx={{ flex: 1, textAlign: "center", pb: 1, cursor: "pointer", borderBottom: !isLogin ? "2px solid #c8a951" : "none" }}
                    onClick={() => setIsLogin(false)}
                  >
                    <Typography fontWeight="bold" color={!isLogin ? "text.primary" : "text.secondary"}>Register</Typography>
                  </Box>
                </Box>

                {/* Form */}
                {isLogin ? <LoginForm onSwitchToRegister={() => setIsLogin(false)} /> : <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />}
                </Box>
            </Box>
        </Box>
    );
}

export default AuthPage;