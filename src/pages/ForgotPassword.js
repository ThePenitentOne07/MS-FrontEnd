import React from 'react';
import { useForm } from 'react-hook-form';
import FormProvider from '../components/form/FormProvider';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FTextField from '../components/form/FTextField';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useFormContext } from '../components/form/FormContext';
const Schema = yup.object().shape({
    email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
});
const defaultValues = {
    email: ""
}
function ForgotPassword() {
    const navigate = useNavigate();
    const auth = useAuth();
    const { updateFormData } = useFormContext()

    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues,
        mode: 'onChange' // Validate on change
    });

    const {
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = methods;

    const onSubmit = async (data) => {
        const { email } = data;
        try {
            await auth.sendEmailForgot({ email }, () => {
                updateFormData({ email });
                navigate('/otp'); // Pass email as a query parameter
            });
        } catch (error) {
            reset();
            setError("responseError", error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Container maxWidth="sm">
                <Box


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
                        Bạn quên mật khẩu?
                    </Typography>
                    <Typography variant="h6" component="h1" gutterBottom>
                        Hãy nhập địa chỉ email trước đó bạn dùng để đăng ký
                    </Typography>
                    <FTextField
                        name="emailAddress"
                        label="Email"
                        variant="outlined"

                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ backgroundColor: '#4285F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#E64A19' } }}
                    >
                        Đặt lại mật khẩu
                    </Button>
                </Box>
            </Container>
        </FormProvider>
    );
}

export default ForgotPassword;
