// src/components/DashboardLayout.js
import React from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import CustomerSideBar from './CustomerSideBar';
import TopBar from './TopBar';

const drawerWidth = 240;

const DashboardLayout = ({ handleDrawerToggle, mobileOpen }) => {
  return (
    <Box sx={{ display: 'flex'}}>
      
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
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
            Customer Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <CustomerSideBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
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

export default DashboardLayout;
