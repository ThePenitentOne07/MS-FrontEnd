import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import apiService from "../app/apiService";
import ProductDetails from "./ProductDetails";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filters, setFilters] = useState({
    quantity: { min: "", max: "" },
    price: { min: "", max: "" },
    categoryID: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const fetchData = async () => {
    try {
      const productsResponse = await apiService.get("/api/products", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const categoriesResponse = await apiService.get(
        "/api/products/list-category",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setProducts(productsResponse.data.result);
      setCategories(categoriesResponse.data.result);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const sortedAndFilteredProducts = React.useMemo(() => {
    return products
      .filter((product) => {
        return (
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (!filters.quantity.min ||
            product.quantity >= parseInt(filters.quantity.min)) &&
          (!filters.quantity.max ||
            product.quantity <= parseInt(filters.quantity.max)) &&
          (!filters.price.min ||
            product.price >= parseFloat(filters.price.min)) &&
          (!filters.price.max ||
            product.price <= parseFloat(filters.price.max)) &&
          (!filters.categoryID || product.categoryID === filters.categoryID)
        );
      })
      .sort((a, b) => {
        if (sortConfig.key === null) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
  }, [products, searchTerm, sortConfig, filters]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setSelectedForm("productDetails");
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
      setSelectedProduct(null);
      setSelectedForm(null); // Reset selected form on close
      fetchData();
    }
  };

  const handleDeleteSuccess = () => {
    setOpen(false);
    setSelectedProduct(null);
    fetchData();
  };

  const handleAddProductClick = () => {
    setOpen(true);
    setSelectedForm("productForm");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Container maxWidth="100%" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            mb: 4,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            color="inherit"
            noWrap
            sx={{ mb: 4 }}
          >
            Danh Sách Sản Phẩm
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProductClick}
          >
            Thêm sản phẩm
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Tìm kiếm sản phẩm
          </Typography>
          <TextField
            sx={{ flex: 2 }}
            label="Nhập từ khóa"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Số lượng (thấp nhất)"
            type="number"
            value={filters.quantity.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                quantity: { ...filters.quantity, min: e.target.value },
              })
            }
          />
          <TextField
            label="Số lượng (cao nhất)"
            type="number"
            value={filters.quantity.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                quantity: { ...filters.quantity, max: e.target.value },
              })
            }
          />
          <TextField
            label="Giá (thấp nhất)"
            type="number"
            value={filters.price.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                price: { ...filters.price, min: e.target.value },
              })
            }
          />
          <TextField
            label="Giá (cao nhất)"
            type="number"
            value={filters.price.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                price: { ...filters.price, max: e.target.value },
              })
            }
          />

          <Select
            sx={{ flex: 1 }}
            label="Category"
            value={filters.categoryID}
            onChange={(e) =>
              setFilters({ ...filters, categoryID: e.target.value })
            }
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>Danh mục sản phẩm</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 475 }}>
          <Table sx={{ minWidth: 1100 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  onClick={() => requestSort("productID")}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  ID{" "}
                  {sortConfig.key === "productID" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => requestSort("productName")}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Tên Sản Phẩm{" "}
                  {sortConfig.key === "productName" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => requestSort("quantity")}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Số Lượng{" "}
                  {sortConfig.key === "quantity" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => requestSort("price")}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Giá{" "}
                  {sortConfig.key === "price" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableCell>
                <TableCell
                  align="left"
                  onClick={() => requestSort("categoryID")}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Loại sản phẩm{" "}
                  {sortConfig.key === "categoryID" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredProducts.map((product) => (
                <TableRow
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  key={product.productID}
                  onClick={() => handleRowClick(product)}
                >
                  <TableCell align="left">{product.productID}</TableCell>
                  <TableCell align="left">{product.productName}</TableCell>
                  <TableCell align="left">{product.quantity}</TableCell>
                  <TableCell align="left">{product.price}</TableCell>
                  <TableCell align="left">
                    {getCategoryName(product.categoryID)}
                  </TableCell>
                </TableRow>
              ))}
              {sortedAndFilteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {selectedForm === "productDetails" && (
          <ProductDetails
            product={selectedProduct}
            onClose={handleClose}
            onDeleteSuccess={handleDeleteSuccess}
            categories={categories}
          />
        )}
        {selectedForm === "productForm" && (
          <ProductForm onClose={handleClose} categories={categories} />
        )}
      </Dialog>
    </Box>
  );
}
