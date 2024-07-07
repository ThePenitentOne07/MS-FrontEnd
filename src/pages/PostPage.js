import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import PostCard from '../components/PostCard';
import apiService from '../app/apiService';

export default function PostPage() {
    // const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // useEffect(() => {
    //     const fetchBlogs = async () => {
    //         try {
    //             const res = await apiService.get('/blogs'); // Replace with your API endpoint
    //             setBlogs(res.data.blogs);
    //             setError("");
    //         } catch (error) {
    //             setError(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchBlogs();
    // }, []);
    const blogs =[
        {
            "id": 1,
            "image": "https://via.placeholder.com/150",
            "title": "Tất tần tật những sự thật hay ho thú vị về thai nhi 6 tuần tuổi",
            "description": "Discover interesting facts about a 6-week-old fetus."
          },
          {
            "id": 2,
            "image": "https://via.placeholder.com/150",
            "title": "3 cách rèn cho trẻ sơ sinh tự ngủ mà mẹ cần biết",
            "description": "Learn three effective methods to help newborns sleep on their own."
          },
          {
            "id": 3,
            "image": "https://via.placeholder.com/150",
            "title": "Top 4 loại đồ chơi cho bé 1 tuổi phát triển trí não ba mẹ nên mua ngay",
            "description": "Top 4 toys for 1-year-olds that parents should buy to boost brain development."
          },
          {
            "id": 4,
            "image": "https://via.placeholder.com/150",
            "title": "Dinh dưỡng cho bà bầu trong 3 tháng đầu tiên",
            "description": "Essential nutrition tips for pregnant women in their first trimester."
          },
          {
            "id": 5,
            "image": "https://via.placeholder.com/150",
            "title": "Những điều cần biết về chăm sóc trẻ sơ sinh",
            "description": "Everything you need to know about newborn care."
          },
          {
            "id": 6,
            "image": "https://via.placeholder.com/150",
            "title": "Làm thế nào để trẻ ăn dặm đúng cách",
            "description": "How to properly introduce solid foods to your baby."
          },
          {
            "id": 7,
            "image": "https://via.placeholder.com/150",
            "title": "Các phương pháp giáo dục sớm cho trẻ em",
            "description": "Early education methods for young children."
          },
          {
            "id": 8,
            "image": "https://via.placeholder.com/150",
            "title": "Bí quyết giúp bé ngủ ngon suốt đêm",
            "description": "Tips to help your baby sleep through the night."
          },
          {
            "id": 9,
            "image": "https://via.placeholder.com/150",
            "title": "Làm thế nào để tăng cường hệ miễn dịch cho bé",
            "description": "How to boost your child's immune system."
          },
          {
            "id": 10,
            "image": "https://via.placeholder.com/150",
            "title": "Tại sao nên cho bé nghe nhạc từ sớm",
            "description": "The benefits of exposing your baby to music early on."
          }
    ]
    return (
        <Container sx={{ mt: 4 , mb: 4}}>
            <Typography variant="h4" gutterBottom>
                Bài viết bổ ích
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Grid container spacing={3}>
                    {blogs.map((blog) => (
                        <Grid item xs={12} sm={6} md={4} key={blog.id}>
                            <PostCard 
                                image={blog.image} 
                                title={blog.title} 
                                description={blog.description} 
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
