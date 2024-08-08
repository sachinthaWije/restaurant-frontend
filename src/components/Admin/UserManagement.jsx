import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import StaffForm from './StaffForm';
import axios from 'axios';

const UserManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("jwt",token)
      try {
        const [restaurantsResponse, staffResponse] = await Promise.all([
          axios.get('http://localhost:8090/restaurant'),
          axios.get('http://localhost:8090/api/admin/staff-users',{
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        console.log(staffResponse)
        setRestaurants(restaurantsResponse.data);
        setStaffMembers(staffResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStaffRegistration = () => {
    // Fetch the updated list of staff members after registration
    axios.get('http://localhost:8090/api/auth/register/staff/')
      .then(response => setStaffMembers(response.data))
      .catch(error => console.error('Error fetching staff members:', error));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <StaffForm restaurants={restaurants} onSubmit={handleStaffRegistration} />
      <Typography variant="h6" component="h2" gutterBottom>
        Existing Staff Members
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Restaurant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.contactInfo.email}</TableCell>
                <TableCell>{staff.contactInfo.phone}</TableCell>
                <TableCell>{staff.restaurantName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
