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
    Button,
    TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllAdmins, getAuthToken } from '../../lib/api';
import AdminNavbar from '../Navbar/AdminNavbar';
import AdminRegistrationForm from './AdminRegistrationForm'; // Import the new form component

// Styled components (no changes here)
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StatusChip = styled(Chip)(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.success.light : theme.palette.error.light,
    color: active ? theme.palette.success.contrastText : theme.palette.error.contrastText,
    fontWeight: 'bold',
}));

const AdminData = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    
    // Moved the fetch logic into a memoized function for reuse
    const fetchAdmins = async () => {
        const token = getAuthToken('admin');
        if (!token) {
            setError("Authentication required. Please log in as an admin.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getAllAdmins(token);

            if (response.success && response.data) {
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

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleRegistrationSuccess = () => {
        // When a new admin is added, close the form and refetch the data
        setShowRegisterForm(false);
        fetchAdmins();
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading Admin Data...
                </Typography>
            </Box>
        );
    }

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.id?.toString().includes(searchTerm)
    );

    return (
        <>
            <AdminNavbar />

            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h4" component="h1">
                        Administrator Accounts
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowRegisterForm(true)} // This opens the modal
                    >
                        Add New Admin
                    </Button>
                </Box>

                <TextField
                    label="Search Admins"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

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
                            {filteredAdmins.map((admin) => (
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
                                            color={admin.role === 'super_admin' ? 'secondary' : 'primary'}
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

                {filteredAdmins.length === 0 && !loading && !error && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            No administrator accounts found.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Render the registration form modal */}
            <AdminRegistrationForm
                open={showRegisterForm}
                onClose={() => setShowRegisterForm(false)}
                onSuccess={handleRegistrationSuccess}
            />
        </>
    );
};

export default AdminData;
