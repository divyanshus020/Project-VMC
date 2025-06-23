import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const EditProfileDialog = ({ open, onClose, onSave, editedUser, setEditedUser }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Edit Email & Address</DialogTitle>
    <DialogContent dividers>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={editedUser.email}
        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
      />
      <TextField
        label="Address"
        fullWidth
        margin="normal"
        value={editedUser.address}
        onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={onSave} sx={{ bgcolor: '#D4AF37', '&:hover': { bgcolor: '#bfa233' } }}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

export default EditProfileDialog;
