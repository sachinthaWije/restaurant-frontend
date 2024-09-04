import React, { useContext, useState } from "react";
import { Box, Typography, Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/media/logo.png';
const TopBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    // Logic for login
    navigate('/customer/login');
    handleClose();
  };
  const handleRegister = () => {
    navigate('/customer/register');
    handleClose();
  };
  const handleProfile = () => {
    navigate('/customer/dashboard');
  };


  const handleLogout = () => {
    // Logic for logout
    logout();
    handleClose();
  };
  return (
    
    <Box
        sx={{
          width: "100%",
          // backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          fontSize: "0.875rem",
          position: 'absolute',
          top: 20,
          zIndex: 1,
          borderBottom:1,
          borderColor:'grey.700'
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to={"/"}>
          <img src={logo} alt="Restaurant Logo" style={{ marginBottom: '20px' }} />
          </Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
         
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {isAuthenticated ? (
              <>
                <MenuItem disabled>{userName}</MenuItem>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={handleLogin}>Login</MenuItem>
                <MenuItem onClick={handleRegister}>Register</MenuItem>
              </>
            )}
          </Menu>
        </Box>
        
      </Box>
  )
}

export default TopBar