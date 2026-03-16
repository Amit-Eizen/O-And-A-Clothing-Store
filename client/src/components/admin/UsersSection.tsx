import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Pagination, Avatar } from "@mui/material";
import { fetchAllUsers } from "../../services/admin-api";
import type { UserFromServer } from "../../services/admin-api";

const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const UsersSection = () => {
    const [users, setUsers] = useState<UserFromServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        setLoading(true);
        fetchAllUsers({ page, limit })
            .then((res) => {
                setUsers(res.data);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={1}>Users</Typography>
            <Typography color="text.secondary" mb={3}>View all registered customers</Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#fafafa" }}>
                            <TableCell sx={{ fontWeight: 700 }}>NAME</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>EMAIL</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>ROLE</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>JOINED</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Avatar sx={{ bgcolor: "#c8a951", width: 36, height: 36, fontSize: 14, fontWeight: 600 }}>
                                            {getInitials(user.username)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>{user.username}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === "admin" ? "error" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
                </Box>
            )}
        </Box>
    );
};

export default UsersSection;
