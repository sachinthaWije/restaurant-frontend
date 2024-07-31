import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';

const dishes = [
  {
    title: 'Breakfast',
    description: 'View Menu',
    image: 'https://mediacity.co.in/delici/static/media/offer-image-1.c020474aea0ed9a09d2a.jpg',
  },
  {
    title: 'Appetizers',
    description: 'View Menu',
    image: 'https://mediacity.co.in/delici/static/media/offer-image-2.d655d2ba6f4b2c6f7ac9.jpg',
  },
  {
    title: 'Drinks',
    description: 'View Menu',
    image: 'https://mediacity.co.in/delici/static/media/offer-image-3.2220579532c7ff25ef9c.jpg',
  },
];

const BestDishes = () => {
  return (
    <Box sx={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', py: 8 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        We Offer Top Notch
      </Typography>
      <Typography variant="body1" sx={{ mb: 8, mx: 'auto', maxWidth: '600px' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industry's standard dummy text ever.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {dishes.map((dish, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ position: 'relative', mb: 4 }}>
              <img
                src={dish.image}
                alt={dish.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {dish.title}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#C89B7B',
                    '&:hover': { backgroundColor: '#A67653' },
                    mb: 2,
                  }}
                >
                  {dish.description}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BestDishes;
