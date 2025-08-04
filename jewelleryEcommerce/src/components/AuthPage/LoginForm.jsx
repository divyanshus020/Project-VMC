import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, CircularProgress, Link
} from '@mui/material';
import {
  verifyOtpForLogin, checkUserExists, sendOtpForLogin, loginWithPassword
} from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = '6Lf8YogrAAAAAHHYgIvwFYATUCw22G1F7GZkqzpM';

const LoginForm = () => {
  // State for login method
  const [method, setMethod] = useState('otp'); // 'otp' or 'password'

  // Common state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State for both OTP and Password login
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP-specific State
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);

  // Effect to restore state from sessionStorage on page load
  useEffect(() => {
    const storedPhone = sessionStorage.getItem('loginPhoneNumber');
    const otpWasSent = sessionStorage.getItem('loginOtpSent') === 'true';
    const timerEndsAt = parseInt(sessionStorage.getItem('loginTimerEndsAt') || '0', 10);

    if (otpWasSent && storedPhone) {
      setPhoneNumber(storedPhone);
      setOtpSent(true);
      const remainingTime = Math.max(0, Math.round((timerEndsAt - Date.now()) / 1000));
      setTimer(remainingTime);
    }
  }, []);


  // Effect to manage the countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSendOtp = async () => {
    const trimmedPhone = phoneNumber.trim();
    
    if (!trimmedPhone) return alert('Please enter your phone number.');
    if (!captchaToken) return alert('Please complete the CAPTCHA.');

    try {
      setLoading(true);
      const userExists = await checkUserExists(trimmedPhone);
      if (!userExists.exists) {
        alert('User not found. Please register first.');
        setLoading(false); // Stop loading on return
        return;
      }

      const otpResponse = await sendOtpForLogin(trimmedPhone);
      
      // Persist state and timer expiration to session storage
      const newTimerValue = 60; // Match backend cooldown
      sessionStorage.setItem('loginPhoneNumber', trimmedPhone);
      sessionStorage.setItem('loginOtpSent', 'true');
      sessionStorage.setItem('loginTimerEndsAt', (Date.now() + newTimerValue * 1000).toString());
      
      setOtpSent(true);
      setTimer(newTimerValue);
      alert(otpResponse.message || 'OTP sent to your phone.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };
  
  const clearSessionState = () => {
      sessionStorage.removeItem('loginPhoneNumber');
      sessionStorage.removeItem('loginOtpSent');
      sessionStorage.removeItem('loginTimerEndsAt');
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert('Please enter the OTP.');

    try {
      setLoading(true);
      const response = await verifyOtpForLogin(phoneNumber.trim(), otp.trim());

      console.log(response)

      if (!response?.token) throw new Error('No authentication token received');
      
      clearSessionState();
      localStorage.setItem('token', response.token);
      console.log(response.user)
      localStorage.setItem('user', JSON.stringify(response.user));
      alert('Login successful!');
      navigate('/profile');
      window.location.reload();
    } catch (err) {
      console.error('OTP verification error:', err);
      alert(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
      // ✅ Use phoneNumber for password login
      if (!phoneNumber.trim() || !password.trim()) {
          return alert('Please enter both phone number and password.');
      }
      try {
          setLoading(true);
          // ✅ Send phoneNumber instead of email
          const response = await loginWithPassword({ phoneNumber: phoneNumber.trim(), password });

          if (!response?.token) throw new Error('No authentication token received');
          
          localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

          alert('Login successful!');
          navigate('/profile');
          window.location.reload();
      } catch (err) {
          console.error('Password login error:', err);
          alert(err.response?.data?.message || err.message || 'Login failed.');
      } finally {
          setLoading(false);
      }
  };
  
  const renderOtpForm = () => (
    <>
        <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
            Login with OTP
        </Typography>

        <TextField
            fullWidth label="Phone Number" value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined" margin="normal" disabled={otpSent}
        />

        {!otpSent ? (
            <>
            {phoneNumber.trim() && (
                <Box mt={2}> <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} /> </Box>
            )}
            <Button onClick={handleSendOtp} fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading || !captchaToken}>
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
            </>
        ) : (
            <>
            <TextField fullWidth label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} variant="outlined" margin="normal" autoFocus />
            <Button onClick={handleVerifyOtp} fullWidth variant="contained" sx={{ mt: 1, bgcolor: '#2e7d32' }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Verify & Login'}
            </Button>
            {timer > 0 ? (
                <Typography mt={2} color="text.secondary" align="center"> ⏳ Resend OTP in {timer}s </Typography>
            ) : (
                <Button onClick={handleSendOtp} fullWidth variant="outlined" sx={{ mt: 2 }} disabled={loading}> Resend OTP </Button>
            )}
            </>
        )}
        <Typography align="center" sx={{ mt: 2 }}>
            <Link component="button" variant="body2" onClick={() => setMethod('password')}>
                Login with Password instead
            </Link>
        </Typography>
    </>
  );

  const renderPasswordForm = () => (
      <>
          <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
              Login with Password
          </Typography>
          {/* ✅ Changed from Email to Phone Number */}
          <TextField fullWidth label="Phone Number" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} variant="outlined" margin="normal" />
          <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" margin="normal" />
          <Button onClick={handlePasswordLogin} fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
              <Link component="button" variant="body2" onClick={() => setMethod('otp')}>
                  Login with OTP instead
              </Link>
          </Typography>
      </>
  );

  return (
    <Box component="form" noValidate autoComplete="off">
        {method === 'otp' ? renderOtpForm() : renderPasswordForm()}
        
    </Box>
  );
};

export default LoginForm;
