import React from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function Error() {
  const navigate= useNavigate();
  const handleHome = () =>{
    navigate('/')
  }
  return (
    <FormProvider>
      <Container maxWidth="sm">
                <Box
                    component="form"
                    // onSubmit={methods.handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 5,
                        padding: 3,
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Page not found
                    </Typography>
                    <Button
                        onClick={handleHome}
                        variant="contained"
                        sx={{ backgroundColor: '#FF5722', color: '#FFFFFF', '&:hover': { backgroundColor: '#E64A19' } }}
                    >
                        Home
                    </Button>
                   
                    
                </Box>
            </Container>
                    </FormProvider>
  )
}

export default Error
