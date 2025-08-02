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
    const [formData, setFormData] = useState({ name: '', role: 'admin', isActive: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // This effect runs when the 'admin' prop changes, populating the form.
    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || '',
                role: admin.role || 'admin',
                // Ensure isActive has a boolean value, defaulting to true.
                isActive: typeof admin.isActive === 'boolean' ? admin.isActive : true,
            });
        }
    }, [admin]);

    // This effect resets the error state whenever the modal is opened or closed.
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
            if (!token) {
                throw new Error("Authentication token not found.");
            }
            
            const response = await updateAdmin(admin.id, formData, token);
            
            if (response.success) {
                toast.success(`Admin "${formData.name || admin.email}" updated successfully!`);
                onSuccess(); // Refresh the admin list on the parent component
                onClose();   // Close the modal
            } else {
                // Set error from API response if available
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
    
    // A superadmin cannot edit their own role or status to prevent self-lockout.
    const isEditingSelf = currentAdmin?.id === admin.id;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ borderBottom: '1px solid #ddd' }}>
                Edit Admin: {admin.name || admin.email}
            </DialogTitle>
            <DialogContent sx={{ pt: '20px !important' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
