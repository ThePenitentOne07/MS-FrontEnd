import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
  Container,
} from "@mui/material";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, Controller } from "react-hook-form";
import FTextField from "./form/FTextField";
import * as yup from "yup";
import { Schema } from "../components/validation/validationSchema";
import apiService from "../app/apiService"; // Import the apiService
import { Password } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto", // Ensure scrolling if content overflows
  maxHeight: "80vh", // Limit the maximum height of the modal
};

const ProfilePicture = styled(Avatar)`
  width: 150px;
  height: 150px;
  background-color: grey;
  margin-bottom: 16px;
`;

const StaffDetailModal = ({ open, handleClose, staff }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    roleName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    username: "",
  });
  const [initialData, setInitialData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const methods = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
    defaultValues: staff || {},
  });

  const { reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (staff) {
      reset(staff);
    }
  }, [staff, reset]);

  useEffect(() => {
    if (staff) {
      const initialValues = {
        userId: staff.userId,
        roleName: staff.roleName,
        emailAddress: staff.emailAddress,
        phoneNumber: staff.phoneNumber,
        password: staff.password,
        username: staff.username,
      };
      setFormData(initialValues);
      setInitialData(initialValues);
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      setIsDirty(JSON.stringify(updatedData) !== JSON.stringify(initialData));
      return updatedData;
    });
  };

  const handleCancelClick = () => {
    if (isDirty) {
      handleConfirmOpen("cancel");
    } else {
      handleClose();
    }
  };

  const onSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiService.put(
        `/users/staffs/${staff.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update successful:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error updating staff:", error);
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
        handleStaffDelete();
      } else if (confirmType === "save") {
        onSubmit();
      } else if (confirmType === "cancel") {
        handleClose();
      }
    }
  };

  const handleStaffDelete = async () => {
    try {
      await apiService.delete(`/users/staffs/${staff.userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      handleClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleModalClose = (event, reason) => {
    if (reason !== "backdropClick") {
      reset(staff || {}); // Reset form with staff details when modal closes
      handleClose();
    }
  };

  if (!staff) return null;

  return (
    <Container sx={{ mb: 3 }}>
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{staff.username}</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleConfirmOpen("delete")}
              >
                Delete
              </Button>
            </Grid>
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid
                item
                xs={12}
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <ProfilePicture
                  src={staff.profilePicture}
                  alt={`${staff.name} profile`}
                />
                <Typography>Role: {staff.roleName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Employee details</Typography>
                <TextField
                  label="Mã người dùng"
                  name="userId"
                  fullWidth
                  margin="normal"
                  value={formData.userId}
                  disabled
                />
                <TextField
                  label="Email"
                  name="emailAddress"
                  fullWidth
                  margin="normal"
                  value={formData.emailAddress}
                  disabled
                />
                <TextField
                  label="Mật khẩu"
                  name="password"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  label="Tên"
                  name="username"
                  fullWidth
                  margin="normal"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  label="Số điện thoại"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleChange}
                  >
                    <MenuItem value="SELLER">Seller</MenuItem>
                    <MenuItem value="MANAGER">Manager</MenuItem>
                    <MenuItem value="POST_STAFF">Post Staff</MenuItem>
                    <MenuItem value="PRODUCT_STAFF">Product Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isDirty}
                  onClick={() => handleConfirmOpen("save")}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </Grid>
            </form>
          </Grid>
        </Box>
      </Modal>
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
                ? "Bạn có chắc chắn muốn xóa nhân viên này?"
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
};

export default StaffDetailModal;
