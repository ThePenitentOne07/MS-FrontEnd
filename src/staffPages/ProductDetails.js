import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  styled,
} from "@mui/material";
import apiService from "../app/apiService";
import { LoadingButton } from "@mui/lab";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function ProductDetails({ product, categories, onClose, onDeleteSuccess }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [formData, setFormData] = useState({
    productID: "",
    productName: "",
    price: "",
    quantity: "",
    productDescription: "",
    manuDate: "",
    expiDate: "",
    categoryID: "",
    productImage: "",
  });
  const [initialData, setInitialData] = useState({});
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
    if (product) {
      const initialValues = {
        productID: product.productID,
        productName: product.productName,
        price: product.price,
        quantity: product.quantity,
        productDescription: product.productDescription,
        manuDate: product.manuDate,
        expiDate: product.expiDate,
        categoryID: product.categoryID,
        productImage: product.productImage,
      };
      setFormData(initialValues);
      setInitialData(initialValues);
      setImagePreview(product.productImage);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(initialData));
      return updatedData;
    });

    validateField(name, value);
  };

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

  const handleDateChange = (name, date) => {
    console.log(name + ": " + date);
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: dayjs(date).format("YYYY-MM-DD"),
      };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(initialData));
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
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "productImage" && typeof formData[key] === "string") {
          // Set the value to null if it's a default URL
          formDataToSend.append(key, null);
        } else {
          formDataToSend.append(key, formData[key]);
        }
        console.log(key + ": " + formData[key]);
      }
      await apiService.patch(
        `/api/products/${product.productID}`,
        formDataToSend,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // toast.success("Cập nhật sản phẩm thành công!", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   toastId: "updateProduct", // Unique ID to avoid duplicate toasts
      // });
      onClose();
      window.alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.log("Error updating product:" + error.message);
      window.alert(error.message);
    }
  };

  const handleConfirmOpen = (type) => {
    setConfirmType(type);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirmed) => {
    setConfirmOpen(false);
    if (confirmed) {
      if (confirmType === "delete") {
        handleProductDelete();
      } else if (confirmType === "save") {
        let isError = false;
        for (const key in errors) {
          if (errors[key] !== "") isError = true;
        }
        if (isError || formData.productImage == null) {
          window.alert(
            "Vui lòng kiểm tra lại các trường nhập và nhập đúng thông tin"
          );
          return;
        } else {
          handleSubmit();
        }
      } else if (confirmType === "cancel") {
        onClose();
      }
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      handleConfirmOpen("cancel");
    } else {
      onClose();
    }
  };

  const handleProductDelete = async () => {
    try {
      await apiService.patch(
        `/api/products/${product.productID}/delete`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      onDeleteSuccess();
      onClose();
      window.alert("Sản phẩm đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      window.alert(error.message);
    }
  };

  if (!product) {
    return null; // Handle case where product is not yet loaded
  }

  return (
    <Container sx={{ mb: 3 }}>
      {product.visibilityStatus === false && (
        <Typography variant="h5" sx={{ color: "error.main", mb: 2, mt: 5 }}>
          Sản phẩm nằm trong phạm vi hết hạn sử dụng, do đó sẽ tạm ẩn khỏi danh
          sách sản phẩm giao dịch được <br />
          Vui lòng cập nhật lại thông tin hoặc thay thế sản phẩm
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Chi tiết & cập nhật sản phẩm
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={() => handleConfirmOpen("delete")}
        >
          Xóa sản phẩm
        </Button>
      </Box>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          label="ID Sản phẩm"
          name="productID"
          fullWidth
          margin="normal"
          value={formData.productID}
          disabled
        />
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
        {/* <TextField
          label="Ngày hết hạn"
          name="expiDate"
          fullWidth
          margin="normal"
          value={formData.expiDate}
          onChange={handleChange}
        /> */}
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
              <Typography>Hình ảnh sản phẩm hiện tại:</Typography>
              <img src={imagePreview} alt="Product" style={{ width: "30%" }} />
            </Box>
          )}
          <Button variant="contained" component="label">
            Tải lên hình ảnh mới
            <input
              type="file"
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={!isDirty}
            onClick={() => handleConfirmOpen("save")}
          >
            Lưu
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelClick}
          >
            Hủy
          </Button>
        </Box>
      </form>

      <Dialog open={confirmOpen} onClose={() => handleConfirmClose(false)}>
        <DialogTitle>
          {confirmType === "save"
            ? "Xác nhận lưu"
            : confirmType === "delete"
              ? "Xác nhận xóa"
              : confirmType === "cancel"
                ? "Xác nhận hủy"
                : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmType === "save"
              ? "Bạn có chắc chắn muốn lưu các thay đổi?"
              : confirmType === "delete"
                ? "Bạn có chắc chắn muốn xóa sản phẩm này?"
                : confirmType === "cancel"
                  ? "Thay đổi sẽ không được lưu, bạn có chắc chắn hủy?"
                  : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)} color="primary">
            Không
          </Button>
          <Button
            onClick={() => handleConfirmClose(true)}
            color="primary"
            autoFocus
          >
            Có
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
}

export default ProductDetails;
