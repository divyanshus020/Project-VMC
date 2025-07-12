import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  verifyOtpForLogin,
  checkUserExists,
  sendOtpForLogin, // ✅ New sendOtp API for login
} from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) return alert('Please enter your phone number.');

    try {
      setLoading(true);

      // Check if user exists first
      const userExists = await checkUserExists(trimmedPhone);
      if (!userExists.exists) { // Access exists directly from response
        alert('User not found. Please register first.');
        return;
      }

      // Send OTP only if user exists
      const otpResponse = await sendOtpForLogin(trimmedPhone);
      setOtpSent(true);
      setTimer(15);
      alert(otpResponse.message || 'OTP sent to your phone.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert('Please enter the OTP.');

    try {
      setLoading(true);
      const response = await verifyOtpForLogin(phoneNumber.trim(), otp.trim());
      
      // Check if we have a token in the response
      if (!response?.token) {
        throw new Error('No authentication token received');
      }

      // Store the token
      localStorage.setItem('token', response.token);
      
      alert('Login successful!');
      navigate('/profile');
      window.location.reload();
    } catch (err) {
      console.error('OTP verification error:', err);
      alert(
        err.response?.data?.message || 
        err.message || 
        'OTP verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Login with OTP
      </Typography>

      <TextField
        fullWidth
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        variant="outlined"
        margin="normal"
        disabled={otpSent}
      />

      {!otpSent ? (
        <Button
          onClick={handleSendOtp}
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: '#1976d2' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send OTP'}
        </Button>
      ) : (
        <>
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            variant="outlined"
            margin="normal"
            autoFocus
          />

          <Button
            onClick={handleVerifyOtp}
            fullWidth
            variant="contained"
            sx={{ mt: 1, bgcolor: '#2e7d32' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify & Login'}
          </Button>

          {timer > 0 ? (
            <Typography mt={2} color="text.secondary">
              ⏳ Resend OTP in {timer}s
            </Typography>
          ) : (
            <Button
              onClick={handleSendOtp}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Resend OTP
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default LoginForm;
