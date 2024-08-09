import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

import { format } from "date-fns";

const formatDate = (dateString) => {
  return format(new Date(dateString), "PPpp");
};
const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewOnly, setViewOnly] = useState(false); // New state for view-only mode

  const fetchQueries = async (restaurantId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await axios.get(
      `http://localhost:8090/api/staff/queries/${restaurantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  };

  const fetchLoggedUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await axios.get(`http://localhost:8090/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRestaurantId(response.data.restaurantId);
  };

  useEffect(() => {
    const getQueries = async () => {
      if (restaurantId) {
        setLoading(true);
        try {
          const data = await fetchQueries(restaurantId);
          setQueries(data);
        } catch (error) {
          console.error("Error fetching queries:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchLoggedUser();
    getQueries();
  }, [restaurantId]);

  const handleOpenDialog = (query, viewOnly = false) => {
    setSelectedQuery(query);
    setResponseMessage(query.respondedMessage || "");
    setDialogOpen(true);
    setViewOnly(viewOnly); // Set view-only mode
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuery(null);
    setResponseMessage("");
    setViewOnly(false);
  };

  const handleRespond = async () => {
    if (!selectedQuery) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please login first.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8090/api/staff/update-query/${selectedQuery.queryId}`,
        { respondedMessage: responseMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: "Query responded successfully!",
        severity: "success",
      });
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.queryId === selectedQuery.queryId
            ? {
                ...query,
                respondedMessage: responseMessage,
                status: "Responded",
              }
            : query
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error responding to query:", error);

      setSnackbar({
        open: true,
        message: "Failed to respond to the query.",
        severity: "error",
      });
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Queries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Query Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((query) => (
                <TableRow key={query.queryId}>
                  <TableCell>{formatDate(query.createdAt)}</TableCell>
                  <TableCell>{query.customerName}</TableCell>
                  <TableCell>{query.subject}</TableCell>
                  <TableCell>{query.message}</TableCell>
                  <TableCell>
                    {query.respondedMessage ? "Responded" : "Pending"}
                  </TableCell>
                  <TableCell>
                    {query.respondedMessage ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(query, true)} // Open in view-only mode
                      >
                        View Response
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(query)}
                      >
                        Respond
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={queries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {viewOnly ? "View Response" : "Respond to Query"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Customer Query: {selectedQuery?.message}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your Response"
            fullWidth
            multiline
            minRows={3}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            disabled={viewOnly} // Disable editing in view-only mode
          />
          <DialogContentText>
            {viewOnly
              ? `Responded Date: ` + formatDate(selectedQuery?.respondedAt)
              : ""}{" "}
            <br />
            {viewOnly ? `Responded By: ` + selectedQuery?.respondedBy : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
          {!viewOnly && (
            <Button onClick={handleRespond} color="primary">
              Save Response
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminQueries;
