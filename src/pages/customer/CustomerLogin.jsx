import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";
import AuthService from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";

function CustomerLogin() {
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

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
          const { jwt, name, userRole } = response;
          console.log("name",name)
          login(name, jwt);
          window.location.href = "/";
        
        })
        .catch((error) => {
          console.log(error)
          setError("Invalid Username or Passowrd");
        });
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Login
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
          <Typography variant="overline" display="block" gutterBottom>
            Don't have an account?{" "}
            <Link href="/customer/register" underline="none">
              Sign Up
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}

export default CustomerLogin;
