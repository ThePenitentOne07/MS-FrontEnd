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
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            }}
        >
            <Typography variant="body1" align="center">
                &copy; {new Date().getFullYear()} My Company
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Built with '}
                <Link color="inherit" href="https://mui.com/">
                    Material-UI
                </Link>
                {'.'}
            </Typography>
        </Box>
    );
};

export default MainFooter;
