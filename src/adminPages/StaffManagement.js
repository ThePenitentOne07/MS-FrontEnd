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
} from "@mui/material";
import StaffDetailModal from "../components/StaffDetailModal";
import apiService from "../app/apiService";
import { useNavigate } from "react-router-dom";

function StaffManagement() {
  const [result, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getStaffList();
  }, []);

  const getStaffList = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await apiService.get("/users/staffs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffList(res.data.result);
      setError("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStaff = () => {
    navigate("/admin/newStaff");
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleRowClick = async (staff) => {
    const token = localStorage.getItem("token");
    try {
      const res = await apiService.get(`/users/staffs/${staff.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedStaff(res.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedStaff(null);
    getStaffList();
  };

  const filteredStaffList = result.filter((staff) => {
    // Remove spaces from username and searchTerm for comparison
    const normalizedUsername = staff.username.replace(/\s+/g, "").toLowerCase();
    const normalizedSearchTerm = searchTerm.replace(/\s+/g, "").toLowerCase();

    return (
      normalizedUsername.includes(normalizedSearchTerm) &&
      (selectedRole === "All" || staff.roleName === selectedRole)
    );
  });

  console.log("Selected role:", selectedRole);
  console.log("Selected role:", selectedRole);

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
        <Typography variant="h4">Quản lí nhân viên</Typography>
        <Button onClick={() => handleAddStaff()}>+ Add Staff</Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search staff by username"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="All">All Roles</MenuItem>
          <MenuItem value="SELLER">Seller</MenuItem>
          <MenuItem value="MANAGER">Manager</MenuItem>
          <MenuItem value="PRODUCT_STAFF">Product Staff</MenuItem>
          <MenuItem value="POST_STAFF">Post Staff</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffList.map((staff) => (
              <TableRow
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                key={staff.userId}
                onClick={() => handleRowClick(staff)}
              >
                <TableCell>{staff.userId}</TableCell>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.roleName}</TableCell>
                <TableCell>{staff.phoneNumber}</TableCell>
                <TableCell>{staff.emailAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StaffDetailModal
        open={!!selectedStaff}
        handleClose={handleCloseDetailModal}
        staff={selectedStaff}
      />
    </Container>
  );
}

export default StaffManagement;
