// src/components/AdminDashboardLayout.js
import React, { useEffect } from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, IconButton, Link, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';

const drawerWidth = 240;


const AdminDashboardLayout = ({ handleDrawerToggle, mobileOpen }) => {
  const role = localStorage.getItem('userRole');
  const [restaurantName,setRestaurantName] = React.useState('');

  const fetchLoggedUserRestaurant = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, please login first.');
    }
  
    const response = await axios.get(`http://localhost:8090/api/staff/restaurant-name`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    setRestaurantName(response.data);
  };

  useEffect(() => {
    fetchLoggedUserRestaurant();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{bgcolor:'#345C4C',color:'white'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
          {role==='ROLE_ADMIN' ? 'Admin Dashboard' : 'Staff Dashboard'}
          <br/>
            <b>{restaurantName}</b> 
          </Typography>
          <Typography sx={{display:'flex', justifyContent:'flex-end', flexGrow:1}}>
           Welcome {localStorage.getItem('username')}
          </Typography>
        </Toolbar>
      </AppBar>
      <AdminSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;
