// src/components/StaffForm.js
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  role: Yup.string().required('Role is required'),
  restaurant: Yup.string().required('Restaurant is required'),
});

const StaffForm = ({ restaurants, onSubmit }) => {
  return (
    <Formik
      initialValues={{ username: '', password: '', email: '', phone: '', role: 'ROLE_ADMIN', restaurant: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, please login first.');
          setSubmitting(false);
          return;
        }

        try {
          await axios.post(`http://localhost:8090/api/auth/register/staff/${values.restaurant}`, {
            username: values.username,
            password: values.password,
            role: values.role,
            email: values.email,
            phone: values.phone,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          onSubmit();
          resetForm();
        } catch (error) {
          console.error('Error registering staff member:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Typography variant="h6" gutterBottom>
            Register New Staff Member
          </Typography>
          <Field
            as={TextField}
            fullWidth
            name="username"
            label="Username"
            margin="normal"
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />
          <Field
            as={TextField}
            fullWidth
            name="password"
            label="Password"
            type="password"
            margin="normal"
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <Field
            as={TextField}
            fullWidth
            name="email"
            label="Email"
            margin="normal"
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Field
            as={TextField}
            fullWidth
            name="phone"
            label="Phone"
            margin="normal"
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
          />
          <Field
            as={TextField}
            select
            fullWidth
            name="role"
            label="Role"
            margin="normal"
            error={touched.role && Boolean(errors.role)}
            helperText={touched.role && errors.role}
          >
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE_STAFF">Staff</MenuItem>
          </Field>
          <Field
            as={TextField}
            select
            fullWidth
            name="restaurant"
            label="Restaurant"
            margin="normal"
            error={touched.restaurant && Boolean(errors.restaurant)}
            helperText={touched.restaurant && errors.restaurant}
          >
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant.restaurantId} value={restaurant.restaurantId}>
                {restaurant.name} - {restaurant.location}
              </MenuItem>
            ))}
          </Field>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StaffForm;
