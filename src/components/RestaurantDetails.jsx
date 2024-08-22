// src/components/RestaurantDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  ImageListItem,
  ImageList,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TopBar from "./TopBar";

const reservationSchema = Yup.object().shape({
  reservationDate: Yup.string().required("Required"),
  reservationTime: Yup.string().required("Required"),
  reservationType: Yup.string().required("Required"),
  numberOfPeople: Yup.number()
    .required("Required")
    .min(1, "Must be at least 1"),
  tableId: Yup.string().required("Required"),
});

const initialValues = {
  reservationDate: new Date(),
  reservationTime: new Date(),
  reservationType: "DINE_IN",
  reservationStatus: "PENDING",
  numberOfPeople: 1,
  tableId: "",
  orderMenuItems: [],
};

const paymentInitialValues = {
  reservationId: "",
  amount: 0,
  paymentDate: new Date().toISOString().slice(0, 10),
  status: "PENDING",
  paymentType: "",
};

const RestaurantDetails = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState(initialValues);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reservationId, setReservationId] = useState(null);
  const [paymentData, setPaymentData] = useState(paymentInitialValues);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/restaurant/${id}`
        );
        setBranch(response.data);
        console.log(response.data.menuIds);
        const menuDetails = await fetchMenuDetails(response.data.menuIds);
        setMenuItems(menuDetails);
      } catch (error) {
        console.error("Error fetching the restaurant details:", error);
      }
    };

    const fetchMenuDetails = async (menuIds) => {
      try {
        const menuDetailsPromises = menuIds.map((menuId) =>
          axios.get(`http://localhost:8090/menu/${menuId}`)
        );
        const menuDetailsResponses = await Promise.all(menuDetailsPromises);
        return menuDetailsResponses.map((response) => response.data);
      } catch (error) {
        console.error("Error fetching menu details:", error);
        return [];
      }
    };

    const fetchTables = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/tables/${id}`);
        setTables(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the tables:", error);
      }
    };

    fetchBranchDetails();
    fetchTables();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    values.orderMenuItems = formData.orderMenuItems;
    const token = localStorage.getItem("token");
    const restaurantId = id;

    if (!token) {
      setSnackbar({
        open: true,
        message: "You must be logged in to make a reservation",
        severity: "error",
      });
      navigate("/customer/login"); // Redirect to login page
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8090/api/customer/reservation`,
        {
          restaurantId,
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("values", values);
      console.log(response.data);
      const reservationId = response.data.reservationId; // Assume the response contains the reservation ID
      setReservationId(reservationId);
      setPaymentData({ ...paymentData, reservationId, amount: totalPrice });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      
      setSnackbar({
        open: true,
        message: "Failed to make reservation.",
        severity: "error",
      });
    }
    setSubmitting(false);
  };

  if (!branch) {
    return <Typography>Loading...</Typography>;
  }

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8090/payment", paymentData);
      console.log("Payment submitted successfully:", paymentData);
      
      setSnackbar({
        open: true,
        message: "Reservation successful!",
        severity: "success",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting payment:", error);
      
      setSnackbar({
        open: true,
        message: "Error submitting payment. Please try again.",
        severity: "error",
      });
    }
  };

  const handleMenuItemChange = (e) => {
    const { value } = e.target;
    const selectedItems = typeof value === "string" ? value.split(",") : value;
    setFormData({
      ...formData,
      orderMenuItems: selectedItems,
    });

    // Calculate total price
    const total = selectedItems.reduce((acc, itemName) => {
      const item = menuItems.find((menuItem) => menuItem.name === itemName);
      return acc + (item ? item.price : 0);
    }, 0);

    setTotalPrice(total);
  };

  const handleQuery = () => {
    window.open(`/customer/query/${id}`, "_blank", "noopener,noreferrer");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${branch.photoGallery[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        paddingTop:70
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      />
      <TopBar />
      <Typography variant="h2" sx={{ mb: 2, mt: 10 }}>
        {branch.location} Branch
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">
          Phone: {branch.contactInfo.phone}
        </Typography>
        <Typography variant="body1">
          Email: {branch.contactInfo.email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleQuery}
        >
          Ask Questions
        </Button>
      </Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Facilities
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        {branch.facilities.join(", ")}
      </Typography>

      <Box
        sx={{
          width: "80%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, color: "#333" }}>
          Table Reservation
        </Typography>
        {!reservationId ? (
          <Formik
            initialValues={initialValues}
            validationSchema={reservationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="reservationDate"
                      label="Reservation Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={
                        touched.reservationDate && !!errors.reservationDate
                      }
                      helperText={
                        touched.reservationDate && errors.reservationDate
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="reservationTime"
                      label="Reservation Time"
                      type="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={
                        touched.reservationTime && !!errors.reservationTime
                      }
                      helperText={
                        touched.reservationTime && errors.reservationTime
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      select
                      name="reservationType"
                      label="Reservation Type"
                      fullWidth
                      error={
                        touched.reservationType && !!errors.reservationType
                      }
                      helperText={
                        touched.reservationType && errors.reservationType
                      }
                    >
                      <MenuItem value="DINE_IN">Dine In</MenuItem>
                      <MenuItem value="TAKEAWAY">Takeaway</MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="numberOfPeople"
                      label="Number of People"
                      type="number"
                      fullWidth
                      error={touched.numberOfPeople && !!errors.numberOfPeople}
                      helperText={
                        touched.numberOfPeople && errors.numberOfPeople
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      select
                      name="tableId"
                      label="Table No"
                      fullWidth
                      error={touched.tableId && !!errors.tableId}
                      helperText={touched.tableId && errors.tableId}
                    >
                      {tables.map((table) => (
                        <MenuItem key={table.tableId} value={table.tableId}>
                          {table.tableNumber}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Menu Items</InputLabel>
                      <Select
                        multiple
                        name="orderMenuItems"
                        value={formData.orderMenuItems}
                        onChange={handleMenuItemChange}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {menuItems.map((item) => (
                          <MenuItem key={item.id} value={item.name}>
                            <Checkbox
                              checked={
                                formData.orderMenuItems.indexOf(item.name) > -1
                              }
                            />
                            <ListItemText
                              primary={`${item.name} - $${item.price}`}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography
                      variant="h6"
                      style={{ marginTop: "20px", color: "#333" }}
                    >
                      Total Price: ${totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Reservation"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        ) : (
          <form onSubmit={handlePaymentSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={paymentData.amount}
                  onChange={handlePaymentChange}
                  required
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Date"
                  name="paymentDate"
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Type</InputLabel>
                  <Select
                    name="paymentType"
                    value={paymentData.paymentType}
                    onChange={handlePaymentChange}
                  >
                    <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                    <MenuItem value="DEBIT_CARD">Debit Card</MenuItem>
                    <MenuItem value="PAYPAL">PayPal</MenuItem>
                    <MenuItem value="CASH">Cash</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                >
                  Submit Payment
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>

      <Box>
        <Typography variant="h5" sx={{ marginBottom: 2, color: "#333" }}>
          Photo Gallery
        </Typography>
        <ImageList sx={{ width: "100%", height: 450 }} cols={3} rowHeight={164}>
          {branch.photoGallery.map((item, index) => (
            <ImageListItem key={index}>
              <img
                src={`${item}`}
                alt={`Gallery image ${index + 1}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

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

export default RestaurantDetails;
