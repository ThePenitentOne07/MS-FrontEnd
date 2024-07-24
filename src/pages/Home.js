import {
  Container,
  Alert,
  Box,
  Stack,
  Grid,
  Typography,
  CardMedia,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import apiService from "../app/apiService";
import FormProvider from "../components/form/FormProvider";
import { useForm } from "react-hook-form";
import LoadingScreen from "../components/LoadingScreen";
import CategorySidebar from "../components/CategorySidebar";
import BlogCard from "../components/BlogCard";
import Link from "@mui/material/Link";
import ProductFilter from "../components/ProductFilter";
import { orderBy } from "lodash";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function HomePage() {
  const [result, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
      image:
        "https://cdn1.concung.com/img/news/2024/07/2785-1721024942-cover.webp",
      title: "Bà bầu uống sữa tươi thay sữa bầu được không? Loại nào tốt hơn?",
      description:
        "Sữa bầu cung cấp nhiều dưỡng chất cần thiết cho mẹ bầu và thai nhi, song không phải mẹ bầu nào cũng có thể uống được. Vì vậy, mẹ bầu chọn sữa tươi để thay thế sữa bầu. Vậy bà bầu uống sữa tươi thay sữa bầu được không? Loại nào tốt hơn? Hãy cùng Con Cưng tìm hiểu câu trả lời trong bài viết dưới đây nhé!",
      route: "/article1",
    },
    {
      id: 2,
      image:
        "https://cdn1.concung.com/img/news/2024/07/2784-1720672712-cover.webp",
      title: "Top 10 sữa tốt cho bà bầu 3 tháng đầu được tin dùng hiện nay",
      description:
        "Theo lời khuyên của các chuyên gia, mẹ bầu nên uống sữa bầu càng sớm càng tốt. Đặc biệt, 3 tháng đầu được xem là thời điểm vàng để sử dụng sữa bầu, bởi sữa bầu chứa nhiều dưỡng chất tốt cho sự hình thành và phát triển của thai nhi. Vậy bầu 3 tháng nên uống sữa gì? Hãy cùng tham khảo Top 10 sữa tốt cho bà bầu 3 tháng đầu do Con Cưng gợi ý sau đây nhé! ",
      route: "/article2",
    },
    {
      id: 3,
      image:
        "https://cdn1.concung.com/img/news/2024/06/2773-1719286186-cover.webp",
      title: "Top 5 sữa bầu Nhật Bản được nhiều mẹ bầu tin chọn hiện nay",
      description:
        "Sữa bầu Nhật được rất nhiều ba mẹ quan tâm và lựa chọn bởi chất lượng tuyệt vời cùng quy trình sản xuất, tuyển chọn nguyên vật liệu nghiêm ngặt. Con Cưng sẽ gợi ý cho ba mẹ top 5 sữa bầu Nhật Bản được nhiều mẹ bầu tin chọn hiện nay. Ba mẹ tham khảo trong bài viết dưới đây nhé!",
      route: "/article3",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await apiService.get("/api/products", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        // Ensure res.data is an array
        setProducts(
          res.data.result.filter(
            (product) => product.visibilityStatus !== false
          )
        );
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
      <Stack>
        {/* <Grid container spacing={3}> */}
        {/* <Grid item xs={12} sm={4} md={3}> */}
        <CategorySidebar />

        {/* </Grid> */}
        {/* <Grid item xs={12} sm={8} md={9}> */}
        <Stack sx={{ flexGrow: 1, marginTop: 5 }}>
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
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image="https://suabottot.com/wp-content/uploads/2020/01/khuyen-mai-baner.jpg"
                          alt="Your Image"
                          style={{ marginTop: "25px", height: "600px" }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <ProductList result={result.slice(0, 8)} />
                      </Grid>
                    </Grid>
                    <Box mb={2}>
                      <Typography variant="h4" gutterBottom noWrap>
                        Sữa cho mẹ bầu
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image="https://suabottot.com/wp-content/uploads/2020/01/khuyen-mai-baner.jpg"
                          alt="Your Image"
                          style={{ marginTop: "25px", height: "600px" }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <ProductList result={result.slice(0, 8)} />
                      </Grid>
                    </Grid>

                    <Box mb={2} sx>
                      <Typography variant="h4" gutterBottom noWrap>
                        Sản phẩm sắp mở bán chính thức
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image="https://suabottot.com/wp-content/uploads/2020/01/khuyen-mai-baner.jpg"
                          alt="Your Image"
                          style={{ marginTop: "25px", height: "600px" }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <ProductList
                          result={result.filter((product) => {
                            return product.publishDate !== null && product.manuDate === null && product.expiDate === null &&
                              dayjs(product.publishDate).isAfter(dayjs())
                              ? product
                              : null;
                          })}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Box>
          <Box marginTop={3} marginBottom={10}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h4" gutterBottom noWrap>
                Bài viết bổ ích
              </Typography>
              <Link href="/post" underline="hover">
                <Typography gutterBottom>Xem thêm</Typography>
              </Link>
            </Box>
            <Grid container spacing={3}>
              {blogs.map((blog) => (
                <Grid item xs={12} sm={6} md={4} key={blog.id}>
                  <BlogCard
                    route={blog.route}
                    image={blog.image}
                    title={blog.title}
                    description={blog.description}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
        {/* </Grid> */}
        {/* </Grid> */}
      </Stack>
    </Container>
  );
}

export default HomePage;
