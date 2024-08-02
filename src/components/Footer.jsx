import React from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube, Room, Email, Phone } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#111',
        color: '#fff',
        padding: '40px 20px',
        position: 'relative',
        textAlign: 'center'
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            DELICI RESTAURANT
          </Typography>
          <Typography variant="body1">
            Restaurant St, Delicious City, London 9578, UK
          </Typography>
          <Typography variant="body1">
            booking@domainname.com
          </Typography>
          <Typography variant="body1">
            +88-123-123456
          </Typography>
          <Typography variant="body1">
            Open: 09:00 am - 01:00 pm
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Get News & Offers
          </Typography>
          <Typography variant="body2" gutterBottom>
            Subscribe us & Get 25% Off.
          </Typography>
          <Box component="form">
            <TextField
              variant="outlined"
              placeholder="Your email"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" color="primary">
                      Subscribe
                    </Button>
                  </InputAdornment>
                ),
                style: { backgroundColor: '#fff' }
              }}
              sx={{ marginBottom: '20px' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box>
            <IconButton href="https://facebook.com" target="_blank" color="inherit">
              <Facebook />
            </IconButton>
            <IconButton href="https://instagram.com" target="_blank" color="inherit">
              <Instagram />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" color="inherit">
              <Twitter />
            </IconButton>
            <IconButton href="https://youtube.com" target="_blank" color="inherit">
              <YouTube />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body2">
          © 2024 All Rights Reserved | Develped By Sachi
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
