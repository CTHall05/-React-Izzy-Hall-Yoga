import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classType, setClassType] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = { name, email, classType, dateTime };

    axios.post('/api/bookings', formData)
      .then(() => {
        setBookingConfirmed(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='form-div'>
      {bookingConfirmed ? (
        <p>Your booking has been confirmed. Thank you!</p>
      ) : (
        <form className="form-container " onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="classType">Class Type:</label>
          <input
            id="classType"
            type="text"
            value={classType}
            onChange={(event) => setClassType(event.target.value)}
          />

          <label htmlFor="dateTime">Date and Time:</label>
          <input
            id="dateTime"
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
          />

          <button type="submit">Book Class</button>
        </form>
      )}
    </div>
  );
}

export default BookingForm;
