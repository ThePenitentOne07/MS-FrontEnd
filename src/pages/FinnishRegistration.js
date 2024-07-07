import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useFormContext } from '../components/form/FormContext';
import { toast } from "react-toastify";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const Schema = yup.object().shape({
  emailAddress: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  phoneNumber: yup.string().required('Số điện thoại không được để trống').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
  password: yup.string().required('Mật khẩu không được để trống'),
  username: yup
    .string()
    .matches(/^[A-Za-zÀ-ÖÙ-öù-ÿĀ-žḀ-ỿăươ  ]*$/, 'Tên không hợp lệ')
    .max(40, 'Tên không được quá 40 ký tự')
    .required('Tên không được để trống'),

});



function FinishRegistration() {
  const { email } = useParams();
  const auth = useAuth();
  const { formData } = useFormContext();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(Schema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: "",
      username: "",
      password: "",

    },
  });

  const { handleSubmit, control, reset, setError, setValue, formState: { errors, isSubmitting } } = methods;

  useEffect(() => {
    // Set the email value in the form if it's available in the context
    if (formData.emailAddress) {
      setValue('emailAddress', formData.emailAddress);
    } else if (email) {
      setValue('emailAddress', email);
    }
  }, [email, formData, setValue]);

  const onSubmit = async (data) => {
    const { emailAddress, phoneNumber, username, password } = data;
    try {
      await auth.register({ emailAddress, phoneNumber, username, password }, () => {
        navigate("/login", { replace: true });
        toast.success("Đăng ký thành công")
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
            Hoàn thành đăng ký
          </Typography>
          <Controller
            name="emailAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                error={!!errors.emailAddress}
                helperText={errors.emailAddress ? errors.emailAddress.message : ""}
                disabled
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Số điện thoại"
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mật khẩu"
                type="password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#4285F4', color: '#FFFFFF', '&:hover': { backgroundColor: '#E64A19' } }}
          >
            Gửi
          </Button>
        </Box>
      </Container>
    </FormProvider>
  );
};

export default FinishRegistration;
