// components/LoginForm.jsx
import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginForm = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" fontWeight="bold" color="#333333" mb={2}>
        Login to Your Account
      </Typography>
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
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
