import React, { useContext, useState } from "react";
import { Box, Typography, Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import Topbar from "./TopBar";

const HeroSection = () => {
  

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage:
          "url(https://mediacity.co.in/delici/static/media/slider-1.427b3237a3c8fa6857c0.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        position: "relative",
      }}
    >
      
      <Topbar/>

      <Box sx={{ position: 'relative', zIndex: 0, mt: '60px' }}>
        <Typography variant="subtitle1" sx={{ letterSpacing: '2px', mb: 2 }}>
          DELIGHTFUL EXPERIENCE
        </Typography>
        <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Flavors Inspired by the Seasons
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Come with family & feel the joy of mouthwatering food
        </Typography>
        
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            borderColor: '#C89B7B',
            color: '#C89B7B',
            '&:hover': {
              backgroundColor: '#C89B7B',
              color: '#fff',
            },
            padding: '10px 20px',
          }}
        >
          Book a Table
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
