// AddStaff.js
import React from 'react';
import { Container, Box, TextField, Typography, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import FTextField from '../components/form/FTextField';
import { Schema } from '../components/validation/validationSchema';
// import * as yup from 'yup';


function ProductForm() {
  const methods = useForm({
    resolver: yupResolver(Schema),
    mode: 'onChange',
  });

  const { handleSubmit } = methods;
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    // Handle adding new staff
  };

  const handleGoBack = () => {
    navigate(-1);  // Equivalent to history.goBack()
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>Thêm Sản Phẩm</Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FTextField
            label="Tên sản phẩm"
            name="productName"
            fullWidth
            margin="normal"
          />
          <FTextField
            label="Giá thành"
            name="price"
            fullWidth
            margin="normal"
          />
          <FTextField
            label="Số lượng"
            name="quantity"
            fullWidth
            margin="normal"
          />
          <FTextField
            name="description"
            label="Mô tả"
            variant="outlined"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">Lưu</Button>
            <Button variant="outlined" onClick={handleGoBack}>Hủy</Button>
          </Box>
        </form>
      </FormProvider>
    </Container>
  );
}

export default ProductForm;
