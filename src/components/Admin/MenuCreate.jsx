import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import SearchMenus from "./SearchMenus";

const MenuCreate = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [menuDetails, setMenuDetails] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMenuDetails({
      name: "",
      description: "",
      price: "",
    });
    setSelectedCategoryId("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!selectedCategoryId) {
      alert("Please select a category");
      return;
    }

    const requestData = {
      name: menuDetails.name,
      description: menuDetails.description,
      price: parseFloat(menuDetails.price),
    };

    try {
      const response = await axios.post(
        `http://localhost:8090/api/staff/menus?categoryId=${selectedCategoryId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Menu item created:", response.data);
      setSnackbar({
        open: true,
        message: "Menu saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
      setSnackbar({
        open: true,
        message: "Error creating menu item!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Category</InputLabel>
            <Select value={selectedCategoryId} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Menu Name"
            type="text"
            fullWidth
            value={menuDetails.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={menuDetails.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={menuDetails.price}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Create
          </Button>
        </Grid>
      </Grid>
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

      <SearchMenus/>
    </Box>
  );
};

export default MenuCreate;
