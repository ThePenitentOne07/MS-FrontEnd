// ProductCard.jsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';


export default function OrderRefundCardList({ item, onChoose, handleDecreaseQuantity, handleIncreaseQuantity, handleQuantityChange, handleRemoveItem, handleKeyDown }) {
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(`/`)} key={item.productId}
            sx={{
                display: 'flex',
                mb: 2,
                border: '2px solid #cb8bcd',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                }
            }}
        >
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={item.customerImage}
                alt={item.productName}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {item.productName}
                    </Typography>

                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>


                </Box>
            </Box>

        </Card>
    );
}
