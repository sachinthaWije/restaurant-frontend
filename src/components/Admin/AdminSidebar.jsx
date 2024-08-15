// src/components/AdminSidebar.js
import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MailIcon from "@mui/icons-material/Mail";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import StorefrontIcon from '@mui/icons-material/Storefront';


const drawerWidth = 240;

const AdminSidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const role = localStorage.getItem("userRole");
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    window.location.href = "/admin/login"; // Redirect to login page
  };
  const drawer = (
    <div>
      <Toolbar />
      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }} />
      <List sx={{ color: "#c0c0c0" }}>
        {role === "ROLE_ADMIN" && (
          <>
            <ListItem key="User Management" disablePadding>
              <ListItemButton component={Link} to="/admin/user-management">
                <ListItemIcon>
                  <AccountCircleIcon sx={{ color: "#c0c0c0" }} />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Add Restaurant" disablePadding>
              <ListItemButton component={Link} to="/admin/restaurant-form">
                <ListItemIcon>
                  <StorefrontIcon sx={{ color: "#c0c0c0" }} />
                </ListItemIcon>
                <ListItemText primary="Add Restaurant" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem key="Add Menus" disablePadding>
          <ListItemButton component={Link} to="/admin/add-menu">
            <ListItemIcon>
              <BookOnlineIcon sx={{ color: "#c0c0c0" }} />
            </ListItemIcon>
            <ListItemText primary="Add Menus" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Reservations" disablePadding>
          <ListItemButton component={Link} to="/admin/reservations">
            <ListItemIcon>
              <BookOnlineIcon sx={{ color: "#c0c0c0" }} />
            </ListItemIcon>
            <ListItemText primary="Reservations" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Queries" disablePadding>
          <ListItemButton component={Link} to="/admin/queries">
            <ListItemIcon>
              <MailIcon sx={{ color: "#c0c0c0" }} />
            </ListItemIcon>
            <ListItemText primary="Queries" />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ borderColor: "#c3c3c3" }} />
        <ListItem key="Logout" disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "#c0c0c0" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        bgcolor: "#333",
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#333",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#333",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
