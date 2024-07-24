import React from 'react';
import { useForm } from 'react-hook-form';
import FormProvider from '../components/form/FormProvider';
import { TextField, Button, Container, Typography, Box, Link, Divider, Alert } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { LoadingButton } from "@mui/lab";
import * as yup from 'yup';
import FTextField from '../components/form/FTextField';
import "../App.css";

const schema = yup.object().shape({
    password: yup.string().required('Mật khẩu không được để trống'),
    username: yup.string().required('Email không được để trống').email('Định dạng email không hợp lệ')
});

const defaultValues = {
    username: "",
    password: "",
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
        mode: 'onChange'
    });
    const {
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        const from = location.state?.from?.pathname || "/";
        let { username, password } = data;

        try {
            const user = await auth.login({ username, password });
            console.log(user.role);
            if (user.role === "ADMIN") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                if (user.role === ("SELLER") || user.role === ("PRODUCT_STAFF") || user.role === ("POST_STAFF")) {
                    navigate("/staff/order", { replace: true });
                } else {
                    navigate("/");
                }
                // navigate(from, { replace: true });
            }
        } catch (error) {
            reset();
            setError("responseError", error);
        }
    };
    const handleLoginGoogle = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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
                    Đơn đăng nhập
                </Typography>
                {!!errors.responseError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errors.responseError.message}</Alert>
                )}
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <FTextField
                        name="username"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        color="secondary"
                    />
                    <FTextField
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                        color="secondary"
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"

                        loading={isSubmitting}
                        sx={{ py: 1.5, mb: 2, mb: 1, backgroundColor: '#4285F4', '&:hover': { backgroundColor: '#357ae8' } }}
                    >
                        Login
                    </LoadingButton>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        Chưa có tài khoản?{' '}
                        <Link href="/register" underline="hover" color="secondary">
                            Đăng ký
                        </Link>
                    </Typography>
                </FormProvider>

            </Box>
        </Container>
    );
}

export default Login;
