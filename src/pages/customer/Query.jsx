import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message should be at least 10 characters"),
});

const Query = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting,resetForm }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to make a reservation.");
      navigate("/customer/login"); // Redirect to login page
      setSubmitting(false);
      return;
    }
    console.log("submit////");
    console.log(values);
    try {
      const response = await axios.post(
        `http://localhost:8090/api/customer/query/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Query submitted successfully!",
        severity: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit query. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/restaurant/${id}`
        );
        console.log(response);
        setBranch(response.data);
      } catch (error) {
        console.error("Error fetching the restaurant details:", error);
      }
    };
    fetchBranchDetails();
  }, [id]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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

      <Typography variant="h2" sx={{ mb: 2, mt: 10 }}>
        {branch.location} Branch
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">You can ask any Questions</Typography>
      </Box>

      <Box
        sx={{
          mt: 1,
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 2,
          width: "50%",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#333" }}
        >
          Add Customer Query
        </Typography>

        <Formik
          initialValues={{ subject: "", message: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                id="subject"
                name="subject"
                label="Subject"
                margin="normal"
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
              />
              <Field
                as={TextField}
                fullWidth
                id="message"
                name="message"
                label="Message"
                multiline
                rows={4}
                margin="normal"
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
            </Form>
          )}
        </Formik>

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
    </Box>
  );
};

export default Query;
