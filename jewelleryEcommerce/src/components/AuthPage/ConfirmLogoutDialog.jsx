import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close, ExitToApp } from '@mui/icons-material';

const LogoutConfirmation = ({ open, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'visible'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExitToApp sx={{ color: '#D4AF37' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Confirm Logout
          </Typography>
        </Box>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{
            color: '#666666',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body1" sx={{ color: '#333333', lineHeight: 1.6 }}>
          Are you sure you want to logout from your account?
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666', mt: 1 }}>
          You will need to login again to access your profile, orders, and wishlist.
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: '#e0e0e0',
            color: '#666666',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            '&:hover': {
              borderColor: '#D4AF37',
              backgroundColor: 'rgba(212, 175, 55, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#D4AF37',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            '&:hover': {
              backgroundColor: '#B8941F'
            }
          }}
        >
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmation;