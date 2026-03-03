import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const Testimonial = () => {
    return (
        <Box sx={{ py: 10, maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, textAlign: "center", backgroundColor: "#f9f9f9" }}>
            {/* Stars */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, mb: 3 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} sx={{ color: "#c8a951", fontSize: 24 }} />
                ))}
            </Box>

            {/* Quote */}
            <Typography
                sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: 18, md: 22 },
                    maxWidth: 700,
                    mx: "auto",
                    mb: 3,
                    lineHeight: 1.6,
                }}
            >
                "O&A delivers clothing at the highest level of quality and precision, crafted specifically for their customers. Once you start wearing O&A, you simply can't go back."
            </Typography>

            {/* Author */}
            <Typography sx={{ fontSize: 13 }}>
                <strong>Amit Eizenberg and Ofri Hamou</strong>
                <span style={{ color: "#c8a951" }}> — Fashion Editor, Vogue</span>
            </Typography>
        </Box>
    );
};

export default Testimonial;