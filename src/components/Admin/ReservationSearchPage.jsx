// src/components/ReservationSearchPage.js
import React, { useState } from 'react';
import ReservationSearch from './ReservationSearch';
import ReservationResults from './ReservationResults';

const ReservationSearchPage = () => {
    const [reservations, setReservations] = useState([]);

    const handleSearchResults = (data) => {
        setReservations(data);
    };

    return (
        <div>
            <ReservationSearch onSearchResults={handleSearchResults} />
            <ReservationResults reservations={reservations} />
        </div>
    );
};

export default ReservationSearchPage;
