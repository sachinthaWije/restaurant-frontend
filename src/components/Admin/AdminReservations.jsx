// src/components/AdminReservations.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import axios from 'axios';

const convertTo12HourFormat = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12; // Adjust hour to 12-hour format
  return `${adjustedHour}:${minutes}:${seconds} ${ampm}`;
};



const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState('');
  
  const fetchReservations = async (restaurantId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, please login first.');
    }
  
    const response = await axios.get(`http://localhost:8090/api/staff/reservation/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };
  
  const fetchLoggedUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, please login first.');
    }
  
    const response = await axios.get(`http://localhost:8090/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response user",response)
    setRestaurantId(response.data.restaurantId);
  };

  useEffect(() => {
    const getReservations = async () => {
      if (restaurantId) {
        setLoading(true);
        try {
          const data = await fetchReservations(restaurantId);
          setReservations(data);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoggedUser();
    getReservations();
  }, [restaurantId]);

  


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reservations
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Reservation Date & Time</TableCell>
              <TableCell>Number of People</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.reservationId}>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.reservationDate} | {convertTo12HourFormat(reservation.reservationTime)}</TableCell>
                <TableCell>{reservation.numberOfPeople}</TableCell>
                <TableCell>{reservation.reservationStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminReservations;
