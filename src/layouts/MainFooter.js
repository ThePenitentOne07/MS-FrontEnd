import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const MainFooter = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: "#e0a8e3",
                color: "white"
            }}
        >
            <Typography variant="body1" align="center">
                &copy; {new Date().getFullYear()} Sữa mẹ và bé
            </Typography>
            <Typography variant="body2" color="white" align="center" >
                {'Giới thiệu về '}
                <Link color="inherit" href="https://mui.com/">
                    Sữa mẹ và bé
                </Link>
                {'.'}
            </Typography>
        </Box>
    );
};

export default MainFooter;
