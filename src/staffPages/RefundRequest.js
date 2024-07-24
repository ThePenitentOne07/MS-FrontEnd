import { Container, Typography, styled, Stack, Select, MenuItem, TableBody, FormControl, TableContainer, Paper, TableHead, Table, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip, CardMedia } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import apiService from '../app/apiService';
import { toast, ToastContainer } from 'react-toastify';

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
    TAKING_PRODUCT_PROGRESSING: 'On way to get product',
    CANNOT_DELIVER: 'Can not deliver',
    CANNOT_CONFIRM_REQUEST: 'Can not confirm',
    CONFIRM_TAKING: "Product retrieved",
    SHOP_PROCESS: "Processing",
    CONFIRM_REFUND_MONEY: "Refund accepted",
    DELIVERY_TO_TURN_BACK: "On way to return product",
    COMPLETE_TURN_BACK: "Product returned",
    CANNOT_ACCEPT_REFUND_REQUEST: "Rejected"
};

const statusColorMapping = {
    CONFIRM_TAKING: '#32CD32', // Yellow
    TAKING_PRODUCT_PROGRESSING: '#1E90FF', // Blue
    CANNOT_DELIVER: '#FF4500', // Red
    CANNOT_CONFIRM_REQUEST: '#FF4500', // Red
    IN_PROGRESSING: '#FFB233',
    SHOP_PROCESS: '#FFB233',
    CONFIRM_REFUND_MONEY: '#32CD32',
    DELIVERY_TO_TURN_BACK: '#1E90FF',
    COMPLETE_TURN_BACK: '#32CD32',
    CANNOT_ACCEPT_REFUND_REQUEST: '#FF4500'
};

const RefundRequest = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [denyReason, setDenyReason] = useState('');
    const [isCancelFormOpen, setIsCancelFormOpen] = useState(false);
    const [isReasonFormOpen, setIsReasonFormOpen] = useState(false);
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
            setOrders(res.data.result.filter(order => order.refundStatus !== 'CANCEL_REFUND_REQUEST'));
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleRowClick = async (order) => {

        setSelectedOrder(order);

    };
    const handleCancel1 = () => {
        setIsCancelFormOpen(true);
    }
    const handleStaffNote = () => {
        setIsReasonFormOpen(true);
    }

    const handleClose = () => {
        setSelectedOrder(null);
        setSelectedOrderStatus(null);
        setIsReasonFormOpen(false)
        setIsCancelFormOpen(false);
        setDenyReason('');
        getOrders();
        setFile('');
    };
    const handleSubmitCancel1 = async () => {
        if (!denyReason) {
            alert("Reason must not be empty")
            return;
        }
        try {
            await apiService.patch(`/api/refund/${selectedOrder.id}/deny1?cancelReason1=${denyReason}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Refund canceled");
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
    const handelProductRetrieve = async () => {
        const formData = new FormData();
        formData.append('refundEvidence', file)
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/completeTaking`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            )
            handleClose();
        } catch {

        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleAcceptConFirmTaking = async () => {
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/shopProcess`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,

                }
            })
            handleClose();
            toast.success("Product recieved")
        } catch {

        }
    }
    const handleAcceptRefund = async () => {
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/refundMoney?staffNote=${denyReason}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,

                }
            })
            handleClose();

        } catch {

        }
    }
    const handleSubmitCancel2 = async () => {
        const formData = new FormData();
        formData.append('denyImage', file)
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/deny2?staffRejectReason=${denyReason}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,

                }
            })
            handleClose();

        } catch {

        }
    }
    const handleReturn = async () => {
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/turnBack`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,

                }
            })
            handleClose();
        }
        catch { }
    }
    const handleReturnComplete = async () => {
        const formData = new FormData();
        formData.append('imgShip', file)
        try {
            await apiService.patch(`api/refund/${selectedOrder.id}/completeDelivery`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,

                }

            })
            handleClose();
        } catch {

        }
    }

    const filteredOrders = filterStatus ? orders.filter(order => order.refundStatus === filterStatus) : orders;
    // console.log(filterStatus)

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
                            <MenuItem value="IN_PROGRESSING">In progress</MenuItem>
                            <MenuItem value="TAKING_PRODUCT_PROGRESSING">On way to get product</MenuItem>
                            <MenuItem value="CANNOT_DELIVER">Can not deliver</MenuItem>
                            <MenuItem value="CONFIRM_TAKING">Product retrieved</MenuItem>
                            <MenuItem value="SHOP_PROCESS">Processing</MenuItem>
                            <MenuItem value="CONFIRM_REFUND_MONEY">Refund accepted</MenuItem>
                            <MenuItem value="DELIVERY_TO_TURN_BACK">On way to return product</MenuItem>
                            <MenuItem value="COMPLETE_TURN_BACK">Product returned</MenuItem>
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
                                        label={statusMapping[order.refundStatus]}
                                        style={{
                                            backgroundColor: statusColorMapping[order.refundStatus],
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
                        <Typography>Reason: {selectedOrder.customerRefundReason}</Typography>
                        <Typography>Note: {selectedOrder.customerNote}</Typography>
                        {selectedOrder.refundStatus === 'CANNOT_CONFIRM_REQUEST' && (
                            <>
                                <Typography sx={{ color: 'red' }}>
                                    Lý do từ chối: <b>{selectedOrder.staffRejectReason}</b>
                                </Typography>

                            </>
                        )}
                        {selectedOrder.refundStatus !== 'CANNOT_ACCEPT_REFUND_REQUEST' &&
                            selectedOrder.refundStatus !== 'CONFIRM_TAKING' && (
                                <CardMedia
                                    component="img"
                                    height="500"
                                    image={selectedOrder.customerImage}
                                    alt="Order Image"
                                />
                            )}
                        {selectedOrder.refundStatus === 'CONFIRM_TAKING' && (
                            <>

                                <Typography>Product image:</Typography>
                                <CardMedia
                                    component="img"
                                    height="500"

                                    image={selectedOrder.staffReceivedImage}
                                    alt="Order Image"
                                />
                            </>
                        )}
                        {selectedOrder.refundStatus === 'CANNOT_ACCEPT_REFUND_REQUEST' && (
                            <>
                                <Typography sx={{ color: 'red' }}>
                                    Lý do từ chối: <b>{selectedOrder.staffRejectReason}</b>
                                </Typography>
                                <Typography>Rejected image:</Typography>
                                <CardMedia
                                    component="img"
                                    height="500"

                                    image={selectedOrder.staffRejectImage}
                                    alt="Order Image"
                                />
                            </>
                        )}
                        {/* {orderDetail.orderStatus === 'CANNOT_DELIVER' && (
                            <>
                                <Typography>Failure Reason: {orderDetail.failureReasonNote.split(';')[1].split('|')[0]}</Typography>
                                <Typography>Date : {orderDetail.failureReasonNote.split(';')[1].split('|')[1].split('T')[0]}</Typography>
                                <Typography>Time : {orderDetail.failureReasonNote.split(';')[1].split('|')[1].split('T')[1].split('.')[0]}</Typography>
                            </>
                        )}
                        {orderDetail.orderStatus === 'CANNOT_CONFIRM_REQUEST' && (
                            <>
                                <Typography>Failure Reason: {selectedOrder.}</Typography>
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
                        {selectedOrder.refundStatus === 'TAKING_PRODUCT_PROGRESSING' && (
                            <>
                                <Button variant="contained" component="label">
                                    Tải lên hình ảnh (*)
                                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </Button>
                                <Button onClick={handelProductRetrieve} color="primary">Product retrieved</Button>
                                {/* <Button onClick={handleCancel1} color="secondary">Cancel</Button> */}
                            </>
                        )}
                        {selectedOrder.refundStatus === 'CANNOT_CONFIRM_REQUEST' && (
                            <>


                                {/* <Button onClick={handleCancel1} color="secondary">Cancel</Button> */}

                            </>
                        )}
                        {selectedOrder.refundStatus === 'CONFIRM_TAKING' && (
                            <>

                                <Button onClick={handleAcceptConFirmTaking} color="primary">Accept</Button>
                                {/* <Button onClick={handleCancel1} color="secondary">Cancel</Button> */}

                            </>
                        )}
                        {selectedOrder.refundStatus === 'SHOP_PROCESS' && (
                            <>
                                <Button onClick={handleStaffNote} color="primary">Accept refund</Button>
                                <Button onClick={handleCancel1} color="secondary">Deny</Button>
                            </>
                        )}
                        {selectedOrder.refundStatus === 'CANNOT_ACCEPT_REFUND_REQUEST' && (
                            <>

                                <Button onClick={handleReturn} color="primary">Return</Button>
                                {/* <Button onClick={handleCancel1} color="secondary">Cancel</Button> */}

                            </>
                        )}
                        {selectedOrder.refundStatus === "DELIVERY_TO_TURN_BACK" && (
                            <>

                                <Button variant="contained" component="label">
                                    Tải lên hình ảnh (*)
                                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </Button>
                                <Button onClick={handleReturnComplete} color="primary">Return</Button>
                                {/* <Button onClick={handleCancel1} color="secondary">Cancel</Button> */}

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
            {selectedOrder && (
                <>
                    <Dialog open={isCancelFormOpen} onClose={handleClose} maxWidth="lg">
                        <DialogTitle>Reason for Denial</DialogTitle>
                        <DialogContent>
                            <TextField
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                                label="Reason"
                                fullWidth
                            />
                        </DialogContent>
                        {selectedOrder.refundStatus === 'IN_PROGRESSING' && (
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">Cancel</Button>
                                <Button onClick={handleSubmitCancel1} color="secondary">Deny</Button>
                            </DialogActions>
                        )}
                        {selectedOrder.refundStatus === 'SHOP_PROCESS' && (
                            <DialogActions>
                                <Button variant="contained" component="label">
                                    Tải lên hình ảnh (*)
                                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </Button>
                                <Button onClick={handleClose} color="primary">Cancel</Button>
                                <Button onClick={handleSubmitCancel2} color="secondary">Deny</Button>
                            </DialogActions>
                        )}


                    </Dialog>
                    <Dialog open={isReasonFormOpen} onClose={handleClose} maxWidth="lg">
                        <DialogTitle>Staff note</DialogTitle>
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
                            <Button onClick={handleAcceptRefund} color="secondary">Submit</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}


        </Container>

    );
};

export default RefundRequest;
