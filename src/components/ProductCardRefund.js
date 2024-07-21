// ProductCard.jsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Remove from '@mui/icons-material/Remove';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';

export default function ProductCardRefund({ item, onChoose, handleDecreaseQuantity, handleIncreaseQuantity, handleQuantityChange, handleRemoveItem, handleKeyDown }) {
    return (
        <Card key={item.productId} sx={{ display: 'flex', mb: 2, border: '2px solid #cb8bcd', width: 1100 }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={item.productImage}
                alt={item.productName}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {item.productName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

                    <TextField
                        type="number"
                        value={item.quantity}
                        onKeyDown={handleKeyDown}
                        onChange={(event) => handleQuantityChange(item.productId, event)}
                        inputProps={{
                            min: 1,
                            max: 99,
                            style: { textAlign: 'center' },
                        }}
                        sx={{ width: 60 }}
                        disabled
                    />

                </Box>
            </Box>
            <CardActions>
                <Button size="small" onClick={() => onChoose(item)}>
                    Choose
                </Button>
            </CardActions>
        </Card>
    );
}
