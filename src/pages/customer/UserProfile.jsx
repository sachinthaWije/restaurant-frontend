import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Fetch user profile data (replace with actual API call if needed)
const fetchUserProfile = async (token) => {
  const res=await axios.get('http://localhost:8090/api/user',{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Fetch user reservations from API
const fetchUserReservations = async (token) => {
  const response = await axios.get('http://localhost:8090/api/customer/reservation', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("token ",token)
      const profileData = await fetchUserProfile(token);
      console.log(profileData)
      setProfile(profileData);

     
      const reservationsData = await fetchUserReservations(token);
      setReservations(reservationsData);
      setFilteredReservations(reservationsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter((res) => res.status === filterStatus));
    }
  }, [filterStatus, reservations]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Paper style={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="h6">Profile Details</Typography>
          <Typography>Name: {profile.username}</Typography>
          {/* <Typography>Email: {profile.contactInfo.email}</Typography>
          <Typography>Phone: {profile.contactInfo.phone}</Typography> */}
        </Paper>
        <Paper style={{ padding: '16px' }}>
          <Typography variant="h6">Table Reservation History</Typography>
          <FormControl fullWidth style={{ marginBottom: '16px' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CANCELLED">Canceled</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
          <List>
            {filteredReservations.map((res, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Restaurant Name: ${res.restaurantName}`}
                  secondary={
                    <>
                      <Typography component="span">
                        Reservation Date: {res.reservationDate} {res.reservationTime}
                      </Typography>
                      <br />
                      <Typography component="span">Table Number: {res.tableName}</Typography>
                      <br />
                      {/* <Typography component="span">Menu Items: {res.orderMenuItems.join(', ')}</Typography> */}
                      <br />
                      <Typography component="span">Payment Details: {res.paymentAmount}</Typography>
                      <br />
                      <Typography component="span">Status: {res.reservationStatus}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;
