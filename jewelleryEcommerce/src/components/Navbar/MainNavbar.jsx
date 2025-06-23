import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const MainNavbar = ({ onMobileMenuToggle, isLoggedIn = false, onLogout }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Dynamic user menu items based on login status
  const userMenuItems = isLoggedIn ? [
    { icon: <PersonOutline />, label: 'My Profile', key: 'profile', href: '/profile' },
    { icon: <ListAlt />, label: 'My Orders', key: 'orders', href: '/orders' },
    { icon: <FavoriteBorder />, label: 'Wishlist', key: 'wishlist', href: '/wishlist' },
    { divider: true },
    { icon: <Logout />, label: 'Logout', key: 'logout', action: 'logout' }
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
    if (item.action === 'logout') {
      setShowLogoutConfirmation(true);
      handleUserMenuClose();
    } else {
      handleUserMenuClose();
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false);
    if (onLogout) {
      onLogout();
    }
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
              {/* User Account */}
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
                  {isLoggedIn ? 'Account' : 'Login'}
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

      {/* User Menu Dropdown */}
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
        {userMenuItems.map((item, index) =>
          item.divider ? (
            <Divider key={index} />
          ) : (
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
          )
        )}
      </Menu>

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