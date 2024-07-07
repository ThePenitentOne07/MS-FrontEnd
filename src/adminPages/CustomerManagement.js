import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import StaffDetailModal from "../components/StaffDetailModal";
import apiService from "../app/apiService";
import { useNavigate } from "react-router-dom";

function CustomerManagement() {
  const [result, setCustomerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [customerToBan, setCustomerToBan] = useState(null);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [customerToUnban, setCustomerToUnban] = useState(null);

  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await apiService.get("/users/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomerList(res.data.result);
      setError("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleRowClick = async (customer) => {
    const token = localStorage.getItem("token");
    try {
      const res = await apiService.get(`/users/members/${customer.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCustomer(res.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedCustomer(null);
    getCustomerList();
  };

  const handleBanCustomer = (customer) => {
    setCustomerToBan(customer);
    setIsBanDialogOpen(true);
  };

  const handleUnbanCustomer = (customer) => {
    setCustomerToUnban(customer);
    setIsUnbanDialogOpen(true);
  };

  const confirmBanCustomer = async (customer) => {
    const token = localStorage.getItem("token");
    try {
      await apiService.put(`/users/members/ban/${customer.emailAddress}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      getCustomerList();
    } catch (error) {
      setError(error.message);
    }
    setIsBanDialogOpen(false);
    setCustomerToBan(null);
  };

  const confirmUnbanCustomer = async (customer) => {
    const token = localStorage.getItem("token");
    try {
      await apiService.put(`/users/members/unban/${customer.emailAddress}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      getCustomerList();
    } catch (error) {
      setError(error.message);
    }
    setIsUnbanDialogOpen(false);
    setCustomerToUnban(null);
  };

  const filteredCustomerList = result.filter((customer) => {
    const normalizedUsername = customer.username
      .replace(/\s+/g, "")
      .toLowerCase();
    const normalizedEmail = customer.emailAddress
      .replace(/\s+/g, "")
      .toLowerCase();
    const normalizedSearchTerm = searchTerm.replace(/\s+/g, "").toLowerCase();

    const matchesSearchTerm =
      normalizedUsername.includes(normalizedSearchTerm) ||
      normalizedEmail.includes(normalizedSearchTerm);
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Prohibited" && customer.prohibitStatus) ||
      (selectedStatus === "Active" && !customer.prohibitStatus);

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Quản lí khách hàng</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customer by username"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select
          value={selectedStatus}
          onChange={handleStatusChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Prohibited">Prohibited</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomerList.map((customer) => (
              <TableRow
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                key={customer.emailAddress}
              >
                <TableCell>{customer.username}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.emailAddress}</TableCell>
                <TableCell>
                  {customer.prohibitStatus ? "Prohibited" : "Active"}
                </TableCell>
                <TableCell>
                  {customer.prohibitStatus ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUnbanCustomer(customer)}
                    >
                      Gỡ cấm
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleBanCustomer(customer)}
                    >
                      Cấm
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <StaffDetailModal
        open={!!selectedCustomer}
        handleClose={handleCloseDetailModal}
        staff={selectedCustomer}
      /> */}
      <Dialog open={isBanDialogOpen} onClose={() => setIsBanDialogOpen(false)}>
        <DialogTitle>Confirm Ban</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to ban this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBanDialogOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => confirmBanCustomer(customerToBan)}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isUnbanDialogOpen}
        onClose={() => setIsUnbanDialogOpen(false)}
      >
        <DialogTitle>Confirm Unban</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unban this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUnbanDialogOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => confirmUnbanCustomer(customerToUnban)}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CustomerManagement;
