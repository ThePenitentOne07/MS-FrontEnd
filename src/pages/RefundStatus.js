import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating
} from '@mui/material';
import apiService from '../app/apiService';

const RefundStatus = () => {
    const { refundId } = useParams();
    const [order, setOrder] = useState([]);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const steps = ["Đang xác nhận", "Đang giao", "Giao hàng thành công"];
    const params = useParams();
    const statusToStepIndexMap = {
        "IN_PROGRESSING": 0,
        "IN_DELIVERY": 1,
        "CANNOT_DELIVER": 1,
        "CANNOT_CONFRIRM": 1,
        "COMPLETE_EXCHANGE": 2,
        "IS_FEEDBACK": 2
    };
    const customStepLabels = {
        "CANNOT_DELIVER": ["Đang xác nhận", "Tạm hoãn", "Giao hàng thành công"],
        "CANNOT_CONFRIRM": ["Đang xác nhận", "Chưa chấp nhận", "Giao hàng thành công"]

    };

    useEffect(() => {
        if (refundId) {

            const getOrder = async () => {
                try {
                    const res = await apiService.get(`/api/refund/refund-detail/${refundId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    setOrder(res.data.result);

                } catch (error) {
                    console.error(error);
                }
            };
            getOrder();

        }
    }, [refundId]);
    console.log(order);

    const statusDisplayMap = {
        "IN_PROGRESSING": "Đang xác nhận",
        "IN_DELIVERY": "Đang giao",
        "CANNOT_DELIVER": "Tạm hoãn",
        "COMPLETE_EXCHANGE": "Giao hàng thành công",
        "IS_FEEDBACK": "Giao hàng thành công",
        "CANNOT_CONFIRM_REQUEST": "Yêu cầu không được chấp nhận"
    };

    // if (!order) {
    //     return (
    //         <Container>
    //             <Box sx={{ mt: 5 }}>
    //                 <Typography variant="h4" align="center">Order Not Found</Typography>
    //             </Box>
    //         </Container>
    //     );
    // }

    // const activeStep = statusToStepIndexMap[order.orderStatus];
    // const stepLabelsToUse = customStepLabels[order.orderStatus] || steps;
    const displayedStatus = statusDisplayMap[order.refundStatus];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setRating(0);
        setDescription('');
        setOpen(false);
    };
    const handleRefundSubmit = () => {
        navigate(`/refundList/$}`)
    }

    // const handleSubmitRating = async () => {
    //     const token = localStorage.getItem("token");
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     const userID = user.id;
    //     // const orderID = orderId;

    //     // const ratingData = {
    //     //     rating,
    //     //     description,
    //     //     userID,
    //     //     orderID
    //     // };
    //     // Handle rating submission logic here
    //     try {
    //         await apiService.post("api/feedbacks", ratingData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //     } catch {

    //     }
    //     console.log(ratingData);
    //     console.log("Rating:", rating);
    //     console.log("Comment:", description);
    //     handleClose();
    // };

    return (
        <Container sx={{ mb: 10, mt: 10 }}>
            <Box sx={{ mt: 5 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom align="center">Tình trạng đơn hàng</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6">Tên người gửi: <b>{order.senderName}</b></Typography>
                    <Typography variant="h6">Tình trạng: <b>{displayedStatus}</b></Typography>
                    <Typography variant="h6">Địa chỉ: <b>{order.senderAddress}</b></Typography>
                    {/* {order.orderStatus === "CANNOT_CONFIRM_REQUEST" && (
                        <>

                        </>
                    )}
                    {order.orderStatus === "CANNOT_CONFRIRM" && (
                        <>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Lý do tạm hoãn: <b>{order.failureReasonNote.split('|')[0]}</b>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Ngày: <b>{order.failureReasonNote.split('|')[1].split('T')[0]}</b>
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Giờ: <b>{order.failureReasonNote.split('|')[1].split('T')[1].split('.')[0]}</b>
                            </Typography>
                        </>
                    )} */}

                    {/* <Box sx={{ mt: 3, mb: 3 }}>
                        <Typography variant="h6">Tiến trình đơn hàng:</Typography>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {stepLabelsToUse.map((label, index) => (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box> */}


                </Paper>
            </Box>
        </Container>
    );
};

export default RefundStatus;
