import { Box, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface OwnerActionsProps {
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

const OwnerActions = ({ isOwner, onEdit, onDelete }: OwnerActionsProps) => {
    if (!isOwner) return null;

    return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <EditOutlinedIcon sx={{ fontSize: 16, color: "#999"}} />  
            </IconButton>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <DeleteOutlineIcon sx={{ fontSize: 16, color: "#999" }} />
            </IconButton>
        </Box>
    );
};

export default OwnerActions;