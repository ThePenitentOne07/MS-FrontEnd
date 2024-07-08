import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, List, ListItem, ListItemText, Stepper, Step, StepLabel, Paper, Divider } from '@mui/material';
import apiService from '../app/apiService';

const OrderStatus = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState();

    const steps = ["Đang xác nhận", "Đang giao", "Giao hàng thành công"];
    const params = useParams();
    const statusToStepIndexMap = {
        "PAID": 0,
        "IN_DELIVERY": 1,
        "CANNOT_DELIVER": 1,
        "COMPLETE_EXCHANGE": 2
    };
    const customStepLabels = {
        "CANNOT_DELIVER": ["Đang xác nhận", "Tạm hoãn", "Giao hàng thành công"]
    };
    useEffect(() => {
        if (orderId) {
            const token = localStorage.getItem("token");
            const getOrder = async () => {
                try {
                    const res = await apiService.get(`/api/orders/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    }

                    ); setOrder(res.data.result)
                } catch {

                }
            }
            getOrder();
        }

    }, []);


    // const orders = [
    //     {
    //         "id": 1,
    //         "customerName": "John Doe",
    //         "total": 100.50,
    //         "status": "CANNOT_DELIVER",
    //         "address": "123 Main St, Anytown, USA",
    //         "products": [
    //             { "name": "Sản phẩm 1", "quantity": 2, "price": 25.00 },
    //             { "name": "Sản phẩm 2", "quantity": 1, "price": 50.50 },
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "customerName": "Jane Smith",
    //         "total": 75.00,
    //         "status": "PAID",
    //         "address": "456 Elm St, Anytown, USA",
    //         "products": [
    //             { "name": "Sản phẩm 3", "quantity": 3, "price": 25.00 },
    //         ]
    //     },
    //     {
    //         "id": 3,
    //         "customerName": "Jane Smith",
    //         "total": 75.00,
    //         "status": "COMPLETE_EXCHANGE",
    //         "address": "456 Elm St, Anytown, USA",
    //         "products": [
    //             { "name": "Sản phẩm 4", "quantity": 1, "price": 75.00 },
    //         ]
    //     }
    // ];

    const statusDisplayMap = {
        "PAID": "Đang xác nhận",
        "IN_DELIVERY": "Đang giao",
        "CANNOT_DELIVER": "Tạm hoãn",
        "COMPLETE_EXCHANGE": "Giao hàng thành công"
    };



    if (!order) {
        return (
            <Container>
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h4" align="center">Order Not Found</Typography>
                </Box>
            </Container>
        );
    }

    const activeStep = statusToStepIndexMap[order.orderStatus];
    const stepLabelsToUse = customStepLabels[order.orderStatus] || steps;
    const displayedStatus = statusDisplayMap[order.orderStatus];

    return (
        <Container sx={{ mb: 10, mt: 10 }}>
            <Box sx={{ mt: 5 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom align="center">Tình trạng đơn hàng</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6">Tên người nhận: <b>{order.
                        receiverName
                    }</b></Typography>
                    <Typography variant="h6">Tình trạng: <b>{displayedStatus}</b></Typography>
                    <Typography variant="h6">Địa chỉ: <b>{order.shippingAddress}</b></Typography>
                    {order.orderStatus === "CANNOT_DELIVER" && (
                        <Typography variant="h6" sx={{ color: 'red' }}>
                            Lý do tạm hoãn: <b>{order.failureReasonNote}</b>
                        </Typography>
                    )}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Sản phẩm:</Typography>
                        <List>
                            {order.cart.map((product) => (
                                <ListItem key={product.id}>
                                    <ListItemText
                                        primary={`${product.productName} (x${product.quantity})`}
                                        secondary={`Giá: $${product.price.toFixed(2)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Typography variant="h6">Tiến trình đơn hàng:</Typography>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {stepLabelsToUse.map((label, index) => (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Paper>
            </Box>
        </Container >
    );
};

export default OrderStatus;
