import { Box, Typography } from "@mui/material";

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string;
    onSizeChange: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) => {
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
                SIZE
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
                {sizes.map((size) => (
                    <Box
                        key={size}
                        onClick={() => onSizeChange(size)}
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1,
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: 500,
                            backgroundColor: selectedSize === size ? "#000" : "transparent",
                            color: selectedSize === size ? "#fff" : "#333",
                            border: selectedSize === size ? "1px solid #000" : "1px solid #ddd",
                            "&:hover": {
                                borderColor: "#000",
                            },
                        }}
                    >
                        {size}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SizeSelector;
