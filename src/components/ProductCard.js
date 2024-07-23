import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { fCurrency } from "../utils";//Hiện giá tiền theo đô

function ProductCard({ product }) {
    const navigate = useNavigate();
    return (
        <Card onClick={() => navigate(`/product/${product.productID}`)} sx={{ border: '2px solid #cb8bcd' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.productImage}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="body1" component="div" noWrap>
                        {product.productName}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        {/* {product.priceSale && (
                            <Typography
                                component="span"
                                sx={{ color: "text.disabled", textDecoration: "line-through" }}
                            > */}
                        {/* {fCurrency(product.priceSale)} {product.priceSale} */}
                        {/* </Typography>
                        )} */}
                        <Typography variant="subtitle1">
                            {/* {fCurrency(product.price)} */} {product.price}VND
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ProductCard;
