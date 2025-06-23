import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/catalogue/vmc.png';
import LogoutConfirmation from '../AuthPage/ConfirmLogoutDialog'; // Import the confirmation component
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  TextField,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  ShoppingCartOutlined,
  PersonOutline,
  Menu as MenuIcon,
  AccountCircle,
  ListAlt,
  Logout
} from '@mui/icons-material';

// Navigation links data
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' }
];

const MainNavbar = ({ onMobileMenuToggle, onLogout }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Check for token in localStorage on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    // Check initial auth status
    checkAuthStatus();

    // Listen for storage changes (useful for multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'authToken' || e.key === 'accessToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Dynamic user menu items based on login status (removed logout from dropdown)
  const userMenuItems = isLoggedIn ? [
    { icon: <PersonOutline />, label: 'My Profile', key: 'profile', href: '/profile' },
    { icon: <ListAlt />, label: 'My Orders', key: 'orders', href: '/orders' },
    { icon: <FavoriteBorder />, label: 'Wishlist', key: 'wishlist', href: '/wishlist' }
  ] : [
    { icon: <AccountCircle />, label: 'Login / Register', key: 'login', href: '/login' }
  ];

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search logic here
    console.log('Search:', searchValue);
  };

  const handleMenuItemClick = (item) => {
    handleUserMenuClose();
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false);
    
    // Clear all possible token keys from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    
    // Update local state
    setIsLoggedIn(false);
    
    // Call parent logout handler if provided
    if (onLogout) {
      onLogout();
    }
    
    // Redirect to home or login page
    navigate('/');
    
    // Optional: Show success message
    console.log('User logged out successfully');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0'
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: '64px !important' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
              <Button
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: '#D4AF37',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#B8941F'
                  },
                  p: 0,
                  minWidth: 'auto',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <img
                  src={Logo}
                  alt="VMC Logo"
                  style={{
                    width: '100%',
                    maxWidth: 130,
                    height: 'auto',
                    marginRight: 8,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  className="hidden sm:block"
                  sizes="(max-width: 100px) 120px, 200px"
                />
              </Button>
            </Box>

            {/* Desktop Navigation Menu */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                gap: 4,
                mx: 'auto',
                alignItems: 'center'
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.href}
                  sx={{
                    color: location.pathname === link.href ? '#D4AF37' : '#666666',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#D4AF37'
                    },
                    '&::after': location.pathname === link.href ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#D4AF37'
                    } : {}
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Search Bar - Desktop */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                maxWidth: '320px',
                mx: 2,
                flexGrow: 1,
                justifyContent: 'center'
              }}
            >
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#D4AF37'
                  }
                }}
              >
                <TextField
                  placeholder="Search diamonds, gold, silver..."
                  variant="outlined"
                  size="small"
                  value={searchValue}
                  onChange={handleSearchChange}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      '& fieldset': {
                        border: 'none'
                      }
                    }
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{
                    backgroundColor: '#D4AF37',
                    color: 'white',
                    borderRadius: '0 4px 4px 0',
                    '&:hover': {
                      backgroundColor: '#B8941F'
                    },
                    mx: 0.5
                  }}
                >
                  <Search />
                </IconButton>
              </Paper>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              {/* Conditional rendering based on login status */}
              {isLoggedIn ? (
                <>
                  {/* User Account - Only show when logged in */}
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      color: '#666666',
                      '&:hover': { color: '#D4AF37' },
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    <PersonOutline />
                    <Typography sx={{ ml: 1, display: { xs: 'none', lg: 'block' }, fontSize: '0.875rem' }}>
                      Account
                    </Typography>
                  </IconButton>

                  {/* Wishlist */}
                  <IconButton
                    component={Link}
                    to="/wishlist"
                    sx={{
                      color: '#666666',
                      '&:hover': { color: '#e91e63', transform: 'scale(1.05)' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                      <FavoriteBorder />
                    </Badge>
                    <Typography sx={{ ml: 1, display: { xs: 'none', lg: 'block' }, fontSize: '0.875rem' }}>
                      Wishlist
                    </Typography>
                  </IconButton>

                  {/* Shopping Cart */}
                  <IconButton
                    component={Link}
                    to="/cart"
                    sx={{
                      color: '#666666',
                      '&:hover': { color: '#D4AF37', transform: 'scale(1.05)' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Badge badgeContent={2} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', backgroundColor: '#D4AF37' } }}>
                      <ShoppingCartOutlined />
                    </Badge>
                    <Typography sx={{ ml: 1, display: { xs: 'none', lg: 'block' }, fontSize: '0.875rem' }}>
                      Cart
                    </Typography>
                  </IconButton>

                  {/* Logout Button - Only show when logged in */}
                  <IconButton
                    onClick={handleLogoutClick}
                    sx={{
                      color: '#666666',
                      '&:hover': { color: '#f44336', transform: 'scale(1.05)' },
                      transition: 'all 0.2s',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    <Logout />
                    <Typography sx={{ ml: 1, display: { xs: 'none', lg: 'block' }, fontSize: '0.875rem' }}>
                      Logout
                    </Typography>
                  </IconButton>
                </>
              ) : (
                <>
                  {/* Login/Register Button - Only show when not logged in */}
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      color: '#D4AF37',
                      borderColor: '#D4AF37',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#D4AF37',
                        color: 'white',
                        borderColor: '#D4AF37'
                      },
                      display: { xs: 'none', sm: 'flex' },
                      fontSize: '0.875rem'
                    }}
                  >
                    Login / Register
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <IconButton
                onClick={onMobileMenuToggle}
                sx={{
                  color: '#666666',
                  '&:hover': { color: '#D4AF37' },
                  display: { xs: 'flex', lg: 'none' }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile Search Bar */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 2, px: 2 }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }}
            >
              <TextField
                placeholder="Search jewelry..."
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    '& fieldset': {
                      border: 'none'
                    }
                  }
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  backgroundColor: '#D4AF37',
                  color: 'white',
                  borderRadius: '0 4px 4px 0',
                  '&:hover': {
                    backgroundColor: '#B8941F'
                  },
                  mx: 0.5
                }}
              >
                <Search />
              </IconButton>
            </Paper>
          </Box>
        </Container>
      </AppBar>

 {/* User Menu Dropdown - Only show when logged in */}
      {isLoggedIn && (
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              minWidth: '200px'
            }
          }}
        >
          {userMenuItems.map((item, index) => (
            <MenuItem
              key={item.key}
              component={item.href ? Link : 'div'}
              to={item.href}
              onClick={() => handleMenuItemClick(item)}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.08)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: '36px', color: '#666666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        open={showLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default MainNavbar;