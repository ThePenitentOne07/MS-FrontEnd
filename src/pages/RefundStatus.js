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
    Rating,
    Card,
    CardMedia
} from '@mui/material';
import apiService from '../app/apiService';

const RefundStatus = () => {
    const { refundId } = useParams();
    const [order, setOrder] = useState([]);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const steps = ["Đang xác nhận", "Nhân viên đi lấy hàng", "Shop đang xử lý", "Hoàn trả thành công"];

    const statusToStepIndexMap = {
        "IN_PROGRESSING": 0,
        "TAKING_PRODUCT_PROGRESSING": 1,
        "CANNOT_CONFRIRM": 1,
        "CONFIRM_TAKING": 1,
        "SHOP_PROCESS": 2,
        "IS_FEEDBACK": 2,
        "CONFIRM_REFUND_MONEY": 3,
        "CANNOT_ACCEPT_REFUND_REQUEST": 3,
        "DELIVERY_TO_TURN_BACK": 3,
        "COMPLETE_TURN_BACK": 3,
        "CONFIRM_RFUND_MONEY": 3,
        "CANNOT_CONFIRM_REQUEST": 0
    };
    const customStepLabels = {

        "CONFIRM_TAKING": ["Đang xác nhận", "Nhân viên đã lấy hàng", "Shop đang xử lý", "Hoàn trả thành công"],
        "SHOP_PROCESS": ["Đang xác nhận", "Nhân viên đã lấy hàng", "Shop đang xử lý", "Hoàn trả thành công"],
        "CANNOT_ACCEPT_REFUND_REQUEST": ["Đang xác nhận", "Nhân viên đã lấy hàng", "Shop đang xử lý", "Yêu câu bị từ chối"],
        "DELIVERY_TO_TURN_BACK": ["Đang xác nhận", "Nhân viên đã lấy hàng", "Shop đang xử lý", "Đang trả hàng"],
        "COMPLETE_TURN_BACK": ["Đang xác nhận", "Nhân viên đã lấy hàng", "Shop đang xử lý", "Đã trả hàng thành công"],
        "CANNOT_CONFIRM_REQUEST": ["Yêu cầu bị từ chối", "Nhân viên đi lấy hàng", "Shop đang xử lý", "Hoàn trả thành công"]

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
        "CONFIRM_TAKING": "Nhân viên đã lấy hàng",
        "COMPLETE_EXCHANGE": "Giao hàng thành công",
        "CANNOT_CONFIRM_REQUEST": "Yêu cầu không được chấp nhận",
        "SHOP_PROCESS": "Shop đang xử lý    ",
        "CANNOT_ACCEPT_REFUND_REQUEST": "Yêu cầu bị từ chối",
        "DELIVERY_TO_TURN_BACK": "Đang trả hàng",
        "COMPLETE_TURN_BACK": "Đã trả hàng thành công"
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

    const activeStep = statusToStepIndexMap[order.refundStatus];
    const stepLabelsToUse = customStepLabels[order.refundStatus] || steps;
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
                    <Typography variant="h6">Lý do yêu cầu: <b>{order.customerRefundReason}</b></Typography>
                    {order.refundStatus === "CANNOT_CONFIRM_REQUEST" && (
                        <>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Lý do từ chối: <b>{order.staffRejectReason}</b>
                            </Typography>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.customerImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "IN_PROGRESSING" && (
                        <>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.customerImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "TAKING_PRODUCT_PROGRESSING" && (
                        <>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.customerImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "CONFIRM_TAKING" && (
                        <>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.customerImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "SHOP_PROCESS" && (
                        <>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.customerImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "CANNOT_ACCEPT_REFUND_REQUEST" && (
                        <>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Lý do từ chối: <b>{order.staffRejectReason}</b>
                            </Typography>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.staffRejectImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "DELIVERY_TO_TURN_BACK" && (
                        <>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Lý do từ chối: <b>{order.staffRejectReason}</b>
                            </Typography>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.staffRejectImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {order.refundStatus === "COMPLETE_TURN_BACK" && (
                        <>
                            <Typography variant="h6" sx={{ color: 'red' }}>
                                Lý do từ chối: <b>{order.staffRejectReason}</b>
                            </Typography>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt="Reject Reason Image"
                                    height="500"

                                    image={`${order.staffRejectImage}`} // replace with your image path or URL
                                    title="Reject Reason"
                                    sx={{
                                        width: '100%', // Ensures the image takes the full width of the card
                                        height: 'auto', // Maintains aspect ratio by automatically adjusting the height
                                        maxHeight: 500, // Sets a maximum height to scale the image
                                        objectFit: 'contain' // Ensures the entire image is visible within the specified dimensions
                                    }}
                                />
                            </Card>
                        </>
                    )}
                    {/* {order.orderStatus === "CANNOT_CONFRIRM" && (
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
        </Container>
    );
};

export default RefundStatus;
