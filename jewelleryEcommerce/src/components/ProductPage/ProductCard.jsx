import React, { useState } from 'react';
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
  Fade
} from '@mui/material';
import {
  FavoriteOutlined,
  Favorite,
  ShoppingCartOutlined,
  VisibilityOutlined,
  StarRounded
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();

  // Jewellery Color Scheme
  const colors = {
    primary: '#D4AF37', // Gold
    darkGray: '#333333', // Dark text
    mediumGray: '#666666', // Secondary text
    lightGray: '#F5F5F5', // Backgrounds
    white: '#FFFFFF', // Card backgrounds
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleEnquiryClick = (e) => {
    e.stopPropagation();
    // Add your enquiry logic here
    console.log('Enquiry for:', product.title);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Add your quick view logic here
    console.log('Quick view for:', product.title);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          borderRadius: 4,
          height: 440,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: colors.white,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(colors.lightGray, 0.8)}`,
          boxShadow: `
            0 4px 20px ${alpha(colors.darkGray, 0.08)},
            0 1px 3px ${alpha(colors.darkGray, 0.05)}
          `,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: `
              0 20px 40px ${alpha(colors.darkGray, 0.15)},
              0 8px 16px ${alpha(colors.darkGray, 0.1)}
            `,
            '& .product-overlay': {
              opacity: 1,
              transform: 'translateY(0)',
            },
            '& .product-image': {
              transform: 'scale(1.1)',
            },
            '& .favorite-btn': {
              opacity: 1,
              transform: 'translateY(0)',
            }
          },
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            height: 220,
            overflow: 'hidden',
            bgcolor: colors.lightGray,
          }}
        >
          {/* Image */}
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            className="product-image"
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: imageLoaded ? 'none' : 'blur(10px)',
            }}
          />

          {/* Image Overlay */}
          <Box
            className="product-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(
                180deg,
                ${alpha(colors.darkGray, 0)} 0%,
                ${alpha(colors.darkGray, 0.4)} 100%
              )`,
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<VisibilityOutlined />}
              onClick={handleQuickView}
              sx={{
                bgcolor: alpha(colors.white, 0.95),
                color: colors.darkGray,
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                border: `1px solid ${alpha(colors.primary, 0.3)}`,
                '&:hover': {
                  bgcolor: colors.white,
                  transform: 'translateY(-2px)',
                  borderColor: colors.primary,
                  color: colors.primary,
                },
              }}
            >
              Quick View
            </Button>
          </Box>

          {/* Favorite Button */}
          <IconButton
            className="favorite-btn"
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: alpha(colors.white, 0.95),
              backdropFilter: 'blur(10px)',
              width: 40,
              height: 40,
              opacity: 0,
              transform: 'translateY(-10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `1px solid ${alpha(colors.lightGray, 0.5)}`,
              '&:hover': {
                bgcolor: colors.white,
                transform: 'translateY(-10px) scale(1.1)',
                borderColor: colors.primary,
              },
            }}
          >
            {isFavorited ? (
              <Favorite sx={{ color: '#E53E3E', fontSize: 20 }} />
            ) : (
              <FavoriteOutlined sx={{ fontSize: 20, color: colors.mediumGray }} />
            )}
          </IconButton>

          {/* Category Badge */}
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: alpha(colors.primary, 0.15),
                color: colors.primary,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.primary, 0.3)}`,
              }}
            />
          )}

          {/* Rating Badge */}
          {product.rating && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: alpha(colors.white, 0.95),
                backdropFilter: 'blur(10px)',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                border: `1px solid ${alpha(colors.lightGray, 0.5)}`,
              }}
            >
              <StarRounded sx={{ color: colors.primary, fontSize: 16 }} />
              <Typography 
                variant="caption" 
                fontWeight={600}
                sx={{ color: colors.darkGray }}
              >
                {product.rating}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content */}
        <CardContent
          sx={{
            p: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            bgcolor: colors.white,
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              mb: 1,
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.6em',
              color: colors.darkGray,
            }}
          >
            {product.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: colors.mediumGray,
              fontSize: '0.875rem',
              mb: 2,
              flexGrow: 1,
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Typography>

          {/* Price and Action */}
          <Box sx={{ mt: 'auto' }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.mediumGray,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Starting from
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B8941F)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  {product.price}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<ShoppingCartOutlined />}
                onClick={handleEnquiryClick}
                sx={{
                  background: `linear-gradient(135deg, ${colors.primary}, #B8941F)`,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  minWidth: 120,
                  color: colors.white,
                  boxShadow: `0 4px 12px ${alpha(colors.primary, 0.3)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px ${alpha(colors.primary, 0.4)}`,
                    background: `linear-gradient(135deg, #B8941F, ${colors.primary})`,
                  },
                }}
              >
                Enquire
              </Button>
            </Stack>
          </Box>
        </CardContent>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(colors.primary, 0.08)} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </Card>
    </motion.div>
  );
};

export default ProductCard;
