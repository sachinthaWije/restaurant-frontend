// src/components/AdminLogin.js
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CssBaseline,
  Avatar,
  Snackbar,
} from "@mui/material";
import AuthService from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

 

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      AuthService.login(values.username, values.password)
        .then((response) => {
          // redirect to customer login
          console.log(response)
          const { jwt,name, userRole } = response;
          console.log(userRole)
          localStorage.setItem('userRole',userRole );
          localStorage.setItem('username',name );
          login(name, jwt);
          window.location.href = "/admin";
        
        })
        .catch((error) => {
          console.log(error)
          setError("Invalid Username or Passowrd");
          setSnackbar({
            open: true,
            message: "Login failed. Please check your credentials and try again.!",
            severity: "error",
          });
        });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}

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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
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
      </Box>
    </Container>
  );
};

export default AdminLogin;
