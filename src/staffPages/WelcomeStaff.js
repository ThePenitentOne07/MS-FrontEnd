import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function WelcomeAdmin() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="inherit" gutterBottom>
            Welcome Hữu Hiền 
          </Typography>
          <Typography component="p" variant="body1" color="inherit">
            Here you can manage your site settings, view reports, and more.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default WelcomeAdmin;
