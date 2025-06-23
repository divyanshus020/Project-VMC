import React from 'react';
import { Grid, TextField } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const ProfileInfo = ({ user }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        label="Full Name"
        value={user.fullName || ''}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: <PersonOutlineIcon sx={{ mr: 1, color: '#D4AF37' }} />,
        }}
        variant="outlined"
        size="small"
        sx={{ bgcolor: '#fafafa' }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Email"
        value={user.email || ''}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: <EmailOutlinedIcon sx={{ mr: 1, color: '#D4AF37' }} />,
        }}
        variant="outlined"
        size="small"
        sx={{ bgcolor: '#fafafa' }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Phone Number"
        value={user.phoneNumber || ''}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: <PhoneIphoneOutlinedIcon sx={{ mr: 1, color: '#D4AF37' }} />,
        }}
        variant="outlined"
        size="small"
        sx={{ bgcolor: '#fafafa' }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Address"
        value={user.address || ''}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: <HomeOutlinedIcon sx={{ mr: 1, color: '#D4AF37' }} />,
        }}
        variant="outlined"
        size="small"
        sx={{ bgcolor: '#fafafa' }}
      />
    </Grid>
  </Grid>
);

export default ProfileInfo;
