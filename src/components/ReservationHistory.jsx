// src/components/ReservationHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const convertTo12HourFormat = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12; // Adjust hour to 12-hour format
  return `${adjustedHour}:${minutes}:${seconds} ${ampm}`;
};

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8090/api/customer/reservation",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reservation History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Restaurant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Table ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.restaurantName}</TableCell>
                <TableCell>
                  {reservation.reservationDate} | {convertTo12HourFormat(reservation.reservationTime)}
                </TableCell>
                <TableCell>{reservation.tableName}</TableCell>
                <TableCell>{reservation.reservationStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReservationHistory;
