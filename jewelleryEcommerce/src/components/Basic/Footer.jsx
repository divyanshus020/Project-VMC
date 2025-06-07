import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  marginTop: theme.spacing(8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #E0E0E0 50%, transparent)',
  }
}));

const AppFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          spacing={isMobile ? 1 : 2}
          textAlign="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: '#333333',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              letterSpacing: '0.02em'
            }}
          >
            © {new Date().getFullYear()} YourCompanyName. All rights reserved.
          </Typography>
          
          {!isMobile && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: '#D4AF37',
                borderWidth: '1px',
                height: '20px',
                alignSelf: 'center'
              }}
            />
          )}
          
          <Typography
            variant="body2"
            sx={{
              color: '#D4AF37',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              letterSpacing: '0.01em'
            }}
          >
            Built with
            <Box
              component="span"
              sx={{
                color: '#E91E63',
                fontSize: '1.1em',
                animation: 'heartbeat 1.5s ease-in-out infinite',
                '@keyframes heartbeat': {
                  '0%': { transform: 'scale(1)' },
                  '14%': { transform: 'scale(1.1)' },
                  '28%': { transform: 'scale(1)' },
                  '42%': { transform: 'scale(1.1)' },
                  '70%': { transform: 'scale(1)' }
                }
              }}
            >
              ❤️
            </Box>
            and precision.
          </Typography>
        </Stack>
        
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: { xs: '60px', sm: '80px' },
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              opacity: 0.6
            }}
          />
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default AppFooter;
