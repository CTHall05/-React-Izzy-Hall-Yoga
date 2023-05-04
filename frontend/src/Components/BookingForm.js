import React, { useState } from 'react';
import '../App.css';

function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    if (new Date(event.target.value).getDay() === 2) {
      setClassTime('18:00pm');
    } else if (new Date(event.target.value).getDay() === 3) {
      setClassTime('10:00am');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = { name, email, classTime, selectedDate };

    fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(() => {
        setBookingConfirmed(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const nextTuesday = new Date();
  nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7));
  const nextWednesday = new Date();
  nextWednesday.setDate(nextWednesday.getDate() + ((3 + 7 - nextWednesday.getDay()) % 7));

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

          <label htmlFor="selectedDate">Select a Date:</label>
          <input
            id="selectedDate"
            type="date"
            min={nextTuesday.toISOString().slice(0, 10)}
            max={nextWednesday.toISOString().slice(0, 10)}
            value={selectedDate}
            onChange={handleDateChange}
          />

          <label htmlFor="classTime">Class Time:</label>
          <input
            id="classTime"
            type="text"
            value={classTime}
            readOnly
          />

          <button type="submit">Book Class</button>
        </form>
      )}
    </div>
  );
}

export default BookingForm;
