import { Typography, Divider } from '@mui/material';

const HeroTitle = () => (
  <>
    <Typography
      variant="h2"
      fontWeight="bold"
      sx={{
        textAlign: 'center',
        width: '100%',
        color: '#333333',
        fontSize: { xs: '32px', sm: '48px', md: '120px' },
        pb: 1,
      }}
    >
      Discover Fine Jewellery
    </Typography>
    <Divider sx={{ bgcolor: '#D4AF37', height: '4px', width: '100%' }} />
  </>
);

export default HeroTitle;
