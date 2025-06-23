import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const TopHeaderBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 1,
        display: { xs: 'none', md: 'block' }
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontSize: '0.875rem'
          }}
        >
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📞 +91-9876543210
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            ✉️ info@luxegems.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TopHeaderBar;