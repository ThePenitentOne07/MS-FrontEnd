import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import apiService from '../app/apiService';
import OrderCard from '../components/OrderCard';
import UserInfoCard from '../components/UserInfoCard';

const OrderList = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const userId = savedUser.id;
        const token = localStorage.getItem("token");
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await apiService.get(`/api/orders/user/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                setOrders(response.data.result.filter(order => order.orderStatus !== 'IN_CART' && order.orderStatus !== 'COMPLETE_EXCHANGE'));
                setError(null);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [selectedTab]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);

    };

    const statusMapping = {
        'Đang xác nhận': 'PAID',
        'Đang giao': 'IN_DELIVERY',
        'Tạm hoãn': 'CANNOT_DELIVER',
        "Chưa chấp nhận": 'CANNOT_CONFIRM'

    };

    const tabLabels = ['Tất cả', 'Đang xác nhận', 'Tạm hoãn', 'Đang giao'];

    const filterOrders = (statusLabel) => {
        if (statusLabel === 'Tất cả') {
            return orders;
        } else {
            return orders.filter(order => order.orderStatus === statusMapping[statusLabel]);
        }
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', mt: 5 }}>
                <UserInfoCard name="Nguyen Dinh Bao" />
                <Box sx={{ flex: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Đơn hàng
                    </Typography>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="order status tabs"
                        sx={{ mb: 2 }}
                    >
                        {tabLabels.map((label, index) => (
                            <Tab key={index} label={label} />
                        ))}
                    </Tabs>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        filterOrders(tabLabels[selectedTab]).map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default OrderList;
