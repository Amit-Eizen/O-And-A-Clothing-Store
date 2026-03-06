import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface DescriptionTabProps {
    description: string;
    features: string[];
}

const DescriptionTab = ({ description, features }: DescriptionTabProps) => {
    return (
        <Box sx={{ py: 3 }}>
            <Typography sx={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>
                {description}
            </Typography>

            {features.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
                        Features
                    </Typography>
                    <List disablePadding>
                        {features.map((feature) => (
                            <ListItem key={feature} disablePadding sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckIcon sx={{ fontSize: 18, color: "#c8a951" }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: 14, color: "#666" }}>
                                            {feature}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default DescriptionTab;
