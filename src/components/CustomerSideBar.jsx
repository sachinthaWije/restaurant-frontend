// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const CustomerSideBar = ({ mobileOpen, handleDrawerToggle }) => {
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Reservation History', 'Profile Details','Queries'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/${text.toLowerCase().replace(' ', '-')}`}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem key="home" disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Logout" disablePadding>
          <ListItemButton component={Link} to="/logout">
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default CustomerSideBar;
