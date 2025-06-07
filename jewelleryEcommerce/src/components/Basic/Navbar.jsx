import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  ShoppingCartOutlined,
  PersonOutline,
  Menu as MenuIcon,
  Home,
  Diamond,
  Info,
  Phone,
  AccountCircle,
  ListAlt,
  LocalShipping,
  Support
} from '@mui/icons-material';

// Navigation links data
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/products' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' }
];

const mobileMenuLinks = [
  { icon: <Home />, label: 'Home', key: 'home', href: '/' },
  { icon: <Diamond />, label: 'Product', key: 'product', href: '/products' },
  { icon: <Info />, label: 'About us', key: 'about', href: '/about' },
  { icon: <Phone />, label: 'Contact us', key: 'contact', href: '/contact' }
];

const userMenuItems = [
  { icon: <PersonOutline />, label: 'My Profile', key: 'profile', href: '/profile' },
  { icon: <ListAlt />, label: 'My Orders', key: 'orders', href: '/orders' },
  { icon: <FavoriteBorder />, label: 'Wishlist', key: 'wishlist', href: '/wishlist' },
  { divider: true },
  { icon: <AccountCircle />, label: 'Login / Register', key: 'login', href: '/login' }
];

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search logic here
    console.log('Search:', searchValue);
  };

  return (
    <>
      {/* Top Header Bar */}
      <Box
        sx={{
          backgroundColor: '#1a1a1a',
          color: 'white',
          py: 1,
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              fontSize: '0.875rem'
            }}
          >
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📞 +91-9876543210
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              ✉️ info@luxegems.com
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Navbar */}
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
                  minWidth: 'auto'
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>💎</Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  LUXE GEMS
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  LG
                </Box>
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

              {/* Mobile Menu Button */}
              <IconButton
                onClick={handleMobileMenuToggle}
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
              component={Link}
              to={item.href}
              onClick={handleUserMenuClose}
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

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuVisible}
        onClose={() => setMobileMenuVisible(false)}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: '#fafafa'
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ p: 2, backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>💎</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4AF37' }}>
              LUXE GEMS
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        <List sx={{ pt: 0 }}>
          {mobileMenuLinks.map((link) => (
            <ListItem
              key={link.key}
              button
              component={Link}
              to={link.href}
              onClick={() => setMobileMenuVisible(false)}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.08)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#D4AF37', minWidth: '40px' }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Account Links */}
          <ListItem
            button
            component={Link}
            to="/profile"
            onClick={() => setMobileMenuVisible(false)}
            sx={{ py: 2 }}
          >
            <ListItemIcon sx={{ color: '#666666', minWidth: '40px' }}>
              <PersonOutline />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/orders"
            onClick={() => setMobileMenuVisible(false)}
            sx={{ py: 2 }}
          >
            <ListItemIcon sx={{ color: '#666666', minWidth: '40px' }}>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="My Orders" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/track-order"
            onClick={() => setMobileMenuVisible(false)}
            sx={{ py: 2 }}
          >
            <ListItemIcon sx={{ color: '#666666', minWidth: '40px' }}>
              <LocalShipping />
            </ListItemIcon>
            <ListItemText primary="Track Order" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/support"
            onClick={() => setMobileMenuVisible(false)}
            sx={{ py: 2 }}
          >
            <ListItemIcon sx={{ color: '#666666', minWidth: '40px' }}>
              <Support />
            </ListItemIcon>
            <ListItemText primary="Customer Support" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;