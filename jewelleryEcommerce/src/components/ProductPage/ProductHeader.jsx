// components/ProductLayout/ProductHeader.js
import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const ProductHeader = ({ colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
            background: `linear-gradient(135deg, ${colors.primary}, ${alpha(colors.primary, 0.7)})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            textAlign: { xs: 'center', md: 'left' },
            textShadow: `0 2px 4px ${alpha(colors.primary, 0.2)}`
          }}
        >
          Jewellery Collection
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: 600,
            color: colors.mediumGray
          }}
        >
          Discover our exquisite collection of premium jewellery
        </Typography>
      </Box>
    </motion.div>
  );
};

export default ProductHeader;