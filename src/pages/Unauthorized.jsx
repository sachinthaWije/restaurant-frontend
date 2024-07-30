import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Unauthorized = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized
        </Typography>
        <Typography variant="body1">
          You do not have permission to access this page.
        </Typography>
      </Box>
    </Container>
  );
};

export default Unauthorized;
