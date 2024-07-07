// src/pages/EditCustomerAccount.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Alert, Card, List, ListItem, ListItemText } from '@mui/material';
import SkipInputField from '../components/form/SkipInputField';
import apiService from '../app/apiService';
import { Link as RouterLink } from 'react-router-dom';
import UserInfoCard from '../components/UserInfoCard';

const EditCustomerAccount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [formValues, setFormValues] = useState({
        username: `${user.username}`,
        phoneNumber: `${user.phone}`,
        emailAddress: `${user.email}`,

    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    //     useEffect(() => {
    //         const fetchCustomerData = async () => {
    //             setLoading(true);
    //             try {
    //                 const response = await apiService.get('/customer/account');
    //                 setFormValues(response.data);
    //                 setError(null);
    //             } catch (err) {
    //                 setError('Failed to fetch customer data');
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchCustomerData();
    //     }, []);

    const handleInputChange = (name, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {

        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        };

        try {
            const response = await apiService.put('/account/update-information', formValues, { headers });
            if (response.status === 200) { // Assuming 200 OK status for a successful update
                setSuccess('Account updated successfully');
                updateLocalStorage(formValues);
                setError(null);
            } else {
                throw new Error('Failed to update account');
            }
        } catch (err) {

            setError(err.message || 'Failed to update account');
            setSuccess(null);
        }
    };

    const updateLocalStorage = (updatedValues) => {
        const user = JSON.parse(localStorage.getItem("user"));

        // Define key mappings from form values to localStorage keys
        const keyMappings = {
            username: 'username',
            phoneNumber: 'phone', // 'phoneNumber' in form maps to 'phone' in localStorage
            emailAddress: 'email' // 'emailAddress' in form maps to 'email' in localStorage
        };

        // Map updated values to their corresponding localStorage keys
        const updatedUser = { ...user };
        Object.keys(updatedValues).forEach(key => {
            if (keyMappings[key]) {
                updatedUser[keyMappings[key]] = updatedValues[key];
            }
        });

        localStorage.setItem("user", JSON.stringify(updatedUser));
    };






    return (
        <Container >
            <Box sx={{ display: 'flex', mt: 5 }}>
                <UserInfoCard />
                <Box sx={{ flex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Tài khoản của tôi
                    </Typography>
                    {loading && <Typography>Loading...</Typography>}
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    {!loading && (
                        <Box mt={5}>
                            <SkipInputField
                                // defaultValue={user.username}
                                label="Tên"
                                name="username"
                                defaultValue={formValues.username}
                                onChange={handleInputChange}
                                helperText="Name is required"
                            />
                            <SkipInputField
                                // defaultValue={user.phone}
                                label="Số điện thoại"
                                name="phoneNumber"
                                type="tel" // su dung regex de check so dien thoai
                                // defaultValue={formValues.phoneNumber}
                                onChange={handleInputChange}
                                helperText="Phone number is required"
                                sx={{ mt: 2 }}
                            />
                            <SkipInputField
                                value={formValues.emailAddress}
                                label="Email"
                                name="emailAddress"
                                // value={user.email}

                                helperText="Email is required"
                                sx={{ mt: 2 }}
                                disabled

                            />


                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ mt: 3 }}
                            >
                                Lưu
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default EditCustomerAccount;
