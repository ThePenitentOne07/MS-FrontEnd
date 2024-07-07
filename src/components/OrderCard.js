
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
    
    const navigate= useNavigate();
    const handleCardClick = () => {
        navigate(`/orderstatus/${order.id}`);
    };

    return (
        <Card onClick={handleCardClick} sx={{ mb: 2, cursor: 'pointer', border: '2px solid #cb8bcd' }}>
            <CardContent>
                <Typography variant="h6">{order.customerName}</Typography>
                <Typography>Tổng cộng: ${order.total}</Typography>
                <Typography>Tình trạng: {order.status}</Typography>
                <Typography>Địa chỉ: {order.address}</Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
