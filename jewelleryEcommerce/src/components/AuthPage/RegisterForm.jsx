// ✅ components/RegisterForm.jsx

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { registerUser } from '../../lib/api.js'; // ✅ use your API helper

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '', // ✅ Changed from 'phone' to 'phoneNumber' to match API
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use your reusable API function
      const res = await registerUser(formData);
      alert('Registered successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
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
        InputLabelProps={{ style: { color: '#666666' } }}
      />

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
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber" // ✅ Changed from 'phone' to 'phoneNumber'
        value={formData.phoneNumber} // ✅ This was already correct
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
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
