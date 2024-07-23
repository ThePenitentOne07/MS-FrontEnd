// Info.js
import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import apiService from '../../app/apiService';
import { CircularProgress } from '@mui/material';
import { formatCurrency } from '../../app/util';

function Info({ totalPrice, setTotalPrice, setCartId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (!savedUser || !savedUser.id) {
      console.error('User ID not found in local storage');
      setError('User ID not found in local storage');
      return;
    }

    const userId = savedUser.id;
    const token = localStorage.getItem("token");

    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/api/carts/${userId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (response.data.result.length > 0 && response.data.result[0].items) {
          const items = response.data.result[0].items;
          setCartItems(items);
          setError('');
          setCartId(response.data.result[0].cartId); // Save cart ID

          const total = items.reduce((acc, item) => acc + parseFloat(item.price * item.quantity), 0);
          setTotalPrice(total);
        } else {
          setError('No items in cart');
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        setError(error.message || 'An error occurred while fetching cart items');
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [setTotalPrice, setCartId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {formatCurrency(totalPrice)}VND
      </Typography>
      <List disablePadding>
        {cartItems.map((item) => (
          <ListItem key={item.productId} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.productName}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  X {item.quantity}
                </Typography>
              }
            />
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(item.price)}VND
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.string.isRequired,
  setTotalPrice: PropTypes.func.isRequired,
  setCartId: PropTypes.func.isRequired,
};

export default Info;
