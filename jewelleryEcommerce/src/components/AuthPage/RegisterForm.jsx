// components/RegisterForm.jsx
import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const RegisterForm = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Create an Account
      </Typography>
      <TextField
        fullWidth
        label="Full Name"
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        InputLabelProps={{ style: { color: '#666666' } }}
      />
      <Button
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
