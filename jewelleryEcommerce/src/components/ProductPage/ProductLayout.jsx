// components/ProductLayout/ProductLayout.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress
} from '@mui/material';
import ProductHeader from './ProductHeader';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';

const ProductLayout = ({ products = [], loading = false }) => {
  // Add debug logs
  console.log('ProductLayout received products:', products);
  console.log('Loading state:', loading);

  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Jewelry ecommerce color scheme
  const colors = {
    primary: '#D4AF37',
    darkGray: '#333333',
    mediumGray: '#666666',
    lightGray: '#F5F5F5',
    white: '#FFFFFF'
  };

  // Only compute categories if products array exists
  const categories = Array.from(
    new Set(products?.map((p) => p.category) || [])
  );

  // Filter products only if they exist
  const filteredProducts = !products ? [] :
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Sort products only if they exist
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    if (!a || !b) return 0;
    
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
        return (a.title || '').localeCompare(b.title || '');
      case 'nameZA':
        return (b.title || '').localeCompare(a.title || '');
      default:
        return 0;
    }
  });

  // Log filtered and sorted products
  console.log('Filtered products:', filteredProducts);
  console.log('Sorted products:', sortedProducts);

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: colors.lightGray
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

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
        <ProductHeader colors={colors} />

        {/* Filter and Sort Controls + Products Counter */}
        <ProductFilters
          colors={colors}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortedProducts={sortedProducts}
          loading={loading}
        />

        {/* Products Grid */}
        <ProductGrid
          colors={colors}
          loading={loading}
          sortedProducts={sortedProducts}
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          categories={categories}
        />

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
            {/* Mobile filter FAB here */}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductLayout;