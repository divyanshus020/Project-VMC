import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { registerUser, sendOtp, verifyOtp } from '../../lib/api.js';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber.trim()) {
      return alert('Please enter a phone number first.');
    }

    try {
      setLoading(true);
      await sendOtp(formData.phoneNumber);
      setOtpSent(true);
      alert('OTP sent successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      return alert('Please enter the OTP.');
    }

    try {
      setLoading(true);
      await verifyOtp(formData.phoneNumber, otp);
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } catch (err) {
      console.error(err);
      alert('Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      return alert('Please verify your OTP before registering.');
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);
      alert('Registered successfully!');
      console.log(res.data);
      // Optionally redirect or clear form here
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Create an Account
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        type="email"
      />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        type="tel"
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
      ) : !otpVerified ? (
        <>
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            onClick={handleVerifyOtp}
            fullWidth
            variant="contained"
            sx={{ mt: 1, bgcolor: '#2e7d32' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
          </Button>
        </>
      ) : (
        <Typography color="success.main" mt={2}>
          ✅ Phone number verified!
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, bgcolor: '#D4AF37', '&:hover': { bgcolor: '#c49c2d' } }}
        disabled={!otpVerified || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
