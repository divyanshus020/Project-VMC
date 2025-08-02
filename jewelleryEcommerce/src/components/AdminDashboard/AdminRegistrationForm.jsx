import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Switch,
    FormControlLabel,
    Typography,
    Alert,
    Box,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { createAdmin, getAuthToken, getAdminPermissions } from '../../lib/api';
import { toast } from 'react-toastify';

const AdminRegistrationForm = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'admin',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Get current admin permissions
    const permissions = getAdminPermissions('admin');
    const canCreateSuperAdmin = permissions?.isSuperAdmin || false;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (error) setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please provide a valid email address');
            return false;
        }

        if (!formData.password) {
            setError('Password is required');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const token = getAuthToken('admin');
            if (!token) {
                throw new Error("Authentication token not found. Please login again.");
            }

            // Map role for backend
            const roleForBackend = formData.role === 'super_admin' ? 'superadmin' : 'admin';

            const adminData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: roleForBackend,
                isActive: formData.isActive
            };

            console.log('Creating admin with role:', roleForBackend);

            const response = await createAdmin(adminData, token);
            
            if (response.success) {
                toast.success(`Admin "${formData.name || formData.email}" created successfully!`);
                
                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    name: '',
                    role: 'admin',
                    isActive: true
                });
                
                onSuccess(); // Refresh the admin list
                onClose();   // Close the modal
            } else {
                // Handle specific errors
                if (response.error.includes('insufficient privileges') || response.insufficientPrivileges) {
                    setError('You do not have permission to create admin accounts. SuperAdmin access required.');
                } else if (response.error.includes('already exists')) {
                    setError('An admin with this email already exists.');
                } else {
                    setError(response.error || 'Failed to create admin account.');
                }
                toast.error(response.error || 'Failed to create admin account.');
            }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                email: '',
                password: '',
                name: '',
                role: 'admin',
                isActive: true
            });
            setError('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ borderBottom: '1px solid #ddd' }}>
                Create New Administrator
            </DialogTitle>
            <DialogContent sx={{ pt: '20px !important' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                {!permissions?.canManageAdmins && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        You may not have sufficient privileges to create admin accounts.
                    </Alert>
                )}

                <TextField
                    margin="dense"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                <TextField
                    margin="dense"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    disabled={loading}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                        disabled={loading}
                    >
                        <MenuItem value="admin">Administrator</MenuItem>
                        {canCreateSuperAdmin && (
                            <MenuItem value="super_admin">Super Administrator</MenuItem>
                        )}
                    </Select>
                    {!canCreateSuperAdmin && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                            Only SuperAdmins can create other SuperAdmin accounts
                        </Typography>
                    )}
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                            disabled={loading}
                            color="primary"
                        />
                    }
                    label={formData.isActive ? "Account Active" : "Account Inactive"}
                    sx={{ mt: 1, display: 'block' }}
                />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Role Permissions:</strong>
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                        • <strong>Administrator:</strong> Can manage products, view basic dashboard
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                        • <strong>Super Administrator:</strong> Can manage admins, view enquiries, full system access
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', borderTop: '1px solid #ddd' }}>
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={loading || !formData.email || !formData.password}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Admin'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminRegistrationForm;