import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const OrderCardHistory = ({ order }) => {
    const navigate = useNavigate();
    if (!order) {
        return null;
    }

    const handleCardClick = () => {
        navigate(`/orderstatus/${order.id}`);
    };

    const statusMapping = {
        PAID: 'Paid',
        IN_DELIVERY: 'In Delivery',
        CANNOT_DELIVER: 'Delay',
        COMPLETE_EXCHANGE: 'Đã hoàn thành',
        IS_FEEDBACK: 'Đã đánh giá'
    };

    const statusColorMapping = {
        COMPLETE_EXCHANGE: '#32CD32', // Green
        IS_FEEDBACK: '#1E90FF', // Blue
        CANNOT_DELIVER: '#FF4500', // Red
    };

    return (
        <Card onClick={handleCardClick} sx={{ display: 'flex', mb: 2 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" >
                    Mã đơn hàng: {order.id}
                </Typography>
                <Typography component="div">
                    Tổng tiền: ${order.totalPrice}
                </Typography>
                <Typography component="div">
                    Đặt hàng vào: {order.orderDate}
                </Typography>
                {order.orderStatus && (
                    <Chip
                        label={statusMapping[order.orderStatus]}
                        style={{
                            backgroundColor: statusColorMapping[order.orderStatus],
                            color: 'white',
                            marginTop: '10px',
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
};

OrderCardHistory.propTypes = {
    order: PropTypes.shape({
        receiverName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        orderDate: PropTypes.string.isRequired,
        orderStatus: PropTypes.string.isRequired,
    }).isRequired,
};

export default OrderCardHistory;
