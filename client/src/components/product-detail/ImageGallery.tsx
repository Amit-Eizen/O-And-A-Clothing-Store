import { useState } from "react";
import { Box, Dialog } from "@mui/material";

interface ImageGalleryProps {
    images: { src: string; alt: string }[];
    selectedIndex: number;
    onSelectIndex: (index: number) => void;
}

const ImageGallery = ({ images, selectedIndex, onSelectIndex }: ImageGalleryProps) => {
    const [fullImageOpen, setFullImageOpen] = useState(false);
    return (
        <Box>
            {/* Main Image */}
            <Box
                component="img"
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                onClick={() => setFullImageOpen(true)}
                sx={{
                    width: "90%",
                    height: 650,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                }}
            />

            {/* Thumbnails */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                {images.map((image, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={image.src}
                        alt={image.alt}
                        onClick={() => onSelectIndex(index)}
                        sx={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                            border: selectedIndex === index
                                ? "2px solid #c8a951"
                                : "2px solid transparent",
                            opacity: selectedIndex === index ? 1 : 0.7,
                            "&:hover": {
                                opacity: 1,
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Full Image Dialog */}
            <Dialog
                open={fullImageOpen}
                onClose={() => setFullImageOpen(false)}
                maxWidth="lg"
            >
                <Box
                    component="img"
                    src={images[selectedIndex].src}
                    alt={images[selectedIndex].alt}
                    sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
                />
            </Dialog>
        </Box>
    );
};

export default ImageGallery;