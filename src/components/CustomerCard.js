import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';

const CustomerCard = ({ customer, onClick }) => (
  <Card onClick={() => onClick(customer)}>
    <CardActionArea>
      <CardContent>
        <Typography variant="h5">{customer.name}</Typography>
        <Typography variant="body2">Role: {customer.role}</Typography>
        <Typography variant="body2">Added on: {customer.addedOn}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default CustomerCard;
