import { useEffect, useState, useRef } from "react";
import { Box, Typography, TextField, Button, Avatar, Grid } from "@mui/material";
import apiClient from "../../services/api-client";

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    address?: {
        street?: string;
        city?: string;
        zipCode?: string;
        country?: string;
    };
}

const AccountSettingsSection = ({ onProfileUpdate }: { onProfileUpdate: () => void }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        apiClient.get("/users/profile")
            .then((res) => {
                const data = res.data;
                setUser(data);
                setUsername(data.username || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
                setStreet(data.address?.street || "");
                setCity(data.address?.city || "");
                setZipCode(data.address?.zipCode || "");
                setCountry(data.address?.country || "");
            })
            .catch((err) => console.error("Failed to fetch user profile:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("phoneNumber", phoneNumber);

            const address = JSON.stringify({ street, city, zipCode, country });
            formData.append("address", address);

            if (profileImageFile) {
                formData.append("profileImage", profileImageFile);
            }

            const res = await apiClient.put("/users/profile", formData);
            setUser(res.data);
            setMessage("Profile updated successfully!");
            setProfileImageFile(null);
            onProfileUpdate();
            setTimeout(() => setMessage(""), 1000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    const avatarSrc = previewUrl || (user?.profileImage ? `${apiClient.defaults.baseURL}${user.profileImage}` : "");

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1.5, fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}>
                Account Settings
            </Typography>
            <Typography sx={{ mb: 3 }} color="text.secondary">
                Manage your personal information
            </Typography>

            {/* Profile Image */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                <Avatar
                    src={avatarSrc}
                    sx={{ width: 80, height: 80, fontSize: 32, bgcolor: "#c8a951" }}
                >
                    {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ color: "#000", borderColor: "#ddd", textTransform: "none", fontSize: 13 }}
                    >
                        Upload New Photo
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Box>
            </Box>

            {/* Personal Info */}
            <Typography fontWeight="bold" sx={{ mb: 2 }}>Personal Information</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </Grid>
            </Grid>

            {/* Shipping Address */}
            <Typography fontWeight="bold" sx={{ mb: 2 }}>Shipping Address</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </Grid>
            </Grid>

            {/* Save Button */}
            {message && (
                <Typography sx={{ mb: 2, color: message.includes("success") ? "green" : "red" }}>
                    {message}
                </Typography>
            )}
            <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: "#c8a951",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: 1,
                    "&:hover": { backgroundColor: "#b8993e" },
                }}
            >
                {saving ? "SAVING..." : "SAVE CHANGES"}
            </Button>
        </Box>
    );
};

export default AccountSettingsSection;