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
} from "@mui/material";
import apiService from "../app/apiService";
import { LoadingButton } from "@mui/lab";

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
        formDataToSend.append(key, formData[key]);
      }
      for (const key in formData) {
        console.log(key + ': ' + formData[key]);
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
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
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
        handleSubmit();
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
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!product) {
    return null; // Handle case where product is not yet loaded
  }

  return (
    <Container sx={{ mb: 3 }}>
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
        />
        <TextField
          label="Giá thành"
          name="price"
          fullWidth
          margin="normal"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          label="Số lượng"
          name="quantity"
          fullWidth
          margin="normal"
          value={formData.quantity}
          onChange={handleChange}
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
        />
        <TextField
          label="Ngày sản xuất"
          name="manuDate"
          fullWidth
          margin="normal"
          value={formData.manuDate}
          onChange={handleChange}
        />
        <TextField
          label="Ngày hết hạn"
          name="expiDate"
          fullWidth
          margin="normal"
          value={formData.expiDate}
          onChange={handleChange}
        />
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
              <img
                src={imagePreview}
                alt="Product"
                style={{ width: "100%", maxHeight: "300px" }}
              />
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
          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            disabled={!isDirty}
            onClick={() => handleConfirmOpen("save")}
          >
            Lưu
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
    </Container>
  );
}

export default ProductDetails;
