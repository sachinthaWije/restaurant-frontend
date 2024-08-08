// src/components/QueryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';


import { format } from 'date-fns';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'PPpp');
};

const QueryList = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view your queries.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8090/api/customer/queries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQueries(response.data);
      } catch (error) {
        console.error('Error fetching the queries:', error);
      }
    };
    fetchQueries();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Queries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Query Date</TableCell>
              <TableCell>Restaurant Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Is Responded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{formatDate(query.createdAt)}</TableCell>
                <TableCell>{query.restaurantName}</TableCell>
                <TableCell>{query.subject}</TableCell>
                <TableCell>{query.message}</TableCell>
                <TableCell>{query.status}</TableCell>
                <TableCell>{query.respondedMessage ? query.respondedMessage : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QueryList;
