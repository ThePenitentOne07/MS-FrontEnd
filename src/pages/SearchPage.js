import { Container, Alert, Box, Stack, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import apiService from '../app/apiService';
import FormProvider from '../components/form/FormProvider';
import { useForm } from "react-hook-form";
import LoadingScreen from '../components/LoadingScreen';
import CategorySidebar from '../components/CategorySidebar';
import ProductFilter from '../components/ProductFilter';
import BlogCard from '../components/BlogCard';
import { useParams } from 'react-router-dom';
import Link from '@mui/material/Link';

function SearchPage() {
    const [result, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams();

    const defaultValues = {
        priceRange: ""
    }
    const methods = useForm({
        defaultValues,
    });
    const { watch, reset } = methods;
    const filters = watch();
    const filterProducts = applyFilter(result, filters);


    useEffect(() => {
        if (params.searchTerm) {
            const token = localStorage.getItem("token");
            const getProducts = async () => {
                setLoading(true);
                try {
                    const res = await apiService.get(`/api/products/search?value=${params.searchTerm}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    // Ensure res.data.result is an array
                    setProducts(res.data.result.filter(product => product.visibilityStatus !== false) || []);
                    setError("");
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                }
                setLoading(false);
            };

            getProducts();
        }
    }, [params]);

    return (
        <Container sx={{ display: "flex", minHeight: "100vh" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={3}>
                    <Stack spacing={2} sx={{ position: 'fixed', width: 'inherit' }}>
                        <FormProvider methods={methods}>
                            <ProductFilter resetFilter={reset} />
                        </FormProvider>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Stack sx={{ flexGrow: 1 }}>
                        <FormProvider>
                            <Stack
                                spacing={2}
                                direction={{ xs: "column", sm: "row" }}
                                alignItems={{ sm: "center" }}
                                justifyContent="space-between"
                                mb={2}
                            >
                                {/* Add form elements or filter components here if needed */}
                            </Stack>
                        </FormProvider>
                        <Box sx={{ position: "relative", height: 1 }}>
                            {loading ? (
                                <LoadingScreen />
                            ) : (
                                <>
                                    {error ? (
                                        <Alert severity="error">{error}</Alert>
                                    ) : (
                                        <>
                                            <Box mb={2}>
                                                <Typography variant="h4" gutterBottom noWrap>
                                                    {/* Title or Heading */}
                                                </Typography>
                                            </Box>
                                            {result.length > 0 ? (
                                                <ProductList result={filterProducts} />
                                            ) : (
                                                <Typography variant="h2">
                                                    Không có sản phẩm bạn tìm
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}
function applyFilter(result, filters) {

    let filteredProducts = result;
    if (filters.priceRange) {
        filteredProducts = result.filter((product) => {
            if (filters.priceRange === "below") {
                return product.price < 25;
            }
            if (filters.priceRange === "between") {
                return product.price >= 25 && product.price <= 75;
            }
            return product.price > 75;
        });
    }
    return filteredProducts;
}
export default SearchPage;
