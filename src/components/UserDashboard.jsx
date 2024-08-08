// src/components/UserDashboard.js
import React from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import ReservationHistory from './ReservationHistory';
import ProfileDetails from './ProfileDetails';
import CustomerSideBar from './CustomerSideBar';

const UserDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CustomerSideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Routes>
          {/* <Route path="/" element={<QueryList />} /> */}
          <Route path="reservations" element={<ReservationHistory />} />
          <Route path="profile" element={<ProfileDetails />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserDashboard;
