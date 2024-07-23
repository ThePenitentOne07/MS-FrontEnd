import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [defaultDialogOpen, setDefaultDialogOpen] = useState(false);

    const handleDelete = () => {
        onDelete();
        setDeleteDialogOpen(false);
    };

    const handleSetDefault = () => {
        onSetDefault();
        setDefaultDialogOpen(false);
    };

    return (
        <Card sx={{ width: "100%", margin: 1 }}>
            <CardContent>
                <Typography variant="h6">
                    {address.addressAlias || "Địa chỉ"}{" "}
                    {address.default && (
                        <Typography variant="caption" color="InfoText">
                            (Địa chỉ mặc định hiện tại)
                        </Typography>
                    )}
                </Typography>
                <Typography variant="body2">{address.addressLine}</Typography>
                <Typography variant="body2">{address.district}</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button onClick={onEdit} variant="contained" color="info">
                        Sửa địa chỉ
                    </Button>
                    <Button
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="contained"
                        color="error"
                    >
                        Xóa địa chỉ
                    </Button>
                    {!address.default && (
                        <Button
                            onClick={() => setDefaultDialogOpen(true)}
                            variant="contained"
                            color="info"
                        >
                            Đặt làm mặc định
                        </Button>
                    )}
                </Box>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa địa chỉ này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Set Default Confirmation Dialog */}
            <Dialog
                open={defaultDialogOpen}
                onClose={() => setDefaultDialogOpen(false)}
            >
                <DialogTitle>Xác nhận đặt làm mặc định</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDefaultDialogOpen(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleSetDefault} color="primary">
                        Đặt làm mặc định
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default AddressCard;
