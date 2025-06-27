import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { sendOtp, verifyOtp, checkUserExists } from '../../lib/api'; // ⬅️ make sure this function is exported
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) return alert('Please enter your phone number.');

    try {
      setLoading(true);

      // ✅ Check if user exists before sending OTP
      const res = await checkUserExists(trimmedPhone);
      if (!res.data.exists) {
        return alert('User not found. Please register first.');
      }

      // ✅ If user exists, send OTP
      await sendOtp(trimmedPhone);
      setOtpSent(true);
      alert('OTP has been sent to your phone.');
    } catch (err) {
      console.error('Error during OTP send:', err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert('Please enter the OTP.');

    try {
      setLoading(true);
      const res = await verifyOtp(phoneNumber.trim(), otp.trim());
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/profile');
      window.location.reload(); // optional
    } catch (err) {
      console.error('OTP verification error:', err);
      alert(
        `OTP verification failed: ${
          err.response?.data?.message || 'Please check your input.'
        }`
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
        </>
      )}
    </Box>
  );
};

export default LoginForm;
