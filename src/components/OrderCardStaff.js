
import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';

const OrderCardStaff = ({ order, onClick }) => {
  return (
    <Card onClick={onClick}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6">{order.productName}</Typography>
          <Typography variant="body2" color="textSecondary">Customer: {order.customerName}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCardStaff;
