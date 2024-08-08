// src/components/ProfileDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8090/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Details
      </Typography>
      <Typography variant="body1">Name: {profile.username}</Typography>
      <Typography variant="body1">Email: {profile.contactInfo.email}</Typography>
      <Typography variant="body1">Email: {profile.contactInfo.phone}</Typography>
      {/* Add more profile details as needed */}
    </Box>
  );
};

export default ProfileDetails;
