import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const SearchMenus = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [menus, setMenus] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(3);
  const [totalMenus, setTotalMenus] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchParams, setSearchParams] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    categoryName: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8090/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchMenus = async (page = 0) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/api/search/menus",
        null,
        {
          params: {
            ...searchParams,
            page,
            size: 3,
          },
        }
      );
      setMenus(response.data.content);
      setTotalMenus(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setSnackbar({
        open: true,
        message: "Error fetching menus!",
        severity: "error",
      });
    }
  };

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8090/api/staff/offer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setSnackbar({
        open: true,
        message: "Error fetching offers!",
        severity: "error",
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearchClick = () => {
    fetchMenus();
  };

  const handleAddOfferClick = (menuId) => {
    setSelectedMenuId(menuId);
    fetchOffers(); // Load offers when dialog is opened
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedOfferId("");
  };

  const handleOfferSelect = (e) => {
    setSelectedOfferId(e.target.value);
  };

  const handleAddOffer = async () => {
    if (!selectedMenuId || !selectedOfferId) {
      setSnackbar({
        open: true,
        message: "Please select an offer!",
        severity: "warning",
      });
      return;
    }

    try {
      console.log("selectedMenuId", selectedMenuId);
      console.log("selectedOfferId", selectedOfferId);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8090/api/staff/${selectedMenuId}/offer/${selectedOfferId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Offer added to menu successfully!",
        severity: "success",
      });
      handleDialogClose();
    } catch (error) {
      console.error("Error adding offer to menu:", error);
      setSnackbar({
        open: true,
        message: "Error adding offer to menu!",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchMenus(); // Fetch menus when page changes
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
    fetchMenus(); // Fetch menus when rows per page change
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Category</InputLabel>
            <Select
              name="categoryName"
              value={searchParams.categoryName}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.categoryId}
                  value={category.categoryName}
                >
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSearchClick}
            sx={{
              ml: "auto",
              display: "block",
              bgcolor: "#444",
              color: "#fff",
            }}
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.map((menu) => (
                <TableRow key={menu.menuId}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{menu.description}</TableCell>
                  <TableCell>{menu.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleAddOfferClick(menu.menuId)}
                      sx={{ bgcolor: "#0066cc", color: "#fff" }}
                    >
                      Add Offer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12}>
          <TablePagination
            component="div"
            count={totalMenus}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={size}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Offer</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Offer</InputLabel>
            <Select value={selectedOfferId} onChange={handleOfferSelect}>
              {offers.map((offer) => (
                <MenuItem key={offer.offerId} value={offer.offerId}>
                  {offer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOffer} color="primary" variant="contained">
            Add Offer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchMenus;
