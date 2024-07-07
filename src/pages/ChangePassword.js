import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Alert } from '@mui/material';
import apiService from '../app/apiService';
import UserInfoCard from '../components/UserInfoCard';
import FTextField from '../components/form/FTextField';
import { useForm, FormProvider } from 'react-hook-form';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const methods = useForm();

    const handleSubmit = async (data) => {
        console.log('Form Data:', data); // Debug log
        setLoading(true);
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        };
        try {
            await apiService.put('/account/password-update', data, { headers });
            setSuccess('Account updated successfully');
            setError(null);
        } catch (err) {
            console.error('Update Error:', err); // Debug log
            setError(err.message || 'Failed to update account');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', mt: 5 }}>
                <UserInfoCard name="Nguyen Dinh Bao" />
                <Box sx={{ flex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Đổi mật khẩu
                    </Typography>
                    {loading && <Typography>Loading...</Typography>}
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    {!loading && (
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                                <FTextField
                                    name="oldPassword"
                                    label="Mật khẩu hiện tại"
                                    variant="outlined"
                                    validationRules={{ required: 'Password must not be empty' }}
                                    sx={{ mb: 2 }}  // Add margin bottom
                                />
                                <FTextField
                                    name="newPassword"
                                    label="Mật khẩu mới"
                                    type="password"
                                    variant="outlined"
                                    validationRules={{
                                        required: 'Password must not be empty',
                                        validate: (value, allValues) => value !== allValues.oldPassword || 'Mật khẩu mới không được trùng với mật khẩu củ'
                                    }}
                                    sx={{ mb: 2 }}  // Add margin bottom
                                />
                                {/* <FTextField
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    type="password"
                                    variant="outlined"
                                    validationRules={{
                                        required: 'Password must not be empty',
                                        validate: (value) =>
                                            value === methods.watch('newPassword') || 'Passwords do not match',
                                    }}
                                    sx={{ mb: 2 }}  // Add margin bottom
                                /> */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ mt: 3 }}
                                >
                                    Lưu
                                </Button>
                            </form>
                        </FormProvider>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default ChangePassword;
