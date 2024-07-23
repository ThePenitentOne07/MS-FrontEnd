import * as React from 'react';
import axios from 'axios';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import apiService from '../../app/apiService';
import { formatCurrency } from '../../app/util';

const addresses = ['1 MUI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
  { name: 'Card type:', detail: 'Visa' },
  { name: 'Card holder:', detail: 'Mr. John Smith' },
  { name: 'Card number:', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date:', detail: '04/2024' },
];

export default function Review({ orderId }) {
  const [orderDetails, setOrderDetails] = React.useState(null);

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await apiService.get(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setOrderDetails(response.data.result);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!orderDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={2}>
      <List disablePadding>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tổng cộng" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {formatCurrency(orderDetails.totalPrice)}VND
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Địa chỉ nhận hàng
          </Typography>
          <Typography gutterBottom>{orderDetails.receiverName}</Typography>
          <Typography color="text.secondary" gutterBottom>
            {orderDetails.shippingAddress}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
