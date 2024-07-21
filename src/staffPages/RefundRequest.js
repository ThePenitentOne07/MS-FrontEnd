import { Container, Typography, styled, Stack, Select, MenuItem, TableBody, FormControl, TableContainer, Paper, TableHead, Table, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip, CardMedia } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import apiService from '../app/apiService';
import { toast } from 'react-toastify';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    maxHeight: 600, // Set a height for the table container
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    top: 0,
    zIndex: 1,
}));

const statusMapping = {
    IN_PROGRESSING: 'In progress',
    IN_DELIVERY: 'In Delivery',
    CANNOT_DELIVER: 'Can not deliver',
    CANNOT_CONFRIRM: 'Can not confirm',
    COMPLETE_EXCHANGE: 'Complete',
};

const statusColorMapping = {
    PAID: '#32CD32', // Yellow
    IN_DELIVERY: '#1E90FF', // Blue
    CANNOT_DELIVER: '#FF4500', // Red
    CANNOT_CONFRIRM: '#FF4500', // Red
};

const RefundRequest = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [denyReason, setDenyReason] = useState('');
    const [isCancel1FormOpen, setIsCancel1FormOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState([]);
    const [productDetail, setProductDetail] = useState([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [file, setFile] = useState('');

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const res = await apiService.get("/api/refund/all", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(res.data.result);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleRowClick = async (order) => {

        setSelectedOrder(order);

    };
    const handleCancel1 = () => {
        setIsCancel1FormOpen(true);
    }

    const handleClose = () => {
        setSelectedOrder(null);
        setSelectedOrderStatus(null);
        setIsCancel1FormOpen(false);
        setDenyReason('');
        getOrders();
    };
    const handleSubmitCancel1 = async () => {
        if (!denyReason) {
            alert("Reason must not be empty")
            return;
        }
        try {
            await apiService.patch(`/api/refund/${selectedOrder.id}/cancel?reason=${denyReason}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Order canceled");
            handleClose();
        } catch (error) {
            console.error("Error denying order:", error);
        }
    }
    const handleAcceptInProgress = async () => {
        try {
            await apiService.patch(`/api/refund/${selectedOrder.id}/confirm`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            toast.success("Request accepted");
            handleClose();
        } catch (err) {
            console.error(err)
        }
    }
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredOrders = filterStatus ? orders.filter(order => order.orderStatus === filterStatus) : orders;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Refund's request</Typography>
            <FormProvider>
                <Stack
                    spacing={2}
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    justifyContent="space-between"
                    mb={2}
                >
                    <FormControl>
                        <Select
                            value={filterStatus}
                            onChange={handleFilterChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="PAID">Paid</MenuItem>
                            <MenuItem value="IN_DELIVERY">In delivery</MenuItem>
                            <MenuItem value="CANNOT_DELIVER">Delayed</MenuItem>
                            <MenuItem value="COMPLETE_EXCHANGE">Complete</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </FormProvider>
            <StyledTableContainer component={Paper}>
                <Table stickyHeader aria-label="order table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Request ID</StyledTableCell>
                            <StyledTableCell>Customer Name</StyledTableCell>
                            <StyledTableCell>Phone Number</StyledTableCell>
                            <StyledTableCell>Address</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow
                                key={order.id}
                                hover={order.status !== 'IN_CART'}
                                onClick={() => handleRowClick(order)}
                                style={{ cursor: order.status !== 'IN_CART' ? 'pointer' : 'default' }}
                            >
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.senderName}</TableCell>
                                <TableCell>{order.senderPhone}</TableCell>
                                <TableCell>{order.senderAddress}</TableCell>
                                <TableCell>{order.requestTime}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={statusMapping[order.orderStatus]}
                                        style={{
                                            backgroundColor: statusColorMapping[order.orderStatus],
                                            color: 'white'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
            {selectedOrder && (
                <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth >
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogContent>
                        <Typography>Request ID: {selectedOrder.id}</Typography>
                        <Typography>Customer Name: {selectedOrder.senderName}</Typography>
                        <Typography>Phone Number: {selectedOrder.senderPhone}</Typography>
                        <Typography>Address: {selectedOrder.senderAddress}</Typography>
                        <CardMedia
                            component="img"
                            height="500"

                            image={selectedOrder.customerImage}
                            alt="Order Image"
                        />
                        {/* {orderDetail.orderStatus === 'CANNOT_DELIVER' && (
                            <>
                                <Typography>Failure Reason: {orderDetail.failureReasonNote.split(';')[1].split('|')[0]}</Typography>
                                <Typography>Date : {orderDetail.failureReasonNote.split(';')[1].split('|')[1].split('T')[0]}</Typography>
                                <Typography>Time : {orderDetail.failureReasonNote.split(';')[1].split('|')[1].split('T')[1].split('.')[0]}</Typography>
                            </>
                        )}
                        {orderDetail.orderStatus === 'CANNOT_CONFRIRM' && (
                            <>
                                <Typography>Failure Reason: {orderDetail.failureReasonNote.split('|')[0]}</Typography>
                                <Typography>Date: {orderDetail.failureReasonNote.split('|')[1].split('T')[0]}</Typography>
                                <Typography>Time: {orderDetail.failureReasonNote.split('|')[1].split('T')[1].split('.')[0]}</Typography>
                            </>
                        )} */}


                    </DialogContent>
                    <DialogActions>
                        {selectedOrder.refundStatus === 'IN_PROGRESSING' && (
                            <>
                                <Button onClick={handleAcceptInProgress} color="primary">Accept</Button>
                                <Button onClick={handleCancel1} color="secondary">Cancel</Button>
                            </>
                        )}
                        {/* {selectedOrderStatus.orderStatus === 'IN_DELIVERY' && (
                            <>
                                <input onChange={handleFileChange} type="file" id="file" accept="image/*" />
                                <Button onClick={handleComplete} color="primary">Order Complete</Button>
                                <Button onClick={handleDeny} color="secondary">Delay</Button>
                            </>
                        )}
                        {selectedOrderStatus.orderStatus === 'CANNOT_DELIVER' && (
                            <>
                                <Button onClick={handleAcceptDelay} color="primary">Accept</Button>
                            </>
                        )}
                        {selectedOrderStatus.orderStatus === 'CANNOT_CONFRIRM' && (
                            <>
                                <Button onClick={handleAcceptDelay} color="primary">Accept</Button>
                            </>
                        )} */}
                    </DialogActions>
                </Dialog>
            )}
            <Dialog open={isCancel1FormOpen} onClose={handleClose} maxWidth="lg">
                <DialogTitle>Reason for Denial</DialogTitle>
                <DialogContent>
                    <TextField
                        value={denyReason}
                        onChange={(e) => setDenyReason(e.target.value)}
                        label="Reason"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmitCancel1} color="secondary">Deny</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RefundRequest;
