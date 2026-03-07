import { Box, Typography, Chip, InputBase, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";

interface AIStyleSectionProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: (query: string) => void;
    isLoading: boolean;
    hasSearched: boolean;
}

const suggestions = [
    "Summer vacation outfits",
    "Business casual for women",
    "Wedding guest dresses",
    "Minimalist wardrobe essentials",
    "Date night outfit ideas",
];

const AIStyleSection = ({ query, onQueryChange, onSearch, isLoading, hasSearched }: AIStyleSectionProps) => {
    const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        onSearch(query);
    }
};

const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    onSearch(suggestion);
};

return (
     <Box sx={{ backgroundColor: "#faf8f4", py: 8, textAlign: "center" }}>
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
                {/* Badge */}
                <Chip
                    icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: "#c8a951 !important" }} />}
                    label="AI-Powered Virtual Stylist"
                    sx={{
                        backgroundColor: "rgba(200, 169, 81, 0.1)",
                        color: "#c8a951",
                        fontWeight: 600,
                        fontSize: 13,
                        mb: 3,
                        height: 32,
                    }}
                />

                {/* Title */}
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 400,
                        fontSize: { xs: 32, md: 42 },
                        mb: 2,
                    }}
                >
                    Your Personal Fashion Assistant
                </Typography>

                {/* Subtitle */}
                <Typography sx={{ color: "#999", fontSize: 15, mb: 4, maxWidth: 500, mx: "auto" }}>
                    Describe your style, occasion, or preferences, and let our AI stylist curate the perfect outfit for you.
                </Typography>

                {/* Search Bar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: 650,
                        mx: "auto",
                        backgroundColor: "#fff",
                        borderRadius: 50,
                        px: 2.5,
                        py: 0.5,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                >
                    <SearchIcon sx={{ color: "#999", mr: 1.5 }} />
                    <InputBase
                        fullWidth
                        placeholder="e.g., 'Elegant outfit for a summer wedding'"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onKeyDown={handleEnterPress}
                        sx={{ fontSize: 14, py: 1 }}
                    />
                    <Button
                    onClick={() => onSearch(query)}
                        disabled={isLoading}
                        sx={{
                            backgroundColor: "#c8a951",
                            color: "#fff",
                            borderRadius: 50,
                            px: 3,
                            py: 1,
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: "none",
                            minWidth: 90,
                            "&:hover": { backgroundColor: "#b8993e" },
                        }}
                    >
                        {isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Search"}
                    </Button>
                </Box>

                {/* Suggestions + How It Works — hidden after search */}
                {!hasSearched && (
                    <>
                        {/* Suggestion Chips */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: 13, color: "#999" }}>Try:</Typography>
                            {suggestions.map((suggestion) => (
                                <Chip
                                    key={suggestion}
                                    label={suggestion}
                                    variant="outlined"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    sx={{
                                        borderColor: "#ddd",
                                        color: "#666",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        "&:hover": { borderColor: "#c8a951", color: "#c8a951" },
                                    }}
                                />
                            ))}
                        </Box>

                        {/* How It Works */}
                        <Box sx={{ mt: 10 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 400,
                                    fontSize: 28,
                                    mb: 6,
                                }}
                            >
                                How It Works
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 4, md: 10 }, flexWrap: "wrap" }}>
                                {[
                                    { icon: <SearchIcon sx={{ fontSize: 28, color: "#c8a951" }} />, title: "Describe Your Style", text: "Tell us about the occasion, your preferences, or the look you're going for" },
                                    { icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: "#c8a951" }} />, title: "AI Curates Outfits", text: "Our AI analyzes thousands of combinations to find the perfect match" },
                                    { icon: <AddIcon sx={{ fontSize: 28, color: "#c8a951" }} />, title: "Shop the Look", text: "Add individual items or the complete outfit to your cart with one click" },
                                ].map((step) => (
                                    <Box key={step.title} sx={{ maxWidth: 250, textAlign: "center" }}>
                                        <Box sx={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "rgba(200, 169, 81, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                                            {step.icon}
                                        </Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 1 }}>
                                            {step.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                                            {step.text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AIStyleSection;