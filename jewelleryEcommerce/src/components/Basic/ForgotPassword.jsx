import React, { useState } from 'react';
import { forgotPassword } from '../../lib/api';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Email } from '@mui/icons-material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetInfo, setResetInfo] = useState(null); // For development/testing

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Email address is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');
        setResetInfo(null);

        try {
            const response = await forgotPassword({ email });
            
            if (response.success) {
                setMessage(response.message || 'Password reset instructions have been sent to your email.');
                
                // In development, show the reset link (remove in production)
                if (process.env.NODE_ENV === 'development' && response.resetToken) {
                    setResetInfo({
                        token: response.resetToken,
                        url: response.resetUrl
                    });
                }
                
                // Clear the email field
                setEmail('');
            } else {
                setError(response.error || 'Failed to send reset instructions.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear errors when user starts typing
        if (error) setError('');
        if (message) setMessage('');
        if (resetInfo) setResetInfo(null);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, mb: 3 }}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleEmailChange}
                        disabled={loading}
                        error={!!error && !email}
                        helperText={!email && error ? error : ''}
                    />
                    
                    {message && (
                        <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                            {message}
                        </Alert>
                    )}
                    
                    {error && email && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Development/Testing Reset Info - Remove in production */}
                    {resetInfo && process.env.NODE_ENV === 'development' && (
                        <Alert severity="info" sx={{ width: '100%', mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Development Mode - Reset Info:</strong>
                            </Typography>
                            <Typography variant="caption" component="div">
                                Token: {resetInfo.token}
                            </Typography>
                            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                                <a href={resetInfo.url} target="_blank" rel="noopener noreferrer">
                                    Reset Password Link
                                </a>
                            </Typography>
                        </Alert>
                    )}
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || !email}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                    </Button>
                    
                    <Box textAlign="center">
                        <Link to="/admin/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Back to Login
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotPassword;