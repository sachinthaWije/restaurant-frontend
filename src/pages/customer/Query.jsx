import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";

const Query = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted:', { subject, message });
    setSubject('');
    setMessage('');
  };

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/restaurant/${id}`
        );
        console.log(response)
        setBranch(response.data);
       
      } catch (error) {
        console.error("Error fetching the restaurant details:", error);
      }
    };
    fetchBranchDetails();
  },[id]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${branch.photoGallery[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
        <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      />
      <TopBar/>

      <Typography variant="h2" sx={{ mb: 2, mt:10 }}>
        {branch.location} Branch
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">
          You can ask any Questions
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 , backgroundColor: "#fff", padding: 2, borderRadius: 2, width: "50%"}}>
      <Typography variant="h4" component="h1" gutterBottom sx={{color:"#333"}}>
        Add Customer Query
      </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="subject"
          label="Subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="message"
          label="Message"
          id="message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Send
        </Button>
        
      </Box>
    </Box>
  );
};

export default Query;
