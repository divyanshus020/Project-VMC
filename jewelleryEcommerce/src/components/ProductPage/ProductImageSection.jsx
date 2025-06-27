import React, { useState } from 'react';
import {
  Box,
  CardMedia,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  FavoriteOutlined,
  Favorite,
  ShareOutlined,
  DiamondOutlined,
} from '@mui/icons-material';

const ProductImageSection = ({ 
  product, 
  colors, 
  isHovered, 
  onFavoriteClick, 
  onShare, 
  isFavorited 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        height: 320,
        overflow: 'hidden',
        bgcolor: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightGray} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${alpha(colors.primary, 0.02)} 0%, transparent 50%)`,
          zIndex: 1,
        }
      }}
    >
      {/* Main Product Image */}
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        onLoad={() => setImageLoaded(true)}
        className="product-image"
        sx={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          filter: imageLoaded ? 'none' : 'blur(8px)',
          zIndex: 2,
          position: 'relative',
        }}
      />

      {/* Action Buttons Stack */}
      <Stack
        className="action-buttons"
        spacing={1}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          opacity: 0,
          transform: 'translateX(20px)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 4,
        }}
      >
        {/* Favorite Button */}
        <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"} placement="left">
          <IconButton
            onClick={onFavoriteClick}
            sx={{
              bgcolor: alpha(colors.white, 0.95),
              backdropFilter: 'blur(20px)',
              width: 44,
              height: 44,
              border: `1px solid ${alpha(colors.lightGray, 0.5)}`,
              boxShadow: `0 4px 16px ${alpha(colors.darkGray, 0.1)}`,
              '&:hover': {
                bgcolor: colors.white,
                transform: 'scale(1.1)',
                borderColor: isFavorited ? '#E53E3E' : colors.primary,
                boxShadow: `0 8px 24px ${alpha(colors.darkGray, 0.15)}`,
              },
            }}
          >
            {isFavorited ? (
              <Favorite sx={{ color: '#E53E3E', fontSize: 20 }} />
            ) : (
              <FavoriteOutlined sx={{ fontSize: 20, color: colors.mediumGray }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Share Button */}
        <Tooltip title="Share product" placement="left">
          <IconButton
            onClick={onShare}
            sx={{
              bgcolor: alpha(colors.white, 0.95),
              backdropFilter: 'blur(20px)',
              width: 44,
              height: 44,
              border: `1px solid ${alpha(colors.lightGray, 0.5)}`,
              boxShadow: `0 4px 16px ${alpha(colors.darkGray, 0.1)}`,
              '&:hover': {
                bgcolor: colors.white,
                transform: 'scale(1.1)',
                borderColor: colors.primary,
                boxShadow: `0 8px 24px ${alpha(colors.darkGray, 0.15)}`,
              },
            }}
          >
            <ShareOutlined sx={{ fontSize: 18, color: colors.mediumGray }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Premium Category Badge */}
      {product.category && (
        <Chip
          icon={<DiamondOutlined sx={{ fontSize: 16 }} />}
          label={product.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: alpha(colors.primary, 0.12),
            color: colors.accent,
            fontWeight: 700,
            fontSize: '0.75rem',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(colors.primary, 0.25)}`,
            px: 1,
            zIndex: 4,
            '& .MuiChip-icon': {
              color: colors.primary,
            },
          }}
        />
      )}

      {/* Decorative Corner Element */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.primary, 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Loading Shimmer Effect */}
      {!imageLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 320,
            background: `linear-gradient(
              90deg,
              ${colors.lightGray} 0%,
              ${alpha(colors.primary, 0.1)} 50%,
              ${colors.lightGray} 100%
            )`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
            zIndex: 1,
            '@keyframes shimmer': {
              '0%': {
                backgroundPosition: '-200% 0',
              },
              '100%': {
                backgroundPosition: '200% 0',
              },
            },
          }}
        />
      )}

      {/* Premium Badge for Special Items */}
      {product.isPremium && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: 20,
            bgcolor: colors.darkGray,
            color: colors.primary,
            px: 2,
            py: 0.5,
            borderRadius: '0 0 12px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            zIndex: 5,
            boxShadow: `0 4px 12px ${alpha(colors.darkGray, 0.3)}`,
          }}
        >
          Premium
        </Box>
      )}

      {/* Sale Badge */}
      {product.onSale && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: product.category ? 80 : 16,
            bgcolor: '#E53E3E',
            color: colors.white,
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            zIndex: 4,
            boxShadow: `0 2px 8px ${alpha('#E53E3E', 0.3)}`,
          }}
        >
          Sale
        </Box>
      )}

      {/* Availability Indicator */}
      {product.inStock !== undefined && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: alpha(
              product.inStock ? '#10B981' : '#EF4444', 
              0.1
            ),
            color: product.inStock ? '#10B981' : '#EF4444',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: `1px solid ${alpha(
              product.inStock ? '#10B981' : '#EF4444', 
              0.2
            )}`,
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: product.inStock ? '#10B981' : '#EF4444',
            }}
          />
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Box>
      )}

      {/* Discount Percentage */}
      {product.originalPrice && product.price && product.originalPrice > product.price && (
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            left: 16,
            bgcolor: colors.primary,
            color: colors.white,
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            zIndex: 4,
            boxShadow: `0 2px 8px ${alpha(colors.primary, 0.3)}`,
          }}
        >
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
        </Box>
      )}
    </Box>
  );
};

export default ProductImageSection;