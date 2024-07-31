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
  reservationDate: "",
  reservationTime: "",
  reservationType: "DINE_IN",
  reservationStatus: "PENDING",
  numberOfPeople: 1,
  tableId: "",
};

const RestaurantDetails = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/restaurant/${id}`
        );
        setBranch(response.data);
      } catch (error) {
        console.error("Error fetching the restaurant details:", error);
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
    const token = localStorage.getItem('jwtToken'); // Adjust this if your token is stored elsewhere
    if (!token) {
      alert("You must be logged in to make a reservation.");
      navigate('/customer/login'); // Redirect to login page
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8090/api/customer/reservation`,
        {
          restaurantId: id,
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reservation successful!");
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Failed to make reservation.");
    }
    setSubmitting(false);
  };

  if (!branch) {
    return <Typography>Loading...</Typography>;
  }

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
      <Typography variant="h2" sx={{ marginBottom: 2 }}>
        {branch.location} Branch
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">
          Phone: {branch.contactInfo.phone}
        </Typography>
        <Typography variant="body1">
          Email: {branch.contactInfo.email}
        </Typography>
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
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Table Reservation
        </Typography>
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
                    error={touched.reservationDate && !!errors.reservationDate}
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
                    error={touched.reservationTime && !!errors.reservationTime}
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
                    error={touched.reservationType && !!errors.reservationType}
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
                    helperText={touched.numberOfPeople && errors.numberOfPeople}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    select
                    name="tableId"
                    label="Table ID"
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
      </Box>
    </Box>
  );
};

export default RestaurantDetails;
