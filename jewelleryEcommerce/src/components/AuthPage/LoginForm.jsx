import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { loginUser } from '../../lib/api';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // ✅ Initialize router

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      console.log(res.data);
      alert('Login successful!');

      // ✅ Store the token
      localStorage.setItem('token', res.data.token);

      // ✅ Redirect to account page
      navigate('/profile');
      window.location.reload(); // 🔄 Reload the website after redirect

    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Login to Your Account
      </Typography>

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, bgcolor: '#D4AF37', '&:hover': { bgcolor: '#c49c2d' } }}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
