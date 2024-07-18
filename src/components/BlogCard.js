import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const BlogCard = ({ image, title, description, route }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`${route}`)} sx={{ maxWidth: 500, border: '2px solid #cb8bcd' }} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div" sx={{
            display: { xs: 'none', sm: 'block' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BlogCard;
