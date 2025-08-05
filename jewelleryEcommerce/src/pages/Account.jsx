import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Avatar,
  Grid,
  Button,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { getProfile, updateProfile } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../components/AccountProfile/ProfileInfo';
import EditProfileDialog from '../components/AccountProfile/EditProfileDialog';

const Account = () => {
  const [user, setUser] = useState({ fullName: '', email: '', phoneNumber: '', address: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editedUser, setEditedUser] = useState({ email: '', address: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load profile.');
        }
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleOpenEdit = () => {
    setEditedUser({ email: user.email || '', address: user.address || '' });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setError('');
  };

  const handleSaveEdit = async () => {
    try {
      console.log(editedUser)
      const res = await updateProfile(editedUser, token);
      console.log(res)
      setUser(res.data.user);
       setMessage('✅ Profile updated successfully!');
      setOpenEdit(false);
       setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 6, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ maxWidth: 600, width: '100%', p: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#D4AF37', width: 64, height: 64, mb: 1 }}>
            <PersonOutlineIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">My Profile</Typography>
        </Box>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <ProfileInfo user={user} />

        <Button
          variant="contained"
          fullWidth
          onClick={handleOpenEdit}
          sx={{ bgcolor: '#D4AF37', color: '#fff', fontWeight: 'bold', mt: 3, '&:hover': { bgcolor: '#bfa233' }, py: 1.3, borderRadius: 2 }}
        >
          Edit Email & Address
        </Button>

        <EditProfileDialog
          open={openEdit}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          editedUser={editedUser}
          setEditedUser={setEditedUser}
        />
      </Paper>
    </Box>
  );
};

export default Account;
