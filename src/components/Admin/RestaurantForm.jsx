import React, { useState } from 'react';
import { Button, TextField, Grid, Box, IconButton, Snackbar, Alert, Divider, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import RestaurantList from './RestaurantList';

const RestaurantForm = () => {
  const [restaurant, setRestaurant] = useState({
    name: '',
    location: '',
    adminId: '',
    contactInfo: {
      phone: '',
      email: ''
    },
    facilities: [''],
    photoGallery: [], // Base64 strings
    previewPhotos: [] // URLs for preview
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prevState => ({
      ...prevState,
      contactInfo: {
        ...prevState.contactInfo,
        [name]: value
      }
    }));
  };

  const handleFacilityChange = (index, e) => {
    const newFacilities = restaurant.facilities.map((facility, i) => 
      i === index ? e.target.value : facility
    );
    setRestaurant(prevState => ({
      ...prevState,
      facilities: newFacilities
    }));
  };

  const handleAddFacility = () => {
    setRestaurant(prevState => ({
      ...prevState,
      facilities: [...prevState.facilities, '']
    }));
  };

  const handleRemoveFacility = (index) => {
    const newFacilities = restaurant.facilities.filter((_, i) => i !== index);
    setRestaurant(prevState => ({
      ...prevState,
      facilities: newFacilities
    }));
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    const newPhotoGallery = await Promise.all(files.map(file => toBase64(file)));
    const newPreviewPhotos = files.map(file => URL.createObjectURL(file));

    setRestaurant(prevState => ({
      ...prevState,
      photoGallery: [...prevState.photoGallery, ...newPhotoGallery],
      previewPhotos: [...prevState.previewPhotos, ...newPreviewPhotos]
    }));
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const requestData = {
        ...restaurant,
        previewPhotos: undefined // This will ensure previewPhotos is not included
      };
    try {
      const response = await axios.post('http://localhost:8090/api/admin/restaurant', requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Restaurant saved:', response.data);
      setSnackbar({
        open: true,
        message: "Restaurant saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setSnackbar({
        open: true,
        message: "Error saving restaurant!",
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
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Restaurant Name"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Location"
            name="location"
            value={restaurant.location}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Phone"
            name="phone"
            value={restaurant.contactInfo.phone}
            onChange={handleContactInfoChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            value={restaurant.contactInfo.email}
            onChange={handleContactInfoChange}
          />
        </Grid>
        <Grid item xs={12}>
          {restaurant.facilities.map((facility, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Facility ${index + 1}`}
                  value={facility}
                  onChange={(e) => handleFacilityChange(index, e)}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveFacility(index)}>
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            onClick={handleAddFacility}
            startIcon={<Add />}
            sx={{ mt: 2 }}
          >
            Add Facility
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{bgcolor:'#c0c0c0'}}
          >
            Upload Photos
            <input
              type="file"
              multiple
              hidden
              onChange={handlePhotoChange}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {restaurant.previewPhotos.map((photo, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={photo}
                  alt={`Preview ${index}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Save Restaurant
          </Button>
        </Grid>
      </Grid>
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
      <Divider sx={{ my: 4 }} />
      <Typography align='center' variant='h4' sx={{marginBottom: 2}}>
        All Branches
      </Typography>
      <RestaurantList/>
    </Box>
  );
};

export default RestaurantForm;
