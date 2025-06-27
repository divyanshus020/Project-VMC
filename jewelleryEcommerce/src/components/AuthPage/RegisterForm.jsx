import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  sendOtpForRegister,
  verifyOtpForRegister,
} from '../../lib/api.js';

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
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    if (timer === 0 && interval) clearInterval(interval);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber.trim()) {
      return alert('Please enter a phone number.');
    }

    try {
      setLoading(true);
      const response = await sendOtpForRegister(formData.phoneNumber.trim());
      console.log('OTP sent:', response.data);
      setOtpSent(true);
      setTimer(15); // Start 15s timer
      alert('OTP sent to your phone number.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert(err?.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.phoneNumber.trim()) {
      return alert('Please enter a phone number.');
    }
    try {
      setLoading(true);
      const response = await sendOtpForRegister(formData.phoneNumber.trim());
      console.log('OTP resent:', response.data);
      setTimer(15); // Restart 15s timer
      alert('OTP resent to your phone number.');
    } catch (err) {
      console.error('Error resending OTP:', err);
      alert(err?.response?.data?.message || 'Failed to resend OTP.');
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

      const res = await verifyOtpForRegister({
        phoneNumber: formData.phoneNumber.trim(),
        otp: otp.trim(),
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
      });

      if (res?.data?.token) {
        setOtpVerified(true);
        alert('OTP verified. Registration successful!');
        localStorage.setItem('token', res.data.token);
        // optionally redirect here
      } else {
        alert('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      alert(err?.response?.data?.message || 'Invalid OTP or registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate>
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
          />

          {!otpVerified ? (
            <>
              <Button
                onClick={handleVerifyOtp}
                fullWidth
                variant="contained"
                sx={{ mt: 1, bgcolor: '#2e7d32' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify OTP & Register'}
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                {timer > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Resend OTP in {timer} second{timer !== 1 ? 's' : ''}
                  </Typography>
                ) : (
                  <Button
                    onClick={handleResendOtp}
                    variant="text"
                    color="primary"
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <Typography color="success.main" mt={2}>
              ✅ Phone verified. You are now registered!
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default RegisterForm;