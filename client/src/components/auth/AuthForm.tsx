import type { ReactNode } from "react";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Typography, Link } from "@mui/material";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { googleSignIn } from "../../services/auth-service";

interface AuthFormProps {
    children: ReactNode;
    submitText: string;
    onFormSubmit: () => void;
    switchText: string;
    switchLinkText: string;
    onSwitchForm: () => void;
}

const AuthForm = ({ children, submitText, onFormSubmit, switchText, switchLinkText, onSwitchForm }: AuthFormProps) => {
    const navigate = useNavigate();
    const { syncAfterLogin } = useCart();

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await googleSignIn(credentialResponse);
            console.log("Google sign in response:", res);
            await syncAfterLogin();
            navigate(-1);
        } catch (error) {
            console.error("Google sign in error:", error);
        }

    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed");
    }

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }}>
            {children}  
            <Button fullWidth variant="contained" onClick={onFormSubmit} sx={{ bgcolor: "#000", color: "#fff", py: 1.5, mb: 2, "&:hover": { bgcolor: "#333" } }}>
                {submitText}
            </Button>   

            <Divider sx={{ my: 2 }}> OR </Divider>    

            {/* Google */}
            <GoogleLogin 
                onSuccess={onGoogleLoginSuccess} 
                onError={onGoogleLoginFailure} 
                width= "450"
            /> 

            <Typography textAlign="center" mt={2}>
                {switchText}{" "}
                <Link onClick={onSwitchForm} sx={{ color: "#c8a951", cursor: "pointer", textDecoration: "none" }}>
                    {switchLinkText}
                </Link>
            </Typography>
        </Box>
    );
};

export default AuthForm;
