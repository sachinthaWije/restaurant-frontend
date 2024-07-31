import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import AuthService from "../../services/auth.service";

const CustomerRegister = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .required("Mobile Number is required")
        .matches(
          /^(\+\d{1,3}[- ]?)?\d{10}$/,
          "Mobile Number must be a valid phone number"
        ),
    }),
    onSubmit: (values) => {
      AuthService.register(
        values.username,
        values.email,
        values.phone,
        values.password,
        "ROLE_CUSTOMER"
      )
        .then((response) => {
          // redirect to customer login
          window.location.href = "/customer/login";
        })
        .catch((error) => {
          console.error(error);
        });
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Register
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="phone"
            type="text"
            margin="normal"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
          <Typography variant="overline" display="block" gutterBottom textAlign={'right'}>
            Already have an account?{" "}
            <Link href="/customer/login" underline="none">
              Sign In
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default CustomerRegister;
