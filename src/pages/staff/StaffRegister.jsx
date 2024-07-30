import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import AuthService from '../../services/auth.service';

const StaffRegister = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      restaurantId: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      restaurantId: Yup.string().required('Restaurant ID is required')
    }),
    onSubmit: (values) => {
      AuthService.register(values.username, values.email, values.password, 'Staff', values.restaurantId)
        .then(response => {
          // redirect to staff login
          window.location.href = '/staff/login';
        })
        .catch(error => {
          console.error(error);
        });
    }
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Register
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
            label="Restaurant ID"
            name="restaurantId"
            margin="normal"
            value={formik.values.restaurantId}
            onChange={formik.handleChange}
            error={formik.touched.restaurantId && Boolean(formik.errors.restaurantId)}
            helperText={formik.touched.restaurantId && formik.errors.restaurantId}
          />
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default StaffRegister;
