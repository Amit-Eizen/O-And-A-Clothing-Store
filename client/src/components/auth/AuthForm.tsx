import type { ReactNode } from "react";
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

const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
  console.log("Google login successful:", credentialResponse);
    try {
        const res = await googleSignIn(credentialResponse);
        console.log("Google sign in response:", res);
    } catch (error) {
        console.error("Google sign in error:", error);
    }
}

const onGoogleLoginFailure = () => {
  console.log("Google login failed");
}

const AuthForm = ({ children, submitText, onFormSubmit, switchText, switchLinkText, onSwitchForm }: AuthFormProps) => {
  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }}>
        {children}  
        <Button fullWidth variant="contained" onClick={onFormSubmit} sx={{ bgcolor: "#000", color: "#fff", py: 1.5, mb: 2, "&:hover": { bgcolor: "#333" } }}>
          {submitText}
        </Button>   
        <Divider sx={{ my: 2 }}>OR</Divider>    
        {/* <Button fullWidth variant="outlined" sx={{ py: 1.2, mb: 3, color: "#000", borderColor: "#e0e0e0" }}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 17, height: 17, marginRight: 8 }}
          />
          Continue with Google
        </Button> */}

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
