import { Box, Typography } from "@mui/material";

interface ColorSelectorProps {
    colors: { name: string; value: string }[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}

const ColorSelector = ({ colors, selectedColor, onColorChange }: ColorSelectorProps) => {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: 12,
                    letterSpacing: 1.5,
                    color: "#999",
                    mb: 1.5,
                }}
            >
                COLOR
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
                {colors.map((color) => (
                    <Box
                        key={color.name}
                        onClick={() => onColorChange(color.name)}
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: color.value,
                            cursor: "pointer",
                            border: selectedColor === color.name
                                ? "2px solid #c8a951"
                                : "2px solid #ddd",
                            outline: selectedColor === color.name
                                ? "2px solid #c8a951"
                                : "none",
                            outlineOffset: 2,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default ColorSelector;
