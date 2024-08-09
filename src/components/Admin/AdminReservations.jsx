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
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const convertTo12HourFormat = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12; // Adjust hour to 12-hour format
  return `${adjustedHour}:${minutes}:${seconds} ${ampm}`;
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewItemsDialogOpen, setViewItemsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchReservations = async (restaurantId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found, please login first.");
    }

    const response = await axios.get(
      `http://localhost:8090/api/staff/reservation/${restaurantId}`,
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
    const getReservations = async () => {
      if (restaurantId) {
        setLoading(true);
        try {
          const data = await fetchReservations(restaurantId);
          setReservations(data);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoggedUser();
    getReservations();
  }, [restaurantId]);

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.reservationStatus); // Default to the current status
    setDialogOpen(true);
  };

  const handleOpenViewItemsDialog = (reservation) => {
    setSelectedReservation(reservation);
    setViewItemsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReservation(null);
    setNewStatus("");
  };

  const handleCloseViewItemsDialog = () => {
    setViewItemsDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleStatusChange = async () => {
    if (!selectedReservation) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please login first.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8090/api/staff/reservation/update-status/${selectedReservation.reservationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: "Reservation status updated successfully!",
        severity: "success",
      });
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservationId === selectedReservation.reservationId
            ? { ...reservation, reservationStatus: newStatus }
            : reservation
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating reservation status:", error);

      setSnackbar({
        open: true,
        message: "Failed to update reservation status.",
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
        Reservations
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Reservation Date & Time</TableCell>
              <TableCell>Reservation Type</TableCell>
              <TableCell>Table Number</TableCell>
              <TableCell>Number of People</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reservation) => (
                <TableRow key={reservation.reservationId}>
                  <TableCell>{reservation.customerName}</TableCell>
                  <TableCell>
                    {reservation.reservationDate} |{" "}
                    {convertTo12HourFormat(reservation.reservationTime)}
                  </TableCell>
                  <TableCell>{reservation.reservationType}</TableCell>
                  <TableCell>{reservation.tableName}</TableCell>
                  <TableCell>{reservation.numberOfPeople}</TableCell>
                  <TableCell>{reservation.paymentAmount}</TableCell>
                  <TableCell>{reservation.paymentType}</TableCell>
                  <TableCell>{reservation.reservationStatus}</TableCell>
                  <TableCell>
                    <Tooltip title="Update Status">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(reservation)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {reservation.orderMenuItems &&
                      reservation.orderMenuItems.length > 0 && (
                        <Tooltip title="View Items">
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              handleOpenViewItemsDialog(reservation)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Reservation Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewItemsDialogOpen} onClose={handleCloseViewItemsDialog}>
        <DialogTitle>Ordered Menu Items</DialogTitle>
        <DialogContent>
          {selectedReservation?.orderMenuItems &&
          selectedReservation.orderMenuItems.length > 0 ? (
            <ul>
              {selectedReservation.orderMenuItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <Typography>No items ordered.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewItemsDialog} color="primary">
            Close
          </Button>
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

export default AdminReservations;
