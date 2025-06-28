import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loop from "../../assets/For Web/Loop.mp4"

const RoyalVideoSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f5f0ea',
      }}
    >
      {/* Left Video Side - 70% width */}
      <Box
        sx={{
          flex: isMobile ? 1 : '0 0 70%',
          position: 'relative',
          clipPath: isMobile
            ? 'ellipse(100% 100% at 50% 0%)'
            : 'polygon(0 0, 95% 0, 85% 100%, 0% 100%)',
          zIndex: 1,
        }}
      >
        <video
          src={Loop} // replace with your own path
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Right Text Side - 30% width */}
      <Box
        sx={{
          flex: isMobile ? 1 : '0 0 30%',
          px: { xs: 3, sm: 6 },
          py: { xs: 5, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          background: '#f5f0ea',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#7b5c38',
            mb: 2,
          }}
        >
          Timeless Elegance in Every Piece
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Georgia, serif',
            color: '#5c4434',
            mb: 4,
            maxWidth: 500,
          }}
        >
          Discover handcrafted jewellery designed with royal finesse. Curated to elevate your grace — explore our exclusive collection today.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '30px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
          onClick={() => navigate('/products')}
        >
          Explore Collection
        </Button>
      </Box>
    </Box>
  );
};

export default RoyalVideoSection;
