import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl } from '@mui/material';
import { styled } from '@mui/material';
import Chip from '@mui/material/Chip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { toast } from 'react-toastify';
import apiService from '../app/apiService';
import { FormProvider } from 'react-hook-form';

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
  PAID: 'Paid',
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

const OrderListStaff = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [denyReason, setDenyReason] = useState('');
  const [isDenyFormOpen, setIsDenyFormOpen] = useState(false);
  const [isDelayFormOpen, setIsDelayFormOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [orderDetail, setOrderDetail] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [file, setFile] = useState('');

  const handleRowClick = async (order) => {
    if (order.orderStatus !== 'IN_CART') {
      setSelectedOrder(order.id);
      setSelectedOrderStatus(order);
      try {
        const res = await apiService.get(`/api/orders/${order.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        setOrderDetail(res.data.result);
        setProductDetail(res.data.result.cart)
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    }
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setSelectedOrderStatus(null);
    setIsDenyFormOpen(false);
    setIsDelayFormOpen(false);
    setDenyReason('');
    getOrders();
    setFile('');
  };

  const handleAcceptDelay = async () => {
    try {
      await apiService.put(`api/orders/change-status/${selectedOrder}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleClose();
      alert("Order complete")
    } catch (error) {
      console.error("Error accepting delay:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await apiService.put(`api/orders/confirm-shipping/${selectedOrder}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleClose();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleDeny = () => {
    setIsDenyFormOpen(true);
  };

  const handleDenySubmit = async () => {
    if (!denyReason) {
      alert("Reason must not be empty")
      return;
    }
    try {
      await apiService.put(`api/orders/cancel/${selectedOrder}?reason=${denyReason}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("Order delayed");
      handleClose();
    } catch (error) {
      console.error("Error denying order:", error);
    }
  };
  console.log(denyReason);
  const handleCancelDeny = () => {
    handleClose();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleDelaySubmit = async () => {
    if (!denyReason) {
      alert("Reason must not be empty")
      return;
    }
    try {
      await apiService.put(`api/orders/delay-order/${selectedOrder}?reason=${denyReason}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("Order delayed");
      handleClose();
    } catch (error) {
      console.error("Error denying order:", error);
    }
  };

  const handleDelay = () => {
    setIsDelayFormOpen(true);
  }

  const handleComplete = async () => {
    const formData = new FormData();
    formData.append('EvidenceImage', file);
    try {
      await axios.put(
        `http://localhost:8080/api/orders/complete-order/${selectedOrder}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      alert("Order completed!");
      handleClose();

    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete the order. Please try again.');
    }
  };
  const getOrders = async () => {
    try {
      const res = await apiService.get("/api/orders", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(res.data.result.filter(order => order.orderStatus !== 'IN_CART' && order.orderStatus !== 'COMPLETE_EXCHANGE' && order.orderStatus !== 'IS_FEEDBACK'));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = filterStatus ? orders.filter(order => order.orderStatus === filterStatus) : orders;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Order List</Typography>
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

              <MenuItem value="CANNOT_CONFIRM">Can't confirm</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </FormProvider>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label="order table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User ID</StyledTableCell>
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
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.receiverName}</TableCell>
                <TableCell>{order.receiverPhone}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
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
      {selectedOrderStatus && (
        <Dialog open={true} onClose={handleClose} maxWidth="lg">
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            <Typography>Order ID: {orderDetail.id}</Typography>
            <Typography>Customer Name: {orderDetail.receiverName}</Typography>
            <Typography>Phone Number: {orderDetail.receiverPhone}</Typography>
            <Typography>Address: {orderDetail.shippingAddress}</Typography>
            {orderDetail.orderStatus === 'CANNOT_DELIVER' && (
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
            )}
            <StyledTableCell>
              <Table stickyHeader aria-label="order table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Price</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Product ID</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDetail.map((product) => (
                    <TableRow
                      key={product.productId}
                    >
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.productId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableCell>
          </DialogContent>
          <DialogActions>
            {selectedOrderStatus.orderStatus === 'PAID' && (
              <>
                <Button onClick={handleAccept} color="primary">Accept</Button>
                <Button onClick={handleDeny} color="secondary">Delay</Button>
              </>
            )}
            {selectedOrderStatus.orderStatus === 'IN_DELIVERY' && (
              <>
                <input onChange={handleFileChange} type="file" id="file" accept="image/*" />
                <Button onClick={handleComplete} color="primary">Order Complete</Button>
                <Button onClick={handleDelay} color="secondary">Delay</Button>
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
            )}
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={isDenyFormOpen}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogTitle>Reason for Denial</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeny} color="primary">Cancel</Button>
          <Button onClick={handleDenySubmit} color="secondary">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDelayFormOpen}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogTitle>Reason for Denial</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeny} color="primary">Cancel</Button>
          <Button onClick={handleDelaySubmit} color="secondary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderListStaff;
