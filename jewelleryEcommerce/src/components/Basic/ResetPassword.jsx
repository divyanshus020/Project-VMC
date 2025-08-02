import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../lib/api';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors when user starts typing
        if (error) setError('');
        if (message) setMessage('');
    };

    const validateForm = () => {
        if (!formData.newPassword) {
            setError('New password is required');
            return false;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        if (!token) return;

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await resetPassword({
                token,
                newPassword: formData.newPassword
            });

            if (response.success) {
                setMessage(response.message || 'Password has been reset successfully! Redirecting to login...');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/admin/login');
                }, 3000);
            } else {
                setError(response.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    if (!token) {
        return (
            <Container component="main" maxWidth="xs">
                <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Lock sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                    <Typography component="h1" variant="h5" color="error">
                        Invalid Reset Link
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2, mb: 3 }}>
                        This password reset link is invalid or has expired. Please request a new password reset.
                    </Typography>
                    <Box textAlign="center" sx={{ width: '100%' }}>
                        <Link to="/admin/forgot-password" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" fullWidth>
                                Request New Reset Link
                            </Button>
                        </Link>
                        <Box sx={{ mt: 2 }}>
                            <Link to="/admin/login" variant="body2">
                                Back to Login
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Lock sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, mb: 3 }}>
                    Enter your new password below
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => togglePasswordVisibility('password')}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || !formData.newPassword || !formData.confirmPassword}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                    </Button>
                    
                    <Box textAlign="center">
                        <Link to="/admin/login" variant="body2">
                            Back to Login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPassword;