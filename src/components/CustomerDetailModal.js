import React from 'react';
import { Modal, Box, Typography, TextField, Button, Avatar, Grid } from '@mui/material';
import styled from '@emotion/styled';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto', // Ensure scrolling if content overflows
  maxHeight: '80vh' // Limit the maximum height of the modal
};

const ProfilePicture = styled(Avatar)`
  width: 150px;
  height: 150px;
  background-color: grey;
  margin-bottom: 16px;
`;

const CustomerDetailModal = ({ open, handleClose, customer }) => {
  if (!customer) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{customer.name}</Typography>
            <Button variant="contained" color="error">Ban</Button>
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" direction="column">
            <ProfilePicture src={customer.profilePicture} alt={`${customer.name} profile`} />
            <Typography>ID: {customer.id}</Typography>
            <Typography>Registed on: {customer.addedOn}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Customer details</Typography>
            <TextField label="Name" value={customer.name} fullWidth margin="normal" />
            
            <TextField label="Phone number" value={customer.phoneNumber} fullWidth margin="normal" />
            <TextField label="Email" value={customer.email} fullWidth margin="normal" />
            
           
          </Grid>
          <Grid item xs={12} container justifyContent="space-between">
          
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CustomerDetailModal;
