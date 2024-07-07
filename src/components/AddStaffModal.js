import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
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
};

const AddButton = styled(Button)`
  background-color: black;
  color: white;
  &:hover {
    background-color: darkgray;
  }
`;

const AddStaffModal = ({ open, handleClose, handleAddStaff }) => {
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    phoneNumber: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleSubmit = () => {
    handleAddStaff(newStaff);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add Staff
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Name" name="username" value={newStaff.firstName} onChange={handleChange} fullWidth />
          </Grid>
          
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={newStaff.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Password" name="password" value={newStaff.password} onChange={handleChange} fullWidth />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                name="role"
                value={newStaff.role}
                onChange={handleChange}
              >
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="post_staff">Post Staff</MenuItem>
                <MenuItem value="product_staff">Product Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} container justifyContent="space-between">
            <AddButton onClick={handleSubmit}>Add</AddButton>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddStaffModal;
