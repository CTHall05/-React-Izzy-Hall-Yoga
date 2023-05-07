import React, { useState } from 'react';
import SunImage from '../Images/sun.jpg';
import '../App.css';

function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setLoading] = useState(false); // New state variable

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

    setLoading(true); // Start the loading state

    // Introduce a delay using setTimeout
    setTimeout(() => {
      fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(() => {
          setLoading(false); // Stop the loading state
          setBookingConfirmed(true);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Stop the loading state
        });
    }, 2000); // Delay for 2 seconds before making the fetch request
  };
  
  const handleAddToCalendar = () => {
    // Logic to add the booked class to the user's calendar
    // You can use a library or API for this functionality
    // For example, you can use the Google Calendar API or a third-party library like react-calendar
    console.log('Add to calendar functionality');
  };

  const nextTuesday = new Date();
  nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7));
  const nextWednesday = new Date();
  nextWednesday.setDate(nextWednesday.getDate() + ((3 + 7 - nextWednesday.getDay()) % 7));

  return (
    <div className='form-div'>
      {bookingConfirmed ? (
        <section className='bookingConfirmedMessage fade-in'>
          <p>Your booking has been confirmed. Thank you!</p><br/>
          <p>Your class is at {classTime} on Teusday the {selectedDate}</p>
          <button onClick={handleAddToCalendar}>Add to Calendar</button>
        </section>
      ) : (
        <>
          <form className={`form-container ${isLoading ? 'fade-out' : ''}`} onSubmit={handleSubmit}>
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

            <button type="submit" onClick={() => setLoading(true)}>Book Class</button>
          </form>
          {isLoading && (
            <div className="loading-overlay active">
              <div className="loading-spinner">
                <img src={SunImage} alt="Sun" className="rotate-slowly" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingForm;
