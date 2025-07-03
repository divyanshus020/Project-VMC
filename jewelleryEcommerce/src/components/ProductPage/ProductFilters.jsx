// components/ProductLayout/ProductFilters.js
import React from 'react';
import { Box, Paper, Stack, Typography, alpha, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import SortButton from '../Basic/Shorting';
import Category from '../Basic/Cataogry';

const ProductFilters = ({ 
  colors, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  sortOption, 
  setSortOption, 
  sortedProducts, 
  loading 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* Filter and Sort Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: 4,
            bgcolor: colors.white,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(colors.primary, 0.2)}`,
            boxShadow: `0 8px 32px ${alpha(colors.mediumGray, 0.12)}`,
          }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={3}
            sx={{
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Category
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
              />
            </Box>
            <Box sx={{ minWidth: { xs: 'auto', md: 200 } }}>
              <SortButton
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      {/* Products Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: colors.mediumGray
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: colors.primary,
                display: 'inline-block',
                boxShadow: `0 0 8px ${alpha(colors.primary, 0.4)}`
              }}
            />
            {loading ? 'Loading products...' : `${sortedProducts.length} products found`}
            {selectedCategory !== 'All' && (
              <span style={{ color: colors.darkGray, fontWeight: 600 }}>
                {` in ${selectedCategory}`}
              </span>
            )}
          </Typography>
        </Box>
      </motion.div>
    </>
  );
};

export default ProductFilters;