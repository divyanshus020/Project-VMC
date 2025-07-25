// components/AuthPage.jsx
import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import LoginForm from '../components/AuthPage/LoginForm';
import RegisterForm from '../components/AuthPage/RegisterForm';   

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleLoginSuccess = () => {
    // Refresh the page after successful login
    window.location.reload();
  };

  const handleRegisterSuccess = () => {
    // Refresh the page after successful registration
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: 360, p: 3, bgcolor: '#FFFFFF' }}>
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} centered textColor="primary" indicatorColor="primary">
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Box mt={2}>
          {tabValue === 0 ? (
            <LoginForm onSuccess={handleLoginSuccess} />
          ) : (
            <RegisterForm onSuccess={handleRegisterSuccess} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;
