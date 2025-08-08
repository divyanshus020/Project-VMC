import React, { useState, useEffect, useRef } from 'react';
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
  // Login method: 'otp' or 'password'
  const [method, setMethod] = useState('otp');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // Shared state
  const [phoneNumber, setPhoneNumber] = useState('');

  // OTP login
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);

  // Password login
  const [password, setPassword] = useState('');
  const [passwordCaptchaVerified, setPasswordCaptchaVerified] = useState(false);

  // Restore OTP session state on initial component load
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

  // Countdown timer for OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Clears OTP session data from storage
  const clearSessionState = () => {
    sessionStorage.removeItem('loginPhoneNumber');
    sessionStorage.removeItem('loginOtpSent');
    sessionStorage.removeItem('loginTimerEndsAt');
  };

  /**
   * Resets the entire OTP flow, clearing state and forcing re-verification.
   */
  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtp('');
    setCaptchaToken(null);
    setTimer(0);
    clearSessionState();
    recaptchaRef.current?.reset(); // Visually reset the CAPTCHA
  };

  /**
   * Handles changes to the phone number input.
   * If the user edits the number after an OTP has been sent, it resets the OTP flow.
   */
  const handlePhoneNumberChange = (newNumber) => {
    setPhoneNumber(newNumber);
    if (otpSent) {
      resetOtpFlow();
    }
  };

  // Handle CAPTCHA token changes
  const handleCaptchaChange = (token, type = 'otp') => {
    if (type === 'otp') {
      setCaptchaToken(token);
    } else if (type === 'password') {
      if (token) {
        setPasswordCaptchaVerified(true);
      }
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) return alert('Please enter your phone number.');
    if (!captchaToken) return alert('Please complete the CAPTCHA.');

    try {
      setLoading(true);
      const userExists = await checkUserExists(trimmedPhone);
      if (!userExists.exists) {
        alert('User not found. Please register first.');
        setLoading(false);
        return;
      }

      const otpResponse = await sendOtpForLogin(trimmedPhone);

      const newTimerValue = 60;
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) return alert('Please enter the OTP.');

    try {
      setLoading(true);
      const response = await verifyOtpForLogin(phoneNumber.trim(), otp.trim());

      if (!response?.token) throw new Error('No authentication token received');

      clearSessionState();
      localStorage.setItem('token', response.token);
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

  // Password login
  const handlePasswordLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) {
      return alert('Please enter both phone number and password.');
    }
    try {
      setLoading(true);
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

  // OTP login form
  const renderOtpForm = () => (
    <>
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Login with OTP
      </Typography>

      <TextField
        fullWidth
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => handlePhoneNumberChange(e.target.value)}
        variant="outlined"
        margin="normal"
      />

      {!otpSent ? (
        <>
          {phoneNumber.trim() && (
            <Box mt={2}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => handleCaptchaChange(token, 'otp')}
              />
            </Box>
          )}
          <Button
            onClick={handleSendOtp}
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading || !captchaToken}
          >
            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
          </Button>
        </>
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
            <Typography mt={2} color="text.secondary" align="center">
              ⏳ Resend OTP in {timer}s
            </Typography>
          ) : (
            <Button onClick={resetOtpFlow} fullWidth variant="outlined" sx={{ mt: 2 }} disabled={loading}>
              Resend OTP
            </Button>
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

  // Password login form
  const renderPasswordForm = () => (
    <>
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Login with Password
      </Typography>

      <TextField
        fullWidth
        label="Phone Number"
        type="tel"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          setPasswordCaptchaVerified(false); // Reset CAPTCHA if phone changes
        }}
        variant="outlined"
        margin="normal"
      />

      {phoneNumber.trim() && !passwordCaptchaVerified && (
        <Box mt={2}>
          <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={(token) => handleCaptchaChange(token, 'password')} />
        </Box>
      )}

      {passwordCaptchaVerified && (
        <>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            onClick={handlePasswordLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </>
      )}

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
