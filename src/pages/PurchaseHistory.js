import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import UserInfoCard from '../components/UserInfoCard';
import apiService from '../app/apiService';
// import OrderCard from '../components/OrderCard';
import OrderCardHistory from '../components/OrderCardHistory';

const PurchaseHistory = () => {
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
                const response = await apiService.get(`/api/orders/user/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                setOrders(response.data.result.filter(order => (order.orderStatus === 'COMPLETE_EXCHANGE' || order.orderStatus === 'IS_FEEDBACK')));
                setError(null);
            } catch (err) {
                setError('Failed to fetch orders');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchOrders();
        }
    }, []);

    return (
        <Container>
            <Box sx={{ display: 'flex', mt: 5 }}>
                <UserInfoCard name="Nguyen Dinh Bao" />
                <Box sx={{ flex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Lịch sử đơn hàng
                    </Typography>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        orders.length > 0 ? (
                            orders.map((order) => (
                                <OrderCardHistory key={order.id} order={order} />
                            ))
                        ) : (
                            <Typography>Không có đơn hàng đã hoàn thành.</Typography>
                        )
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default PurchaseHistory;
