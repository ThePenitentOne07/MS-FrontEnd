
import { Container, Alert, Box, Stack, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import apiService from '../app/apiService';
import FormProvider from '../components/form/FormProvider';
import { useForm } from "react-hook-form";
import LoadingScreen from '../components/LoadingScreen';
import CategorySidebar from '../components/CategorySidebar';
import BlogCard from '../components/BlogCard';
import Link from '@mui/material/Link';
import ProductFilter from '../components/ProductFilter';
import { orderBy } from 'lodash';

function HomePage() {
    const [result, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const defaultValues = {
        gender: [],
        category: "All",
        priceRange: "",
        sortBy: "featured",
        searchQuery: "",
    };
    const methods = useForm({
        defaultValues,
    });
    const { reset } = methods;

    const blogs = [
        {
            id: 1,
            image: "https://example.com/images/blog1.jpg",
            title: "Tất tần tật những sự thật hay ho thú vị về thai nhi 6 tuần tuổi",
            description: "Discover interesting facts about a 6-week-old fetus."
        },
        {
            id: 2,
            image: "https://example.com/images/blog2.jpg",
            title: "3 cách rèn cho trẻ sơ sinh tự ngủ mà mẹ cần biết",
            description: "Learn three effective methods to help newborns sleep on their own."
        },
        {
            id: 3,
            image: "https://example.com/images/blog3.jpg",
            title: "Top 4 loại đồ chơi cho bé 1 tuổi phát triển trí não ba mẹ nên mua ngay",
            description: "Top 4 toys for 1-year-olds that parents should buy to boost brain development."
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const getProducts = async () => {
            setLoading(true);
            try {
                const res = await apiService.get("/api/products", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                // Ensure res.data is an array
                setProducts(res.data.result);
                setError("");

            } catch (error) {
                console.log(error);
                setError(error.message);
            }
            setLoading(false);
        };

        // const { watch, reset } = methods;
        // const filters = watch();
        // const filterProducts = applyFilter(products, filters);

        getProducts();
    }, []);

    return (
        <Container sx={{ display: "flex", minHeight: "100vh" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={3}>
                    <Stack spacing={2} sx={{ position: 'fixed', width: 'inherit' }}>
                        <CategorySidebar />
                        <FormProvider methods={methods}>

                        </FormProvider>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Stack sx={{ flexGrow: 1 }}>
                        <FormProvider methods={methods}>
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
                                            <Box mb={2} sx>
                                                <Typography variant="h4" gutterBottom noWrap>
                                                    Thịnh Hành
                                                </Typography>
                                            </Box>
                                            <ProductList result={result.slice(0, 8)} />
                                            <Box mb={2}>
                                                <Typography variant="h4" gutterBottom noWrap>
                                                    Sữa cho mẹ bầu
                                                </Typography>
                                            </Box>
                                            <ProductList result={result.slice(0, 8)} />
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                        <Box marginTop={3} marginBottom={10}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h4" gutterBottom noWrap>
                                    Bài viết bổ ích
                                </Typography>
                                <Link href="/post" underline="hover">
                                    <Typography gutterBottom>
                                        Xem thêm
                                    </Typography>
                                </Link>
                            </Box>
                            <Grid container spacing={3}>
                                {blogs.map((blog) => (
                                    <Grid item xs={12} sm={6} md={4} key={blog.id}>
                                        <BlogCard
                                            image={blog.image}
                                            title={blog.title}
                                            description={blog.description}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

function applyFilter(products, filters) {
    const { sortBy } = filters;
    let filteredProducts = products;

    // SORT BY
    if (sortBy === "featured") {
        filteredProducts = orderBy(products, ["sold"], ["desc"]);
    }
    if (sortBy === "newest") {
        filteredProducts = orderBy(products, ["createdAt"], ["desc"]);
    }
    if (sortBy === "priceDesc") {
        filteredProducts = orderBy(products, ["price"], ["desc"]);
    }
    if (sortBy === "priceAsc") {
        filteredProducts = orderBy(products, ["price"], ["asc"]);
    }

    // FILTER PRODUCTS
    if (filters.gender.length > 0) {
        filteredProducts = products.filter((product) =>
            filters.gender.includes(product.gender)
        );
    }
    if (filters.category !== "All") {
        filteredProducts = products.filter(
            (product) => product.category === filters.category
        );
    }
    if (filters.priceRange) {
        filteredProducts = products.filter((product) => {
            if (filters.priceRange === "below") {
                return product.price < 25;
            }
            if (filters.priceRange === "between") {
                return product.price >= 25 && product.price <= 75;
            }
            return product.price > 75;
        });
    }
    if (filters.searchQuery) {
        filteredProducts = products.filter((product) =>
            product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
    }
    return filteredProducts;
}

export default HomePage;
