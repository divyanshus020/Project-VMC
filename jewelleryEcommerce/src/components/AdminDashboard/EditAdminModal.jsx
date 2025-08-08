import React, { useState, useEffect } from 'react';
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
    Alert
} from '@mui/material';
import { updateAdmin, getAuthToken } from '../../lib/api';
import { toast } from 'react-toastify';

const EditAdminModal = ({ open, onClose, admin, onSuccess, currentAdmin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'admin',
        isActive: true,
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                role: admin.role || 'admin',
                isActive: typeof admin.isActive === 'boolean' ? admin.isActive : true,
                password: ''
            });
        }
    }, [admin]);

    useEffect(() => {
        if (!open) {
            setError('');
        }
    }, [open]);

    if (!admin) return null;

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAuthToken('admin');
            if (!token) throw new Error("Authentication token not found.");

            const payload = { ...formData };
            if (!payload.password.trim()) {
                delete payload.password;
            }

            const response = await updateAdmin(admin.id, payload, token);

            if (response.success) {
                toast.success(`Admin "${formData.name || admin.email}" updated successfully!`);
                onSuccess();
                onClose();
            } else {
                setError(response.error || 'Failed to update admin.');
                toast.error(response.error || 'Failed to update admin.');
            }
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isEditingSelf = currentAdmin?.id === admin.id;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ borderBottom: '1px solid #ddd' }}>
                Edit Admin: {admin.name || admin.email}
            </DialogTitle>
            <DialogContent sx={{ pt: '20px !important' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Name */}
                <TextField
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                {/* Email */}
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                {/* Password */}
                <TextField
                    margin="dense"
                    label="Change Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                />

                {/* Role */}
                <FormControl fullWidth margin="dense" disabled={isEditingSelf}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="superadmin">Superadmin</MenuItem>
                    </Select>
                </FormControl>

                {/* Active Status */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                            disabled={isEditingSelf}
                            color="primary"
                        />
                    }
                    label={formData.isActive ? "Account Active" : "Account Inactive"}
                    sx={{ mt: 1, display: 'block' }}
                />

                {isEditingSelf && (
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        You cannot change your own role or active status.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', borderTop: '1px solid #ddd' }}>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAdminModal;
