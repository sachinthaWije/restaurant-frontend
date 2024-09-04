import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [tableDetails, setTableDetails] = useState({
    tableNumber: "",
    capacity: "",
  });

  const [tables, setTables] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openMenus, setOpenMenus] = useState(false);
  const [menus, setMenus] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:8090/restaurant");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOpenDialog = async (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setOpenDialog(true);

    // Fetch tables for the selected restaurant
    try {
      const response = await axios.get(
        `http://localhost:8090/tables/${restaurantId}`
      );
      console.log(response.data);
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTableDetails({
      tableNumber: "",
      capacity: "",
      restaurantId: "",
    });
    setTables([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTableDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("selectedRestaurantId", selectedRestaurantId);

    if (tableDetails.capacity <= 0) {
      setSnackbar({
        open: true,
        message: "Capacity must be greater than 0!",
        severity: "error",
      });
      return;
    }

    const requestData = {
      tableNumber: tableDetails.tableNumber,
      capacity: parseInt(tableDetails.capacity, 10), // Ensure capacity is sent as an integer
      restaurantId: selectedRestaurantId, // Add the restaurantId to the request
    };

    try {
      const response = await axios.post(
        `http://localhost:8090/api/staff/table/${selectedRestaurantId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Table created:", response.data);
      setSnackbar({
        open: true,
        message: "Table created!",
        severity: "success",
      });
      const updatedTables = await axios.get(
        `http://localhost:8090/tables/${selectedRestaurantId}`
      );
      setTables(updatedTables.data);
    } catch (error) {
      console.error("Error creating table:", error);
      setSnackbar({
        open: true,
        message: "Error creating table!",
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

  const handleViewMenus = async (restaurant) => {
    try {
      const menuPromises = restaurant.menuIds.map(menuId =>
        fetch(`http://localhost:8090/menu/${menuId}`).then(res => res.json())
      );
      const menuData = await Promise.all(menuPromises);
      setMenus(menuData);
      setOpenMenus(true);
      setRestaurantName(restaurant.name+" "+ restaurant.location);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleCloseMenus = () => {
    setOpenMenus(false);
    setRestaurantName("");
  };

  return (
    <>
      <Grid container spacing={4}>
        {restaurants.map((restaurant, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={
                  restaurant.photoGallery.length > 0
                    ? restaurant.photoGallery[0]
                    : "/placeholder.png"
                }
                alt={`${restaurant.name} image`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {restaurant.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {restaurant.contactInfo.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {restaurant.contactInfo.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(restaurant.restaurantId)}
                >
                  Create Table
                </Button>
                <Button size="small" color="primary" onClick={()=>handleViewMenus(restaurant)}>
                  View Menus
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="tableNumber"
            label="Table Number"
            type="text"
            fullWidth
            value={tableDetails.tableNumber}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            value={tableDetails.capacity}
            onChange={handleChange}
          />

          <Divider sx={{ margin: "20px 0" }} />
          <Typography variant="h6" gutterBottom>
            Existing Tables
          </Typography>
          <List>
            {tables.map((table, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Table Number: ${table.tableNumber}`}
                  secondary={`Capacity: ${table.capacity}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMenus} onClose={handleCloseMenus}>
        <DialogTitle>{`Menus for ${restaurantName}`}</DialogTitle>
        <DialogContent>
          <List>
            {
            menus.map((menu, index) => (
              <ListItem key={index}>
                <ListItemText primary={menu.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenus} color="primary">
            Close
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
    </>
  );
};

export default RestaurantList;
