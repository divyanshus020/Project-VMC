// components/ProductLayout.js
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Stack,
  Typography,
  Paper,
  Fade,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import SortButton from '../Basic/Shorting';
import Category from '../Basic/Cataogry';

const ProductLayout = ({ products, loading = false }) => {
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Jewelry ecommerce color scheme
  const colors = {
    primary: '#D4AF37', // Gold
    darkGray: '#333333', // Dark text
    mediumGray: '#666666', // Secondary text
    lightGray: '#F5F5F5', // Backgrounds
    white: '#FFFFFF' // Card backgrounds
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (price) =>
      typeof price === 'string'
        ? parseFloat(price.replace(/[^0-9.]/g, ''))
        : price;

    switch (sortOption) {
      case 'priceLowHigh':
        return getPrice(a.price) - getPrice(b.price);
      case 'priceHighLow':
        return getPrice(b.price) - getPrice(a.price);
      case 'nameAZ':
        return a.title.localeCompare(b.title);
      case 'nameZA':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Loading skeleton component
  const ProductSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: colors.white,
          border: `1px solid ${alpha(colors.lightGray, 0.8)}`,
          height: '100%',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 4px 12px ${alpha(colors.mediumGray, 0.1)}`
        }}
      >
        <Skeleton 
          variant="rectangular" 
          height={200} 
          sx={{ 
            borderRadius: 2, 
            mb: 2,
            bgcolor: alpha(colors.lightGray, 0.6)
          }} 
        />
        <Skeleton 
          variant="text" 
          height={24} 
          sx={{ 
            mb: 1,
            bgcolor: alpha(colors.lightGray, 0.6)
          }} 
        />
        <Skeleton 
          variant="text" 
          height={20} 
          width="60%" 
          sx={{ 
            mb: 2,
            bgcolor: alpha(colors.lightGray, 0.6)
          }} 
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
          <Skeleton 
            variant="text" 
            height={28} 
            width="40%" 
            sx={{ bgcolor: alpha(colors.primary, 0.3) }}
          />
          <Skeleton 
            variant="rectangular" 
            height={36} 
            width={80} 
            sx={{ 
              borderRadius: 2,
              bgcolor: alpha(colors.primary, 0.2)
            }} 
          />
        </Stack>
      </Paper>
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.lightGray,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, ${alpha(colors.primary, 0.08)} 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, ${alpha(colors.primary, 0.05)} 0%, transparent 50%)
        `,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Header Section */}
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

        {/* Products Grid - Fixed to 4 columns with equal width */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Grid 
              container 
              spacing={{ xs: 2, md: 3 }} 
              sx={{ 
                alignItems: 'stretch',
                '& .MuiGrid-item': {
                  display: 'flex'
                }
              }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </Grid>
          ) : (
            <motion.div
              key={selectedCategory + sortOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid 
                container 
                spacing={{ xs: 2, md: 3 }} 
                sx={{ 
                  alignItems: 'stretch',
                  '& .MuiGrid-item': {
                    display: 'flex'
                  }
                }}
              >
                {sortedProducts.map((product, index) => (
                  <Grid
                    item
                    key={product.id}
                    xs={12}    // 1 per row on extra small screens
                    sm={6}     // 2 per row on small screens
                    md={3}     // 4 per row on medium screens and up
                    lg={3}     // 4 per row on large screens
                    xl={3}     // 4 per row on extra large screens
                    sx={{ 
                      display: 'flex',
                      '& > div': {
                        width: '100%'
                      }
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      style={{ 
                        width: '100%',
                        display: 'flex'
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          '& > *': {
                            width: '100%',
                            minHeight: 400,
                            display: 'flex',
                            flexDirection: 'column'
                          }
                        }}
                      >
                        <ProductCard product={product} />
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
                borderRadius: 4,
                bgcolor: colors.white,
                border: `2px dashed ${alpha(colors.primary, 0.3)}`,
                textAlign: 'center',
                p: 4,
                boxShadow: `0 8px 24px ${alpha(colors.mediumGray, 0.08)}`
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: alpha(colors.primary, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: `3px solid ${alpha(colors.primary, 0.2)}`
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '3rem',
                    opacity: 0.6,
                    filter: `drop-shadow(0 2px 4px ${alpha(colors.primary, 0.3)})`
                  }}
                >
                  💎
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  color: colors.darkGray
                }}
              >
                No jewellery found
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  maxWidth: 400,
                  color: colors.mediumGray
                }}
              >
                We couldn't find any jewellery matching your current filters. 
                Try adjusting your category selection or search criteria.
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Floating Action Button for Mobile Filters */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            {/* This could be a filter FAB for mobile */}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductLayout;
