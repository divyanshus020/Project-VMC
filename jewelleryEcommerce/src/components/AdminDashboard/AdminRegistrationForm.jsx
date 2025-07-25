
import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { toast } from 'react-toastify';
import { registerAdmin, validateAdminData } from '../../lib/api';

const AdminRegistrationForm = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        isActive: true,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError('');
        setErrors({});

        // Frontend validation
        const { isValid, errors: validationErrors } = validateAdminData(formData);
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await registerAdmin(formData);
            if (response.success) {
                toast.success(response.message || 'Admin registered successfully!');
                onSuccess(); // This will trigger a refetch in the parent
                handleClose(); // Close the form
            } else {
                setServerError(response.error || 'An unknown error occurred.');
                toast.error(response.error || 'Failed to register admin.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setServerError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset form state on close
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'admin',
            isActive: true,
        });
        setErrors({});
        setServerError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle fontWeight="bold">Register New Administrator</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Fill out the details below to create a new administrator account.
                </DialogContentText>
                
                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role"
                            name="role"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                            <MenuItem value="moderator">Moderator</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="Account Active"
                        sx={{ mt: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 20px' }}>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={isSubmitting}
                    sx={{ position: 'relative' }}
                >
                    {isSubmitting ? 'Registering...' : 'Register Admin'}
                    {isSubmitting && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminRegistrationForm;
