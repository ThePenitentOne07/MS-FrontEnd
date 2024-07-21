import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import UserInfoCard from '../components/UserInfoCard';
import apiService from '../app/apiService';
// import OrderCard from '../components/OrderCard';
import OrderCardHistory from '../components/OrderCardHistory';
import OrderRefundCardList from '../components/OrderRefundCardList';

const RefundPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const userId = savedUser?.id;
        const token = localStorage.getItem("token");

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await apiService.get(`/api/refund/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                setOrders(response.data.result);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchOrders();
        }
    }, []);
    // useEffect(() => {
    //     // Fixed data for testing
    //     const fixedOrders = [
    //         {
    //             productId: '1',
    //             customerImage: 'https://via.placeholder.com/150',
    //             productName: 'Product 1',
    //         },
    //         {
    //             productId: '2',
    //             customerImage: 'https://via.placeholder.com/150',
    //             productName: 'Product 2',
    //         },
    //         {
    //             productId: '3',
    //             customerImage: 'https://via.placeholder.com/150',
    //             productName: 'Product 3',
    //         },
    //     ];
    //     setOrders(fixedOrders);
    // }, []);

    return (
        <Container>

            <Box sx={{ display: 'flex', mt: 5 }}>
                <UserInfoCard name="Nguyen Dinh Bao" />
                <Box sx={{ flex: 2 }}>

                    <Typography variant="h4" gutterBottom>
                        Hoàn trả hàng
                    </Typography>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography >{error}</Typography>
                    ) : (
                        orders.length > 0 ? (
                            orders.map((order) => (
                                <Grid item xs={12} md={8} key={order.productId}>
                                    <OrderRefundCardList item={order} />
                                </Grid>
                            ))
                        ) : (
                            <Typography>Không có yêu cầu hoàn trả nào.</Typography>
                        )
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default RefundPage;
