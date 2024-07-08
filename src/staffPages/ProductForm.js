import React, { useState } from "react";
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
} from "@mui/material";
import apiService from "../app/apiService";
import { LoadingButton } from "@mui/lab";

function ProductForm({ categories, onClose }) {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    productDescription: "",
    manuDate: "",
    expiDate: "",
    categoryID: "",
    productImage: null,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setIsDirty(Object.values(updatedData).some((value) => value !== ""));
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
      await apiService.post("/api/products/", formDataToSend, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
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
      <form onSubmit={(e) => e.preventDefault()}>
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
              <Typography>Hình ảnh sản phẩm:</Typography>
              <img
                src={imagePreview}
                alt="Product"
                style={{ width: "100%", maxHeight: "300px" }}
              />
            </Box>
          )}
          <Button variant="contained" component="label">
            Tải lên hình ảnh
            <input type="file" hidden onChange={handleImageChange} />
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
