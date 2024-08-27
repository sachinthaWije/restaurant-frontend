// src/components/ReservationResults.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";

const ReservationResults = ({ reservations }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Reservation Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Customer",
          "Restaurant Location",
          "Reservation Date",
          "Reservation Time",
          "Type",
          "People",
          "Amount",
          "Payment Type",
        ],
      ],
      body: reservations.map((reservation) => [
        reservation.customerName,
        reservation.restaurantName,
        reservation.reservationDate,
        new Date(
          `1970-01-01T${reservation.reservationTime}`
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        reservation.reservationType,
        reservation.numberOfPeople,
        reservation.paymentAmount
          ? `$${reservation.paymentAmount.toFixed(2)}`
          : "N/A",
        reservation.paymentType ? reservation.paymentType : "N/A",
      ]),
    });
    doc.save("reservation_report.pdf");
  };

  // Calculate total amount
  const totalAmount = reservations.reduce((total, reservation) => {
    return total + (reservation.paymentAmount || 0);
  }, 0);

  return (
    <TableContainer component={Paper} style={{ marginTop: "15px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadPdf}
        style={{ margin: "10px 10px" }}
      >
        <DownloadIcon />
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Restaurant Location</TableCell>
            <TableCell>Reservation Date</TableCell>
            <TableCell>Reservation Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((reservation) => {
              const formattedTime = new Date(
                `1970-01-01T${reservation.reservationTime}`
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <TableRow key={reservation.reservationId}>
                  <TableCell>{reservation.customerName}</TableCell>
                  <TableCell>{reservation.restaurantName}</TableCell>
                  <TableCell>{reservation.reservationDate}</TableCell>
                  <TableCell>{formattedTime}</TableCell>
                  <TableCell>{reservation.reservationType}</TableCell>
                  <TableCell>{reservation.numberOfPeople}</TableCell>
                  <TableCell>
                    {reservation.paymentAmount
                      ? `$${reservation.paymentAmount.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {reservation.paymentType ? reservation.paymentType : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          <TableRow>
            <TableCell colSpan={6} align="right" style={{ fontWeight: "bold" }}>
              Total Amount:
            </TableCell>
            <TableCell colSpan={2} style={{ fontWeight: "bold" }}>
              ${totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
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
  );
};

export default ReservationResults;
