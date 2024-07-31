import { Box, Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const OurBranches = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const resp = await axios.get("http://localhost:8090/restaurant");
        console.log(resp.data);
        setBranches(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        py: 8,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Our Branches
      </Typography>
      <Typography variant="body1" sx={{ mb: 8, mx: "auto", maxWidth: "600px" }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry lorem Ipsum has been the industry's standard dummy text ever.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {branches.map((branch) => (
        <Grid item xs={12} sm={6} md={4} key={branch.restaurantId}>
          <Card>
            <CardActionArea onClick={() => handleBranchClick(branch.restaurantId)}>
              <CardContent>
              <img
                src={branch.photoGallery[0]}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {branch.location}
                </Typography>
                <Typography variant="body2">
                  {branch.contactInfo.phone}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      </Grid>
    </Box>
  );
};

export default OurBranches;
