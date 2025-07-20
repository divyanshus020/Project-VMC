import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// Assuming these functions exist in your api.js file
import { getAllAdmins, getAuthToken } from '../../lib/api';
import AdminNavbar from '../Navbar/AdminNavbar';

// Styled components for a professional table appearance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${'MuiTableCell-head'}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    [`&.${'MuiTableCell-body'}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // Hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// A custom Chip component to visually represent the admin's status
const StatusChip = styled(Chip)(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.success.light : theme.palette.error.light,
    color: active ? theme.palette.success.contrastText : theme.palette.error.contrastText,
    fontWeight: 'bold',
}));

const AdminData = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            const token = getAuthToken('admin'); // Get the admin token
            if (!token) {
                setError("Authentication required. Please log in as an admin.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getAllAdmins(token);

                // **FIX:** The API response is nested. We need to look inside `response.data`
                // for the actual array of admins.
                if (response.success && response.data) {
                    // The actual array might be in a key called 'admins' or 'data' depending on the controller
                    const adminList = response.data.admins || response.data.data || response.data;

                    if (Array.isArray(adminList)) {
                        setAdmins(adminList);
                        setError(null);
                    } else {
                        setError("Invalid data format received from server.");
                        setAdmins([]);
                    }
                } else {
                    setError(response.error || "Failed to fetch admin data.");
                    setAdmins([]);
                }
            } catch (err) {
                console.error("Exception fetching admins:", err);
                setError("An error occurred while fetching admin data. Please try again.");
                setAdmins([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []); // The empty dependency array ensures this runs once on mount

    // Display a loading spinner while data is being fetched
    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading Admin Data...
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AdminNavbar />

            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Administrator Accounts
                </Typography>

                {/* Display an error message if something went wrong */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* The TableContainer makes the table scroll horizontally on small screens */}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="admins table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Admin ID</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Role</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin) => (
                                <StyledTableRow key={admin.id}>
                                    <StyledTableCell component="th" scope="row">
                                        <Typography variant="body2" fontWeight="bold">
                                            {admin.id}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>{admin.name || 'N/A'}</StyledTableCell>
                                    <StyledTableCell>{admin.email}</StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={admin.role || 'Admin'}
                                            color={admin.role === 'superadmin' ? 'secondary' : 'primary'}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <StatusChip
                                            label={admin.isActive ? 'Active' : 'Inactive'}
                                            active={admin.isActive}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Display a message if no admins are found */}
                {admins.length === 0 && !loading && !error && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No administrator accounts found.
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default AdminData;
