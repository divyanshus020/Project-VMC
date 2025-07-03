// components/ProductLayout/ProductGrid.js
import React from 'react';
import { Grid, Box, Paper, Stack, Skeleton, Typography, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  colors, 
  loading, 
  sortedProducts, 
  selectedCategory, 
  sortOption,
  categories 
}) => {
  // Group products by category
  const groupedProducts = React.useMemo(() => {
    const grouped = {};
    
    // If "All" is selected, show all categories
    if (selectedCategory === 'All') {
      categories.forEach(category => {
        grouped[category] = sortedProducts.filter(product => product.category === category);
      });
    } else {
      // If specific category is selected, only show that category
      grouped[selectedCategory] = sortedProducts;
    }
    
    // Remove empty categories
    Object.keys(grouped).forEach(category => {
      if (grouped[category].length === 0) {
        delete grouped[category];
      }
    });
    
    return grouped;
  }, [sortedProducts, selectedCategory, categories]);

  // Category Header Component
  const CategoryHeader = ({ category, productCount }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box 
        sx={{ 
          mb: 5, 
          mt: 6,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Decorative top line */}
        <Box
          sx={{
            height: 1,
            bgcolor: alpha(colors.primary, 0.2),
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 3,
              bgcolor: colors.primary,
              borderRadius: 2,
              boxShadow: `0 0 12px ${alpha(colors.primary, 0.4)}`
            }
          }}
        />
        
        {/* Category Title */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
            background: `linear-gradient(135deg, ${colors.primary}, ${alpha(colors.primary, 0.7)})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textShadow: `0 2px 4px ${alpha(colors.primary, 0.2)}`,
            letterSpacing: '-0.02em'
          }}
        >
          {category}
        </Typography>

        {/* Product Count Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: alpha(colors.primary, 0.1),
            color: colors.primary,
            px: 3,
            py: 1,
            borderRadius: 50,
            fontSize: '0.95rem',
            fontWeight: 600,
            border: `2px solid ${alpha(colors.primary, 0.3)}`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 20px ${alpha(colors.primary, 0.15)}`,
            mb: 3
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: colors.primary,
              boxShadow: `0 0 8px ${alpha(colors.primary, 0.5)}`
            }}
          />
          {productCount} {productCount === 1 ? 'Exclusive Piece' : 'Exclusive Pieces'}
        </Box>

        {/* Decorative bottom accent */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            mb: 2
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 2,
              bgcolor: alpha(colors.primary, 0.3),
              borderRadius: 1
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: colors.primary,
              boxShadow: `0 0 12px ${alpha(colors.primary, 0.4)}`
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 2,
              bgcolor: alpha(colors.primary, 0.3),
              borderRadius: 1
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
  // Loading skeleton component
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
  

  // Empty State Component
  const EmptyState = () => (
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
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <Grid 
              container 
              spacing={{ xs: 2, md: 3 }} 
              sx={{ 
                justifyContent: 'center',
                alignItems: 'stretch',
                '& .MuiGrid-item': {
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} colors={colors} />
              ))}
            </Grid>
          ) : Object.keys(groupedProducts).length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              key={selectedCategory + sortOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {Object.entries(groupedProducts).map(([category, products], categoryIndex) => (
                <Box key={category} sx={{ mb: 10 }}>
                  {/* Always show category header, centered */}
                  <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                    <CategoryHeader 
                      category={category} 
                      productCount={products.length} 
                    />
                  </Box>
                  {/* Products Grid for this category */}
                  <Grid 
                    container 
                    spacing={{ xs: 2, md: 3 }} 
                    sx={{ 
                      justifyContent: 'center',
                      alignItems: 'stretch',
                      '& .MuiGrid-item': {
                        display: 'flex',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    {products.map((product, index) => (
                      <Grid
                        item
                        key={product.id}
                        xs={12}
                        sm={6}
                        md={3}
                        lg={3}
                        xl={3}
                        sx={{ 
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'stretch'
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: (categoryIndex * 0.2) + (index * 0.1),
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          style={{ 
                            width: '100%',
                            maxWidth: '320px',
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
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
                </Box>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default ProductGrid;