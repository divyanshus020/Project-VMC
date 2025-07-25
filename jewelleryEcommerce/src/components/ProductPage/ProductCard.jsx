import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Box,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  VisibilityOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductImageSection from './ProductImageSection';
import ProductDetailsSection from './ProductDetailsSection';

const ProductCard = ({ product }) => {
  // Add debug log
  console.log('ProductCard received product:', product);

  // Destructure needed properties with defaults
  const {
    id,
    name = 'Product Name',
    imageUrl,
    images = [],
    category = 'Uncategorized',
    price = 0,
  } = product || {};

  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Enhanced authentication check
  const isUserLoggedIn = () => {
    try {
      // Check multiple possible token storage locations
      const token = localStorage.getItem('authToken') || 
                    localStorage.getItem('token') || 
                    sessionStorage.getItem('authToken') ||
                    sessionStorage.getItem('token') ||
                    localStorage.getItem('userToken') ||
                    sessionStorage.getItem('userToken');
      
      // Optional: Check if token is expired (if you store expiry info)
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        // Token is expired, clean up
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userToken');
        return false;
      }
      
      // Check if token is valid (not null, undefined, or empty string)
      return !!(token && token !== 'undefined' && token !== 'null' && token.trim() !== '');
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in for favorites functionality
    if (!isUserLoggedIn()) {
      // Store the current page for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login', { 
        state: { 
          message: 'Please login to add items to favorites',
          from: 'favorites'
        }
      });
      return;
    }
    
    setIsFavorited(!isFavorited);
    // Here you would typically make an API call to update favorites
    console.log(`${isFavorited ? 'Removed from' : 'Added to'} favorites:`, product.name);
  };

  const handleViewProduct = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (isUserLoggedIn()) {
        navigate(`/products/${product.id}`);
      } else {
        const intendedDestination = `/products/${product.id}`;
        localStorage.setItem('redirectAfterLogin', intendedDestination);
        navigate('/login', { 
          state: { 
            message: 'Please login to view product details',
            redirectTo: intendedDestination,
            productName: product.name,
            from: 'productCard'
          }
        });
      }
    } catch (error) {
      console.error('Error handling product view:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    
    // Enhanced share functionality
    const shareData = {
      title: product.name,
      text: `Check out this beautiful jewelry: ${product.name}`,
      url: `${window.location.origin}/product/${product.id}`
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('Product shared successfully'))
        .catch((error) => console.log('Error sharing product:', error));
    } else {
      // Fallback: Copy to clipboard
      const shareUrl = `${window.location.origin}/product/${product.id}`;
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          console.log('Product URL copied to clipboard');
          // You could show a toast notification here
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Check if user is logged in for cart functionality
    if (!isUserLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login', { 
        state: { 
          message: 'Please login to add items to cart',
          from: 'cart'
        }
      });
      return;
    }

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product._id);
    if (existingIndex > -1) {
      // If already in cart, increase quantity
      cart[existingIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        id: product._id,
        name: product.name,
        image: product.imageUrl || (product.images && product.images[0]),
        price: product.price || 999,
        category: product.category,
        quantity: 1,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Optionally show a toast or redirect to cart
    // navigate('/cart');
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
          height: 480,
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
        {/* Product Image Section */}
        <ProductImageSection
          product={product}
          colors={colors}
          isHovered={isHovered}
          onFavoriteClick={handleFavoriteClick}
          onShare={handleShare}
          isFavorited={isFavorited}
        />

        {/* Product Details Section */}
        <ProductDetailsSection
          product={product}
          colors={colors}
        />

        {/* Action Buttons Section */}
        <Box sx={{ p: 2.5, pt: 0 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            {/* View Details Button */}
            <Button
              variant="contained"
              startIcon={
                isLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <VisibilityOutlined sx={{ fontSize: 16 }} />
                )
              }
              onClick={handleViewProduct}
              disabled={isLoading}
              sx={{
                flex: 1,
                background: isLoading 
                  ? colors.mediumGray 
                  : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2,
                py: 1,
                color: colors.white,
                boxShadow: isLoading 
                  ? 'none' 
                  : `0 6px 20px ${alpha(colors.primary, 0.25)}`,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '&:hover': {
                  transform: isLoading ? 'none' : 'translateY(-1px)',
                  boxShadow: isLoading 
                    ? 'none' 
                    : `0 8px 24px ${alpha(colors.primary, 0.35)}`,
                  background: isLoading 
                    ? colors.mediumGray 
                    : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                },
                '&:active': {
                  transform: isLoading ? 'none' : 'translateY(0)',
                },
                '&:disabled': {
                  background: colors.mediumGray,
                  color: colors.white,
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? 'Loading...' : 'View Details'}
            </Button>
          </Box>
        </Box>

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

        {/* Loading Overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: alpha(colors.white, 0.8),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(2px)',
            }}
          >
            <CircularProgress 
              size={40} 
              sx={{ 
                color: colors.primary,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }} 
            />
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;