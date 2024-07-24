import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCardRefund from '../components/ProductCardRefund';
import apiService from '../app/apiService';
import { toast } from 'react-toastify';

export default function ListRefundPage() {
    const [productList, setProductList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const { orderId } = useParams();
    const [formData, setFormData] = useState({
        senderName: "",
        senderAddress: "",
        senderPhone: "",
        productName: "",
        customerRefundReason: "",
        customerNote: "",
        refundImageFile: null
    });

    useEffect(() => {
        if (orderId) {
            const getOrder = async () => {
                try {
                    const res = await apiService.get(`/api/orders/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    setProductList(res.data.result.cart);
                } catch (error) {
                    console.error(error);
                }
            };
            getOrder();
        }
    }, [orderId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData((prevData) => ({ ...prevData, refundImageFile: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChooseProduct = (product) => {
        setSelectedProduct(product);
        setFormData((prevData) => ({ ...prevData, productName: product.productName }));
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedProduct(null);
        setImagePreview(null);
        setFormData({
            senderName: "",
            senderAddress: "",
            senderPhone: "",
            productName: "",
            customerRefundReason: "",
            customerNote: "",
            refundImageFile: null
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            await apiService.post(`/api/refund/create?userID=${user.id}`, data, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            });
            handleDialogClose();
            navigate("/refund")
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }

    };
    console.log(formData);

    return (
        <Container component={Paper} sx={{ marginTop: 10 }}>
            <Typography variant="h4" gutterBottom align="center">Chọn sản phẩm bạn muốn trả</Typography>
            <Grid container spacing={2}>
                {productList.map((product) => (
                    <Grid item xs={12} md={8} key={product.productId}>
                        <ProductCardRefund
                            item={product}
                            onChoose={handleChooseProduct}
                        />
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                disableEscapeKeyDown
                BackdropProps={{
                    onClick: (event) => event.stopPropagation(),
                }}
            >
                <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mb: 2 }}>Mọi thông tin khách cung cấp  phải chính xác, nếu không cửa hàng sẽ không chịu trách nhiệm</Alert>
                    <TextField
                        label="Tên sản phẩm"
                        name='productName'
                        fullWidth
                        margin="normal"
                        value={formData.productName}
                        disabled
                    />
                    <TextField
                        label="Tên người gửi"
                        fullWidth
                        onChange={handleChange}
                        name='senderName'
                        margin="normal"
                        value={formData.senderName}
                    />
                    <TextField
                        label="Địa chỉ gửi"
                        name='senderAddress'
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        value={formData.senderAddress}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        onChange={handleChange}
                        margin="normal"
                        name='senderPhone'
                        value={formData.senderPhone}
                    />
                    <TextField
                        label="Lý do"
                        fullWidth
                        onChange={handleChange}
                        name='customerRefundReason'
                        margin="normal"
                        value={formData.customerRefundReason}
                    />
                    <TextField
                        label="Chú thích"
                        fullWidth
                        onChange={handleChange}
                        name='customerNote'
                        margin="normal"
                        value={formData.customerNote}
                    />
                    <Box mt={2}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            {imagePreview && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography>Hình ảnh sản phẩm:</Typography>
                                    <img
                                        src={imagePreview}
                                        alt="Product"
                                        style={{ width: "100%", maxHeight: "300px" }}
                                    />
                                </Box>
                            )}
                            <Button variant="contained" component="label">
                                Tải lên hình ảnh (*)
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">Gửi</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
