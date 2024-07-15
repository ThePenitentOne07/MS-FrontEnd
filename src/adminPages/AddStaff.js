import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Divider,
  Button,
  Alert,
  Container,
  Typography,
  Box,
  Link,
  MenuItem,
  Select,
} from "@mui/material";
import "../App.css";
import FTextField from "../components/form/FTextField";
import FormProvider from "../components/form/FormProvider";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../components/form/FormContext";
import apiService from "../app/apiService";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const Schema = yup.object().shape({
  emailAddress: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  phoneNumber: yup.string().required("Số điện thoại không được để trống").matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
  username: yup.string().required("Tên người dùng không được để trống"),
  password: yup.string().required("Mật khẩu không được để trống"),
  roleName: yup.string().required("Chức vụ không được để trống"),
});

const defaultValues = {
  emailAddress: "",
  phoneNumber: "",
  username: "",
  password: "",
  roleName: "",
};

function AddStaff() {
  const navigate = useNavigate();
  const { updateFormData } = useFormContext();

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    let { emailAddress, username, password, phoneNumber, roleName } = data;
    try {
      const response = await apiService.post(
        "/users",
        { emailAddress, username, password, phoneNumber, roleName },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thêm nhân viên thành công"); // Navigate after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
      setError("responseError", { message: error.message });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          padding: 4,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Thêm Nhân Viên
        </Typography>
        {!!errors.responseError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.responseError.message}
          </Alert>
        )}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <FTextField
            name="emailAddress"
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FTextField
            name="phoneNumber"
            label="Số Điện Thoại"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FTextField
            name="username"
            label="Tên Người Dùng"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FTextField
            name="password"
            label="Mật Khẩu"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FTextField
            name="roleName"
            label="Chức Vụ"
            select
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {["SELLER", "POST_STAFF", "PRODUCT_STAFF", "MANAGER"].map(
              (option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              )
            )}
          </FTextField>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              backgroundColor: "#4285F4",
              color: "#FFFFFF",
              py: 1.5,
              mb: 2,
              "&:hover": { backgroundColor: "#357ae8" },
            }}
            fullWidth
          >
            Thêm Nhân Viên
          </LoadingButton>
        </FormProvider>
      </Box>
    </Container>
  );
}

export default AddStaff;
