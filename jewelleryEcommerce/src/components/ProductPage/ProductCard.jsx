import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Zoom,
  Fade,
  Divider
} from '@mui/material';
import {
  FavoriteOutlined,
  Favorite,
  ShoppingCartOutlined,
  VisibilityOutlined,
  StarRounded,
  DiamondOutlined,
  LocalOfferOutlined,
  ShareOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Enhanced Luxury Color Scheme
  const colors = {
    primary: '#D4AF37', // Gold
    secondary: '#C9A96E', // Light Gold
    accent: '#8B7355', // Bronze
    darkGray: '#1A1A1A', // Rich Black
    mediumGray: '#4A4A4A', // Charcoal
    lightGray: '#F8F8F8', // Pearl White
    white: '#FFFFFF',
    cream: '#FEFCF7', // Warm White
    shadow: 'rgba(0, 0, 0, 0.08)',
  };

  // Check if user is logged in
  const isUserLoggedIn = () => {
    // Option 1: Check localStorage/sessionStorage for token
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    // Option 2: If you're using a different storage key, replace 'authToken' with your key
    // const user = localStorage.getItem('user');
    // const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    return !!token; // Returns true if token exists, false otherwise
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (isUserLoggedIn()) {
      // User is logged in - navigate to product detail page
      console.log('User is logged in, navigating to product:', product.name);
      navigate(`/product/${product.id}`);
    } else {
      // User is NOT logged in - redirect to login page
      console.log('User not logged in, redirecting to login');
      // Store the intended destination to redirect back after login
      localStorage.setItem('redirectAfterLogin', `/product/${product.id}`);
      navigate('/login');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    console.log('Share:', product.name);
  };

  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.4
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          borderRadius: '24px',
          height: 460,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: colors.white,
          border: `2px solid ${colors.lightGray}`,
          boxShadow: `
            0 8px 32px ${alpha(colors.darkGray, 0.06)},
            0 2px 8px ${alpha(colors.darkGray, 0.04)}
          `,
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            borderColor: alpha(colors.primary, 0.3),
            boxShadow: `
              0 24px 64px ${alpha(colors.darkGray, 0.12)},
              0 12px 24px ${alpha(colors.primary, 0.08)}
            `,
            '& .product-image': {
              transform: 'scale(1.08)',
            },
            '& .action-buttons': {
              opacity: 1,
              transform: 'translateX(0)',
            },
            '& .product-details': {
              transform: 'translateY(-4px)',
            }
          },
        }}
      >
        {/* Premium Image Container */}
        <Box
          sx={{
            position: 'relative',
            height: 280,
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
                onClick={handleFavoriteClick}
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
                onClick={handleShare}
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
        </Box>

        {/* Enhanced Content Section */}
        <CardContent
          className="product-details"
          sx={{
            p: 3,
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
              fontSize: '1.2rem',
              mb: 2,
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.8em',
              color: colors.darkGray,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {product.name}
          </Typography>

          {/* Elegant Divider */}
          <Divider 
            sx={{ 
              mb: 2, 
              borderColor: alpha(colors.primary, 0.1),
              '&::before, &::after': {
                borderColor: alpha(colors.primary, 0.1),
              }
            }} 
          />

          {/* Price Section (if available) */}
          {product.price && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: colors.primary,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                ₹{product.price.toLocaleString()}
              </Typography>
            </Box>
          )}

          {/* Action Button */}
          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<VisibilityOutlined />}
              onClick={handleViewProduct}
              fullWidth
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                borderRadius: '16px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                px: 3,
                py: 1.5,
                color: colors.white,
                boxShadow: `0 8px 24px ${alpha(colors.primary, 0.25)}`,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 32px ${alpha(colors.primary, 0.35)}`,
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>

        {/* Premium Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(colors.secondary, 0.06)} 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Subtle Border Accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, 
              ${colors.primary} 0%, 
              ${colors.secondary} 50%, 
              ${colors.accent} 100%
            )`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 5,
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
              height: 280,
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
      </Card>
    </motion.div>
  );
};

export default ProductCard;

