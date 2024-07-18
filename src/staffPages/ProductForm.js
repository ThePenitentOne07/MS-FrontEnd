import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Alert,
  styled,
} from "@mui/material";
import apiService from "../app/apiService";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const HelperTextTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: theme.typography.caption.fontSize,
  marginLeft: theme.spacing(1),
}));

const StyledDatePicker = styled(DatePicker)(({ theme, error }) => ({
  "& .MuiInputBase-root": {
    borderBottom: `1px solid ${error ? theme.palette.error.main : theme.palette.grey[500]
      }`, // Set border color based on error state
    borderRadius: theme.shape.borderRadius,
    paddingBottom: theme.spacing(0.12), // Add some padding for label
    "& fieldset": {
      // Target fieldset element for border visibility
      border: "none", // Remove default fieldset border
    },
  },
  "& .Mui-focused .MuiInputBase-root": {
    // Add focus style (optional)
    borderColor: theme.palette.primary.main,
  },
}));

function ProductForm({ categories, onClose }) {
  const initialCategoryID = categories.length > 0 ? categories[0].id : "";
  const [errorDisplay, setErrorDisplay] = useState("")

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    productDescription: "",
    manuDate: "",
    expiDate: "",
    categoryID: initialCategoryID,
    productImage: null,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({
    productName: "",
    price: "",
    quantity: "",
    productDescription: "",
    manuDate: "",
    expiDate: "",
  });

  useEffect(() => {
    if (categories.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        categoryID: categories[0].id,
      }));
    }
  }, [categories]);

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "productName":
        errorMessage = value.trim() ? "" : "Tên sản phẩm không được để trống.";
        break;
      case "price":
        const price = parseFloat(value);
        errorMessage =
          isNaN(price) || price <= 0
            ? "Giá sản phẩm phải là số lớn hơn 0."
            : "";
        break;
      case "quantity":
        const quantity = parseInt(value);
        errorMessage =
          isNaN(quantity) || quantity <= 0
            ? "Số lượng sản phẩm phải là số nguyên lớn hơn 0."
            : "";
        break;
      case "productDescription":
        errorMessage = value.trim()
          ? ""
          : "Mô tả sản phẩm không được để trống.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateDate = (fieldName, value) => {
    let errorMessage = "";

    const currentDate = dayjs();

    switch (fieldName) {
      case "manuDate":
        const manuDate = dayjs(value);
        errorMessage =
          !manuDate.isValid() || manuDate.isAfter(currentDate)
            ? "Ngày sản xuất không hợp lệ."
            : "";
        break;
      case "expiDate":
        const expiDate = dayjs(value);
        errorMessage =
          !expiDate.isValid() ||
            expiDate.isBefore(currentDate, "day") ||
            (formData.manuDate &&
              dayjs(formData.manuDate).isValid() &&
              expiDate.isBefore(dayjs(formData.manuDate), "day"))
            ? "Ngày hết hạn không hợp lệ."
            : "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setIsDirty(Object.values(updatedData).some((value) => value !== ""));
      return updatedData;
    });
    validateField(name, value);
  };

  const handleDateChange = (name, date) => {
    console.log(name + ": " + date);
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: dayjs(date).format("YYYY-MM-DD"),
      };
      setIsDirty(true);
      return updatedData;
    });
    validateDate(name, date.format("YYYY-MM-DD"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({ ...prevData, productImage: file }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let isError = false;
    for (const key in errors) {
      if (errors[key] !== "") isError = true;
    }
    if (isError || formData.productImage == null) {
      window.alert(
        "Vui lòng kiểm tra lại các trường nhập và nhập đúng thông tin"
      );
      return;
    }
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      await apiService.post("/api/products", formDataToSend, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      window.alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      if (window.confirm("Thay đổi sẽ không được lưu, bạn có chắc chắn hủy?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Container sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tạo sản phẩm mới
        </Typography>
      </Box>
      {errorDisplay && <Alert severity="error">{errorDisplay}</Alert>}
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="Tên sản phẩm"
          name="productName"
          fullWidth
          margin="normal"
          value={formData.productName}
          onChange={handleChange}
          error={!!errors.productName}
          helperText={errors.productName}
        />
        <TextField
          label="Giá thành"
          name="price"
          fullWidth
          margin="normal"
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          label="Số lượng"
          name="quantity"
          fullWidth
          margin="normal"
          value={formData.quantity}
          onChange={handleChange}
          error={!!errors.quantity}
          helperText={errors.quantity}
        />
        <TextField
          name="productDescription"
          label="Mô tả"
          variant="outlined"
          fullWidth
          multiline
          value={formData.productDescription}
          rows={4}
          onChange={handleChange}
          error={!!errors.productDescription}
          helperText={errors.productDescription}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <StyledDatePicker
              format="DD-MM-YYYY"
              label="Ngày sản xuất"
              name="manuDate"
              fullWidth
              margin="normal"
              value={dayjs(formData.manuDate)}
              onChange={(date) => handleDateChange("manuDate", date)}
              error={!!errors.manuDate}
            />
            {errors.manuDate && (
              <HelperTextTypography>{errors.manuDate}</HelperTextTypography>
            )}
            <StyledDatePicker
              format="DD-MM-YYYY"
              label="Ngày hết hạn"
              name="expiDate"
              fullWidth
              margin="normal"
              value={dayjs(formData.expiDate)}
              onChange={(date) => handleDateChange("expiDate", date)}
              error={!!errors.expiDate}
            />
            {errors.expiDate && (
              <HelperTextTypography>{errors.expiDate}</HelperTextTypography>
            )}
          </Box>
        </LocalizationProvider>
        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục sản phẩm</InputLabel>
          <Select
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, mb: 2 }}>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <Typography>Hình ảnh sản phẩm:</Typography>
              <img
                src={imagePreview}
                alt="Product"
                style={{ width: "100%", maxHeight: "300px" }}
              />
            </Box>
          )}
          <Button variant="contained" component="label">
            Tải lên hình ảnh (*)
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            disabled={!isDirty}
            onClick={handleSubmit}
          >
            Tạo sản phẩm
          </LoadingButton>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelClick}
          >
            Hủy
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default ProductForm;
