// src/components/ReservationSearch.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ReservationSearch = ({ onSearchResults }) => {
  const [restaurantId, setRestaurantId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservationType, setReservationType] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsResponse] = await Promise.all([
          axios.get("http://localhost:8090/restaurant"),
        ]);
        setRestaurants(restaurantsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleSearch = () => {
    // Build the query parameters
    const params = {};
    if (restaurantId) params.restaurantId = restaurantId;
    if (startDate) params.startDate = startDate.toISOString().split("T")[0];
    if (endDate) params.endDate = endDate.toISOString().split("T")[0];
    if (reservationType) params.reservationType = reservationType;

    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8090/api/staff/reservation/search-reservations", {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        onSearchResults(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reservations!", error);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <TextField
          select
          fullWidth
          name="restaurant"
          label="Restaurant"
          margin="normal"
          onChange={(event) => setRestaurantId(event.target.value)}
        >
          {restaurants.map((restaurant) => (
            <MenuItem
              key={restaurant.restaurantId}
              value={restaurant.restaurantId}
            >
              {restaurant.name} - {restaurant.location}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6} md={6}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth 
          />}
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <FormControl fullWidth>
          <InputLabel id="reservation-type-label">Reservation Type</InputLabel>
          <Select
            labelId="reservation-type-label"
            value={reservationType}
            onChange={(e) => setReservationType(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="DINE_IN">DINE_IN</MenuItem>
            <MenuItem value="TAKEAWAY">TAKEAWAY</MenuItem>
            <MenuItem value="DELIVERY">DELIVERY</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default ReservationSearch;
