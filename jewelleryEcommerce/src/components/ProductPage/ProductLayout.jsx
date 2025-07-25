// components/ProductLayout/ProductLayout.js
import React, { useState, useMemo } from 'react';
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
  // Helper function to safely extract the products array from various API response structures
  const getProductsArray = (productsData) => {
    if (Array.isArray(productsData)) return productsData;
    if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
    if (productsData?.success && productsData.data && Array.isArray(productsData.data)) return productsData.data;
    return [];
  };

  const safeProducts = getProductsArray(products);

  // --- STATE MANAGEMENT for filters and sorting ---
  const [sortOption, setSortOption] = useState('nameAZ');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Add state for the new Die No filter
  const [selectedDieNo, setSelectedDieNo] = useState('All');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Color scheme
  const colors = {
    primary: '#D4AF37',
    darkGray: '#333333',
    mediumGray: '#666666',
    lightGray: '#F5F5F5',
    white: '#FFFFFF'
  };

  // --- FILTERING AND SORTING LOGIC ---
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = [...safeProducts];

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p?.category === selectedCategory);
    }

    // 2. Filter by Die No
    if (selectedDieNo !== 'All') {
      filtered = filtered.filter(product => 
        product.sizes?.some(size => size.dieNo === selectedDieNo)
      );
    }
    
    // 3. Apply Sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      switch (sortOption) {
        case 'priceLowHigh':
          return (a.price || 0) - (b.price || 0);
        case 'priceHighLow':
          return (b.price || 0) - (a.price || 0);
        case 'nameAZ':
          return (a.name || '').localeCompare(b.name || '');
        case 'nameZA':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [safeProducts, selectedCategory, selectedDieNo, sortOption]);


  // Compute categories from products only. The 'All' option is hardcoded
  // in the child Category component, so we remove it from here to prevent duplicates.
  const categories = useMemo(() => 
    [...new Set(safeProducts.map((p) => p?.category).filter(Boolean))]
  , [safeProducts]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: colors.lightGray }}>
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <ProductHeader colors={colors} />

        <ProductFilters
          colors={colors}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortedProducts={sortedAndFilteredProducts}
          loading={loading}
          selectedDieNo={selectedDieNo}
          setSelectedDieNo={setSelectedDieNo}
        />

        <ProductGrid
          colors={colors}
          sortedProducts={sortedAndFilteredProducts}
          selectedCategory={selectedCategory}
          // FIX: Pass the categories array to the ProductGrid component
          categories={categories}
        />

        {isMobile && (
          <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
            {/* Mobile filter FAB here */}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductLayout;
