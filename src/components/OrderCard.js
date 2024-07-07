import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/orderstatus/${order.id}`);
    };

    const statusMapping = {
        PAID: { label: 'Đang xác nhận', color: '#4caf50' }, // Green
        IN_DELIVERY: { label: 'Đang giao', color: '#2196f3' }, // Blue
        CANNOT_DELIVER: { label: 'Tạm hoãn', color: '#f44336' } // Red
    };

    const status = statusMapping[order.orderStatus];

    return (
        <Card onClick={handleCardClick} sx={{ mb: 2, cursor: 'pointer', border: '2px solid #cb8bcd' }}>
            <CardContent>
                <Typography>Mã đơn hàng: {order.id}</Typography>
                <Typography>Tổng cộng: {order.totalPrice}</Typography>
                <Typography component="div" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Tình trạng:
                    <Chip
                        label={status.label}
                        style={{
                            backgroundColor: status.color,
                            color: 'white'
                        }}
                    />
                </Typography>
                <Typography>Ngày đặt: {order.orderDate}</Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
