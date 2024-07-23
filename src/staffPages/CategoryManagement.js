// src/App.js

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import apiService from '../app/apiService';
// const initialData = [
//     { id: 1, name: 'Category 1' },
//     { id: 2, name: 'Category 2' },
//     { id: 3, name: 'Category 3' },
// ];

function CategoryManagement() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [editCategory, setEditCategory] = useState({ categoryName: '' });

    const handleClickOpen = (category) => {
        setEditCategory(category);
        setOpen(true);
    };
    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    }
    const token = localStorage.getItem("token");
    const getCategory = async () => {
        try {
            const res = await apiService.get("api/products/list-category", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            setData(res.data.result);
        } catch {

        }
    }
    useEffect(() => {


        getCategory();
    }, [])
    const handleClose = () => {
        setOpen(false);
        setOpenAdd(false)
        setEditCategory('')
        getCategory();
    };
    const handleAdd = async () => {
        const token = localStorage.getItem("token");
        try {
            await apiService.post("/api/products/category", editCategory, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            alert("Add category complete");
            handleClose();
        } catch {

        }
    }

    const handleSave = async () => {
        try {
            await apiService.patch(`/api/products/update-category/${editCategory.id}`, { categoryName: `${editCategory.categoryName}` }, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }

            })
            alert("Edit complete")
        } catch {

        }
    };

    const handleChange = (event) => {
        setEditCategory({ ...editCategory, categoryName: event.target.value });
    };
    console.log(editCategory.categoryName);
    return (
        <div>
            <Button onClick={handleClickOpenAdd} variant="contained" color="primary">Add category</Button>
            <TableContainer component={Paper} style={{ marginTop: 50, width: 1000 }}>

                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.categoryName}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleClickOpen(row)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* add  */}
            <Dialog open={openAdd} onClose={handleClose}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        variant="outlined"

                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* edit */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        variant="outlined"
                        defaultValue={editCategory.categoryName}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CategoryManagement;
