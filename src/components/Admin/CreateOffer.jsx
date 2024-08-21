import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { format } from "date-fns";

const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp");
  };

const CreateOffer = () => {
  const [offer, setOffer] = useState({
    name: "",
    description: "",
    discountPercentage: "",
    startDate: dayjs(),
    endDate: dayjs(),
  });

  const [offers, setOffers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchOffers = async () => {
    const token = localStorage.getItem("token");
    try {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleDateChange = (name, newValue) => {
    setOffer({ ...offer, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8090/api/staff/offer",
        {
          ...offer,
          startDate: offer.startDate.toISOString(), // Convert to ISO string
          endDate: offer.endDate.toISOString(), // Convert to ISO string
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Offer created:", response.data);
      setSnackbar({
        open: true,
        message: "Offer saved successfully!",
        severity: "success",
      });
      fetchOffers(); // Refresh the offers list after creating a new offer
    } catch (error) {
      console.error("Error creating offer:", error);
      setSnackbar({
        open: true,
        message: "Error creating offer!",
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

  useEffect(() => {
    fetchOffers();
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Create New Offer
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Offer Name"
                name="name"
                value={offer.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={offer.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discount Percentage"
                name="discountPercentage"
                type="number"
                value={offer.discountPercentage}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker
                label="Start Date & Time"
                value={offer.startDate}
                onChange={(newValue) => handleDateChange("startDate", newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker
                label="End Date & Time"
                value={offer.endDate}
                onChange={(newValue) => handleDateChange("endDate", newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Offer
              </Button>
            </Grid>
          </Grid>
        </form>
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

        <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
          Current Offers
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Offer Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Discount Percentage</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.name}</TableCell>
                  <TableCell>{offer.description}</TableCell>
                  <TableCell>{offer.discountPercentage}%</TableCell>
                  <TableCell>{formatDate(offer.startDate)}</TableCell>
                  <TableCell>{formatDate(offer.endDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </LocalizationProvider>
  );
};

export default CreateOffer;
