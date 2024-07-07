import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Divider, Button, Alert, Container, Typography, Box, Link } from '@mui/material';
import "../App.css";
import FTextField from '../components/form/FTextField';
import FormProvider from '../components/form/FormProvider';
import * as yup from 'yup';
import { LoadingButton } from "@mui/lab";
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../components/form/FormContext';

const Schema = yup.object().shape({
    emailAddress: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
});

const defaultValues = {
    emailAddress: ""
}

function Register() {
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
        const { emailAddress } = data;
        try {
            await auth.sendEmail({ emailAddress }, () => {
                updateFormData({ emailAddress });
                navigate('/otp'); // Pass email as a query parameter
            });
        } catch (error) {
            reset();
            setError("responseError", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                sx={{
                    padding: 4,
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                    Đăng ký
                </Typography>
                {!!errors.responseError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errors.responseError.message}</Alert>
                )}
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <FTextField
                        name="emailAddress"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        color="secondary"
                    />
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{
                            backgroundColor: '#4285F4',
                            color: '#FFFFFF',
                            py: 1.5,
                            mb: 2,
                            '&:hover': { backgroundColor: '#357ae8' }
                        }}
                        fullWidth
                    >
                        Lấy OTP
                    </LoadingButton>

                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                        Đã có tài khoản?{' '}
                        <Link href="/login" underline="hover" color="secondary">
                            Đăng nhập
                        </Link>
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#4285F4',
                            color: '#FFFFFF',
                            '&:hover': { backgroundColor: '#357ae8' },
                            py: 1.5
                        }}
                        fullWidth
                        onClick={() => { console.log('Login with Google'); }}
                    >
                        Đăng nhập bằng Google
                    </Button>
                </FormProvider>
            </Box>
        </Container>
    );
}

export default Register;
