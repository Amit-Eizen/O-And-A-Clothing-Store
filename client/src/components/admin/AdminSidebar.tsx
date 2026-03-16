import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";

interface AdminSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const menuItems = [
    { key: "stats", label: "Dashboard", icon: <DashboardIcon /> },
    { key: "orders", label: "Orders", icon: <ShoppingCartIcon /> },
    { key: "products", label: "Products", icon: <InventoryIcon /> },
    { key: "users", label: "Users", icon: <PeopleIcon /> },
];

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
    return (
        <Paper sx={{ width: 240, flexShrink: 0 }}>
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.key}
                        selected={activeSection === item.key}
                        onClick={() => onSectionChange(item.key)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
};

export default AdminSidebar;