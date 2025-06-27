import React from 'react';
import {
  CardContent,
  Typography,
  Box,
  Divider,
  alpha,
} from '@mui/material';
import {
  StarRounded,
} from '@mui/icons-material';

const ProductDetailsSection = ({ product, colors }) => {
  return (
    <CardContent
      className="product-details"
      sx={{
        p: 2.5,
        flexGrow: 1,
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        bgcolor: colors.white,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Product Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 700,
          fontSize: '1.1rem',
          mb: 1.5,
          lineHeight: 1.4,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          minHeight: '2.6em',
          color: colors.darkGray,
          fontFamily: '"Playfair Display", serif',
        }}
      >
        {product.name}
      </Typography>

      {/* Elegant Divider */}
      <Divider 
        sx={{ 
          mb: 1.5,
          borderColor: alpha(colors.primary, 0.1),
          '&::before, &::after': {
            borderColor: alpha(colors.primary, 0.1),
          }
        }} 
      />
      
      {/* Price Section (if available) */}
      {product.price && (
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              color: colors.primary,
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            ₹{product.price.toLocaleString()}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography
              variant="body2"
              sx={{
                color: colors.mediumGray,
                textDecoration: 'line-through',
                fontSize: '0.85rem',
                mt: 0.5,
              }}
            >
              ₹{product.originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      )}

      {/* Rating Section (if available) */}
      {product.rating && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <StarRounded sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
          <Typography
            variant="body2"
            sx={{
              color: colors.mediumGray,
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {product.rating} {product.reviewCount && `(${product.reviewCount} reviews)`}
          </Typography>
        </Box>
      )}
    </CardContent>
  );
};

export default ProductDetailsSection;