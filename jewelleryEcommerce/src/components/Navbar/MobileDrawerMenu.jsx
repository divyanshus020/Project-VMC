import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box
} from '@mui/material';
import {
  Home,
  Diamond,
  Info,
  Phone,
  PersonOutline,
  ListAlt,
  LocalShipping,
  Support
} from '@mui/icons-material';

const mobileMenuLinks = [
  { icon: <Home />, label: 'Home', key: 'home', href: '/' },
  { icon: <Diamond />, label: 'Product', key: 'product', href: '/products' },
  { icon: <Info />, label: 'About us', key: 'about', href: '/about' },
  { icon: <Phone />, label: 'Contact us', key: 'contact', href: '/contact' }
];

const MobileDrawerMenu = ({ isOpen, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
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
            VMC
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
            onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
          sx={{ py: 2 }}
        >
          <ListItemIcon sx={{ color: '#666666', minWidth: '40px' }}>
            <Support />
          </ListItemIcon>
          <ListItemText primary="Customer Support" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MobileDrawerMenu;