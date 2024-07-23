import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import apiService from "../app/apiService";
import AddressCard from "../components/AddressCard";
import UserInfoCard from "../components/UserInfoCard";

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const [currentAddress, setCurrentAddress] = useState({
        userId: `${userId}`
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await apiService.get(`/api/address/all`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            setAddresses(response.data.result);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const handleOpenDialog = (address = null) => {
        setCurrentAddress(address || {});
        setIsEditMode(!!address);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setCurrentAddress({});
            setIsDialogOpen(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddress({ ...currentAddress, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (isEditMode) {
                await apiService.put(
                    `/api/address/${currentAddress.id}`,
                    currentAddress,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                window.alert("Sửa địa chỉ thành công!");
            } else {
                await apiService.post("/api/address", currentAddress, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                window.alert("Tạo địa chỉ thành công!");
            }
            fetchAddresses();
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiService.delete(`/api/address/${id}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            window.alert("Xóa địa chỉ thành công!");
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await apiService.patch(
                `/api/address/set-default/${id}`,
                { userId },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            fetchAddresses();
            window.alert("Đặt địa chỉ mặc định thành công!");
        } catch (error) {
            console.error("Error setting default address:", error);
        }
    };
    console.log(currentAddress);
    return (
        <Container>
            <Box sx={{ display: "flex", mt: 5 }}>
                <UserInfoCard />
                <Box sx={{ flex: 2 }}>
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h4">Quản lý địa chỉ</Typography>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2 }}
                        >
                            Thêm địa chỉ
                        </Button>
                        <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
                            {addresses.length !== 0 ? (
                                addresses.map((address) => (
                                    <AddressCard
                                        key={address.id}
                                        address={address}
                                        onEdit={() => handleOpenDialog(address)}
                                        onDelete={() => handleDelete(address.id)}
                                        onSetDefault={() => handleSetDefault(address.id)}
                                    />
                                ))
                            ) : (
                                <div></div>
                            )}
                        </Box>
                    </Box>

                    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>
                            {isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Đặt tên cho địa chỉ này (tùy chọn)"
                                name="addressAlias"
                                fullWidth
                                margin="normal"
                                value={currentAddress?.addressAlias || ""}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Địa chỉ"
                                name="addressLine"
                                fullWidth
                                margin="normal"
                                value={currentAddress?.addressLine || ""}
                                onChange={handleChange}
                            />
                            <TextField
                                label="Quận/Huyện"
                                name="district"
                                fullWidth
                                margin="normal"
                                value={currentAddress?.district || ""}
                                onChange={handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={handleSave} color="primary">
                                Lưu
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Container>
    );
};

export default AddressManagement;
