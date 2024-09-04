import React, { useState, useEffect } from 'react';
import { 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  OutlinedInput,
  Box,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const AddMenusToRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    // Fetch restaurants and menu items from your API
    // This is a placeholder, replace with actual API calls
    fetchLoggedUser();
    fetchRestaurants();
    fetchMenuItems();

  }, [restaurantId]);

  const fetchRestaurants = async () => {
    // Replace with actual API call
    const response = await fetch(`http://localhost:8090/restaurant/${restaurantId}`);
    const data = await response.json();
    console.log(data)
    setRestaurants(data);
  };

  const fetchMenuItems = async () => {
    // Replace with actual API call
    const response = await fetch('http://localhost:8090/menus');
    const data = await response.json();
    setMenuItems(data);
  };

  const handleRestaurantChange = (event) => {
    setSelectedRestaurant(event.target.value);
  };

  const handleMenuChange = (event) => {
    setSelectedMenus(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRestaurant || selectedMenus.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select a restaurant and at least one menu item!",
        severity: "error",
      });
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8090/api/staff/add-to-restaurant/${selectedRestaurant}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(selectedMenus),
      });

      if (response.ok) {
        setSnackbar({
            open: true,
            message: "Menus added successfully!",
            severity: "success",
          });
        setSelectedRestaurant('');
        setSelectedMenus([]);
      } else {
        setSnackbar({
            open: true,
            message: "Failed to add menus",
            severity: "error",
          });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  const fetchLoggedUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await axios.get(`http://localhost:8090/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRestaurantId(response.data.restaurantId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <FormControl fullWidth>
        <InputLabel>Restaurant</InputLabel>
        <Select
          value={selectedRestaurant}
          onChange={handleRestaurantChange}
          label="Restaurant"
        >
            <MenuItem key={restaurantId} value={restaurantId} selected>
              {restaurants.name} - {restaurants.location}
            </MenuItem>
          {/* {restaurants.map((restaurant) => (
            <MenuItem key={restaurant.restaurantId} value={restaurant.restaurantId}>
              {restaurant.name} - {restaurant.location}
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Menu Items</InputLabel>
        <Select
          multiple
          value={selectedMenus}
          onChange={handleMenuChange}
          input={<OutlinedInput label="Menu Items" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={menuItems.find(item => item.menuId === value)?.name} />
              ))}
            </Box>
          )}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.menuId} value={item.menuId}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleSubmit}>
        Add Menus to Restaurant
      </Button>
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

export default AddMenusToRestaurant;