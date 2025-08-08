// components/ProductLayout/ProductFilters.js
import React from 'react';
import { Box, Paper, Stack, Typography, alpha, useTheme, useMediaQuery, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FilterList, Clear } from '@mui/icons-material';
import Category from '../Basic/Cataogry';
import DieNoFilter from '../Basic/DieNoFilter';

const ProductFilters = ({ 
  colors, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  sortedProducts, 
  loading,
  selectedDieNo,
  setSelectedDieNo
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Determine if filters are active
  const isCategoryFilterActive = selectedCategory !== 'All';
  const isDieNoFilterActive = selectedDieNo !== 'All';
  const hasActiveFilters = isCategoryFilterActive || isDieNoFilterActive;
  const activeFilterCount = [isCategoryFilterActive, isDieNoFilterActive].filter(Boolean).length;

  // Base style for the filter control's wrapper
  const filterWrapperStyle = {
    flex: 1,
    minWidth: 150,
    p: 1,
    borderRadius: 3, // Should be slightly larger than the inner component's border-radius
    border: '1px solid transparent', // Placeholder for stable layout
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };

  // Style to apply when a filter is active
  const activeFilterHighlight = {
    background: `linear-gradient(135deg, ${alpha('#D4AF37', 0.12)}, ${alpha('#F4E4BC', 0.08)})`,
    borderColor: alpha('#D4AF37', 0.5),
    boxShadow: `0 2px 8px ${alpha('#D4AF37', 0.2)}`,
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDieNo('All');
  };

  return (
    <>
      {/* Filter Controls */}
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
            border: `1px solid ${alpha(hasActiveFilters ? '#D4AF37' : colors.primary, hasActiveFilters ? 0.6 : 0.2)}`,
            boxShadow: `0 8px 32px ${alpha(colors.mediumGray, 0.12)}`,
            position: 'relative',
          }}
        >
          {/* Filter Indicator Badge */}
          {hasActiveFilters && (
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: 16,
                zIndex: 10
              }}
            >
              <Chip
                icon={<FilterList />}
                label={`${activeFilterCount} Active`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #B8860B 100%)',
                  color: '#2C1810',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '& .MuiChip-icon': {
                    color: '#2C1810',
                    fontSize: '1rem'
                  },
                  '& .MuiChip-label': {
                    px: 1.5,
                    py: 0.5
                  }
                }}
              />
            </Box>
          )}

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={3}
            sx={{
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Category Filter */}
            <Box sx={{
              ...filterWrapperStyle,
              ...(isCategoryFilterActive && activeFilterHighlight)
            }}>
              <Category
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
              />
            </Box>
            
            {/* Die No Filter */}
            <Box sx={{
              ...filterWrapperStyle,
              ...(isDieNoFilterActive && activeFilterHighlight)
            }}>
              <DieNoFilter 
                selectedDieNo={selectedDieNo}
                setSelectedDieNo={setSelectedDieNo}
              />
            </Box>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearAllFilters}
                  sx={{
                    borderColor: alpha('#D4AF37', 0.4),
                    color: colors.mediumGray,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      borderColor: '#D4AF37',
                      background: `linear-gradient(135deg, ${alpha('#D4AF37', 0.1)}, ${alpha('#F4E4BC', 0.05)})`,
                      color: colors.darkGray,
                    }
                  }}
                >
                  Clear All
                </Button>
              </Box>
            )}
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
              color: colors.mediumGray,
              flexWrap: 'wrap'
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
            {selectedDieNo !== 'All' && (
              <span style={{ color: colors.darkGray, fontWeight: 600 }}>
                {` with Die No: ${selectedDieNo}`}
              </span>
            )}
          </Typography>
        </Box>
      </motion.div>
    </>
  );
};

export default ProductFilters;