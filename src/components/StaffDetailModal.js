import React, { useEffect } from 'react';
import { Modal, Box, Typography, Button, Avatar, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import FTextField from './form/FTextField';
import * as yup from 'yup';
import { Schema } from '../components/validation/validationSchema';
import apiService from '../app/apiService'; // Import the apiService

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

const StaffDetailModal = ({ open, handleClose, staff }) => {
  const methods = useForm({
    resolver: yupResolver(Schema),
    mode: 'onChange',
    defaultValues: staff || {} // Set default values to an empty object initially
  });

  const { reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (staff) {
      reset(staff); // Reset form with staff details when staff changes
    }
  }, [staff, reset]);

  const onSubmit = async (data) => {
    console.log('Form Data:', data); // Log form data to verify it is being captured correctly
    try {
      const token = localStorage.getItem("token");
      const response = await apiService.put(`/users/staffs/${staff.userId}`, data, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      console.log('Update successful:', response.data);
      handleClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleModalClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      reset(staff || {}); // Reset form with staff details when modal closes
      handleClose();
    }
  };

  if (!staff) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal open={open} onClose={handleModalClose}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{staff.username}</Typography>
                <Button variant="contained" color="error">Delete</Button>
              </Grid>
              <Grid item xs={12} container justifyContent="center" alignItems="center" direction="column">
                <ProfilePicture src={staff.profilePicture} alt={`${staff.name} profile`} />
                <Typography>Role: {staff.roleName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Employee details</Typography>
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <FTextField label="ID" value={staff.userId} fullWidth margin="normal" disabled {...field} />
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FTextField label="Name" defaultValue={staff.username} fullWidth margin="normal" {...field} />
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <FTextField label="Phone number" type="tel" defaultValue={staff.phoneNumber} fullWidth margin="normal" {...field} />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FTextField label="Email" defaultValue={staff.emailAddress} fullWidth margin="normal" {...field} />
                  )}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select labelId="role-label" label="Role" defaultValue={staff.roleName} fullWidth {...field}>
                        <MenuItem value="SELLER">Seller</MenuItem>
                        <MenuItem value="MANAGER">Manager</MenuItem>
                        <MenuItem value="POST_STAFF">Post Staff</MenuItem>
                        <MenuItem value="PRODUCT_STAFF">Product Staff</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary">Save</Button>
                <Button variant="outlined" onClick={() => { reset(staff); handleClose(); }}>Cancel</Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </form>
    </FormProvider>
  );
};

export default StaffDetailModal;
