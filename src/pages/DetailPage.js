

// export default DetailPage;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Card, Divider, Grid, Stack, Rating, Container, Breadcrumbs, Link, Button, IconButton, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw';
import { Add, Remove } from '@mui/icons-material';
import apiService from '../app/apiService';
import LoadingScreen from '../components/LoadingScreen';
// import ProductList from '../components/ProductList';
import { toast } from 'react-toastify';
function DetailPage() {
    const [product, setProduct] = useState(null);
    // const [result, setProducts] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const params = useParams();
    const [quantity, setQuantity] = useState(1);
    // useEffect(() => {
    //     const getProducts = async () => {
    //         setLoading(true);
    //         try {
    //             const res = await apiService.get("/api/products");
    //             setProducts(res.data.result);
    //             setError("");
    //         } catch (error) {
    //             console.log(error);
    //             setError(error.message);
    //         }
    //         setLoading(false);
    //     };
    //     getProducts();
    // }, []);

    useEffect(() => {
        if (params.productID) {
            const token = localStorage.getItem("token");
            const getProduct = async () => {
                setLoading(true);
                try {

                    const res = await apiService.get(`/api/products/${params.productID}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    setProduct(res.data.result);

                    // setCurrentImage(res.data.result.image); // Set the initial image
                    setError(null);
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                }
                setLoading(false);
            };
            getProduct();
        }
    }, [params]);

    // useEffect(() => {
    //     if (product && product.category) {
    //         const getRelatedProducts = async () => {
    //             try {
    //                 const res = await apiService.get(`/api/products?category=${product.category}&limit=6`);
    //                 setRelatedProducts(res.data.filter(p => p.id !== product.id)); // Exclude the current product
    //             } catch (error) {
    //                 console.log(error);
    //                 setError(error.message);
    //             }
    //         };
    //         getRelatedProducts();
    //     }
    // }, [product]);

    const handleImageClick = (image) => {
        setCurrentImage(image);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, 99));
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
    };


    const handleAddToCart = async () => {
        // Retrieve the user object from local storage
        const savedUser = JSON.parse(localStorage.getItem('user'));

        // Check if the user object exists and get the id
        if (!savedUser || !savedUser.id) {
            console.error('User ID not found in local storage');
            return;
        }

        const userId = savedUser.id;

        const productToAdd = {

            product_id: product.productID,
            quantity: quantity
        };

        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await apiService.post(`api/carts/${userId}/items`, productToAdd, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log('Product added to cart:', response.data);
            toast.success("Sản phẩm đã được thêm vào!")
            // Optionally, trigger any follow-up actions like notifications or updating UI
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            toast.error("Sản phẩm chưa được thêm vào")
            // Optionally, handle errors, e.g., show error message to the user
        }
    };



    const handleBuyNow = () => {
        // Logic for buying now

        console.log("Buy now:", { product, quantity });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container sx={{ my: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
                <Link underline="hover" color="inherit" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">{product?.productName}</Typography>
            </Breadcrumbs>
            <Box sx={{ position: "relative", height: 1 }}>
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        {error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : (
                            <>
                                {product && (
                                    <Card>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                <Box p={2}>
                                                    {/* <Box
                                                        sx={{
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            display: "flex",
                                                            justifyContent: "center"
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                width: 1,
                                                                height: 1,
                                                            }}
                                                            src={currentImage}
                                                            alt="product"
                                                        />
                                                    </Box> */}
                                                    {/* <Stack direction="row" spacing={2} mt={2} justifyContent="center"> */}
                                                    {/* {product.images && product.images.slice(0, 3).map((image, index) => ( */}
                                                    {/* <Box
                                                            key={index}
                                                            component="img"
                                                            src={image}
                                                            alt={`product-${index}`}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                borderRadius: 1,
                                                                cursor: "pointer",
                                                                border: currentImage === image ? '2px solid' : 'none'
                                                            }}
                                                            onClick={() => handleImageClick(image)}
                                                        /> */}
                                                    {/* ))} */}
                                                    {/* </Stack> */}
                                                    <Box
                                                        sx={{
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                width: 1,
                                                                height: 1,
                                                            }}
                                                            src={product.productImage}
                                                            alt="product"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        mt: 2,
                                                        mb: 1,
                                                        display: "block",
                                                        textTransform: "uppercase",
                                                        color:
                                                            product.status === "sale"
                                                                ? "error.main"
                                                                : "info.main",
                                                    }}
                                                >
                                                    In Stock: {product.quantity}
                                                </Typography>
                                                <Typography variant="h5" paragraph>
                                                    {product.productName}
                                                </Typography>
                                                {/* <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Rating
                                                        value={product.totalRating}
                                                        precision={0.1}
                                                        readOnly
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "text.secondary" }}
                                                    >
                                                        ({product.totalReview} reviews)
                                                    </Typography>
                                                </Stack> */}
                                                <Typography variant="h4" sx={{ mb: 3 }}>
                                                    {/* <Box
                                                        component="span"
                                                        sx={{
                                                            color: "text.disabled",
                                                            textDecoration: "line-through",
                                                        }}
                                                    >
                                                        {product.priceSale}
                                                    </Box> */}
                                                    &nbsp;{product.price}
                                                </Typography>

                                                <Divider sx={{ borderStyle: "dashed" }} />
                                                <Box>
                                                    <ReactMarkdown
                                                        // rehypePlugins={[rehypeRaw]}
                                                        children={product.productDescription}
                                                    />
                                                </Box>

                                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                                    <IconButton onClick={handleDecreaseQuantity}>
                                                        <Remove />
                                                    </IconButton>
                                                    <TextField
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleQuantityChange}
                                                        inputProps={{
                                                            min: 1,
                                                            max: 99,
                                                            style: { textAlign: 'center' },
                                                        }}
                                                        sx={{ width: 60 }}
                                                    />
                                                    <IconButton onClick={handleIncreaseQuantity}>
                                                        <Add />
                                                    </IconButton>
                                                </Stack>
                                                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                                    <Button variant="contained" color="primary" onClick={handleAddToCart}>
                                                        Add to Cart
                                                    </Button>
                                                    <Button variant="contained" color="secondary" onClick={handleBuyNow}>
                                                        Buy Now
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                )}
                                {!product && (
                                    <Typography variant="h6">404 Product not found</Typography>
                                )}
                            </>
                        )}
                    </>
                )}
            </Box>
            <Box sx={{ position: "relative", height: 1 }}>
                <Typography/>
                {/* {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        {error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : (
                            <>
                                <Box mb={2}>
                                    <Typography variant="h4" gutterBottom noWrap>
                                        Related products
                                    </Typography>
                                </Box>
                                <ProductList products={products.slice(0, 4)} />

                            </>
                        )}
                    </>
                )} */}
            </Box>
        </Container>
    );
}

export default DetailPage;
