import React from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const CustomDesignSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 6, md: 12 },
        py: { xs: 4, sm: 6, md: 8 },
        gap: 6,
        bgcolor: '#fffbe6',
      }}
    >
      {/* Left Content */}
      <Box flex={1}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Design Your Own Jewellery
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          At Vimla Jewellers, we bring your imagination to life. Whether it’s a custom engagement ring or a family heirloom recreation, we work with you to create something truly one-of-a-kind.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: '30px', px: 4, py: 1.5 }}
        >
          Start Your Custom Design
        </Button>
      </Box>

      {/* Right Image */}
      <Box
        flex={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src="https://images.prismic.io/xometry-marketing/ed1d10e3-ce35-478f-8d25-368045ea5d3c_fiber-laser-cutting-machine.jpg?auto=compress%2Cformat&rect=166%2C0%2C667%2C667&w=486&h=486&fit=max" // Replace with your own image path
          alt="Custom Jewellery Design"
          sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: 4,
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomDesignSection;
