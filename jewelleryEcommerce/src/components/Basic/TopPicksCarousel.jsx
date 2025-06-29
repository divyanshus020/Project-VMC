import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PlayArrow, Pause } from '@mui/icons-material';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { Navigation, FreeMode, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { getProducts } from '../../lib/api'; // Ensure correct path

const TopPicksCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        if (Array.isArray(res)) setProducts(res);
        else if (res?.data) setProducts(res.data);
        else if (res?.products) setProducts(res.products);
        else throw new Error('Invalid data format');
      } catch (err) {
        console.error('Product fetch error:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAutoplayToggle = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (isAutoplayPaused) {
        swiperRef.current.swiper.autoplay.start();
        setIsAutoplayPaused(false);
      } else {
        swiperRef.current.swiper.autoplay.stop();
        setIsAutoplayPaused(true);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (swiperRef.current && swiperRef.current.swiper && !isAutoplayPaused) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography 
            sx={{ 
              fontSize: '1.2rem',
              color: '#7f8c8d',
              animation: 'pulse 1.5s ease-in-out infinite alternate'
            }}
          >
            Loading products...
          </Typography>
        </Box>
      );
    }
    
    if (error) {
      return (
        <Typography 
          color="error" 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            fontSize: '1.1rem',
            animation: 'shake 0.5s ease-in-out'
          }}
        >
          {error}
        </Typography>
      );
    }
    
    if (!products.length) {
      return (
        <Typography sx={{ textAlign: 'center', py: 4, color: '#7f8c8d' }}>
          No products available
        </Typography>
      );
    }

    return (
      <Box 
        sx={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Autoplay Control Button */}
        <IconButton
          onClick={handleAutoplayToggle}
          sx={{
            position: 'absolute',
            top: -60,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#2c3e50',
              color: 'white',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isAutoplayPaused ? <PlayArrow /> : <Pause />}
        </IconButton>

        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          slidesPerView={4}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          freeMode={{
            enabled: true,
            sticky: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          loop={products.length > 4}
          modules={[Navigation, FreeMode, Autoplay, Pagination]}
          style={{ 
            paddingBottom: '50px',
            paddingTop: '10px',
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            600: { slidesPerView: 2, spaceBetween: 15 },
            900: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="top-picks-swiper"
        >
          {products.map((product, idx) => (
            <SwiperSlide key={product.id || idx}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  mb: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0) scale(1)',
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .card-media': {
                      transform: 'scale(1.1)',
                    },
                    '& .card-overlay': {
                      opacity: 1,
                    },
                    '& .card-content': {
                      transform: 'translateY(-5px)',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-8px) scale(1.01)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={product.imageUrl}
                    alt={product.name}
                    className="card-media"
                    sx={{
                      objectFit: 'cover',
                      width: '100%',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                  {/* Hover Overlay */}
                  <Box
                    className="card-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(44, 62, 80, 0.8), rgba(52, 152, 219, 0.6))',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        transform: 'translateY(20px)',
                        transition: 'transform 0.3s ease 0.1s',
                        '.card-overlay:hover &': {
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      View Details
                    </Typography>
                  </Box>
                </Box>

                <CardContent 
                  className="card-content"
                  sx={{ 
                    flexGrow: 1, 
                    p: 2.5,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: '#2c3e50',
                      lineHeight: 1.4,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <Box
          className="swiper-button-prev-custom"
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 50,
            height: 50,
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.7,
            '&:hover': {
              backgroundColor: '#2c3e50',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
            },
            '&::after': {
              content: '"❮"',
              fontSize: '18px',
              fontWeight: 'bold',
            },
          }}
        />
        <Box
          className="swiper-button-next-custom"
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 50,
            height: 50,
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.7,
            '&:hover': {
              backgroundColor: '#2c3e50',
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
            },
            '&::after': {
              content: '"❯"',
              fontSize: '18px',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1.5}
        sx={{ 
          fontSize: { xs: '2rem', sm: '2.5rem' }, 
          color: '#2c3e50',
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            backgroundColor: '#3498db',
            borderRadius: '2px',
            animation: 'expandLine 2s ease-in-out infinite alternate',
          },
        }}
      >
        Our Top Picks
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#7f8c8d', 
          mb: 4,
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
        }}
      >
        A curated selection of our best products
      </Typography>
      <Box sx={{ overflow: 'visible', position: 'relative' }}>
        {renderContent()}
      </Box>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes expandLine {
          0% { width: 40px; }
          100% { width: 80px; }
        }

        .top-picks-swiper .swiper-pagination {
          bottom: 10px !important;
        }

        .top-picks-swiper .swiper-pagination-bullet {
          background: #3498db !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
        }

        .top-picks-swiper .swiper-pagination-bullet-active {
          opacity: 1 !important;
         transform: scale(1.2) !important;
          background: #2c3e50 !important;
        }

        .top-picks-swiper .swiper-slide {
          transition: all 0.3s ease !important;
        }

        .top-picks-swiper:hover .swiper-slide:not(:hover) {
          opacity: 0.7;
          transform: scale(0.95);
        }

        .top-picks-swiper .swiper-slide:hover {
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        /* Smooth entrance animation for cards */
        .top-picks-swiper .swiper-slide {
          animation: slideInUp 0.6s ease forwards;
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered animation delay for each slide */
        .top-picks-swiper .swiper-slide:nth-child(1) { animation-delay: 0.1s; }
        .top-picks-swiper .swiper-slide:nth-child(2) { animation-delay: 0.2s; }
        .top-picks-swiper .swiper-slide:nth-child(3) { animation-delay: 0.3s; }
        .top-picks-swiper .swiper-slide:nth-child(4) { animation-delay: 0.4s; }
        .top-picks-swiper .swiper-slide:nth-child(5) { animation-delay: 0.5s; }

        /* Loading shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Custom scrollbar for horizontal scroll */
        .top-picks-swiper::-webkit-scrollbar {
          height: 6px;
        }

        .top-picks-swiper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .top-picks-swiper::-webkit-scrollbar-thumb {
          background: #3498db;
          border-radius: 3px;
        }

        .top-picks-swiper::-webkit-scrollbar-thumb:hover {
          background: #2c3e50;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none !important;
          }
        }

        /* Floating animation for autoplay button */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .autoplay-button-floating {
          animation: float 3s ease-in-out infinite;
        }

        /* Gradient background animation */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-gradient {
          background: linear-gradient(-45deg, #3498db, #2c3e50, #e74c3c, #f39c12);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
    </Box>
  );
};

export default TopPicksCarousel;
