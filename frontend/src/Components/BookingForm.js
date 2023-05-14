import React, { useState, useEffect} from 'react';
import SunImage from '../Images/sun.jpg';
import '../App.css';

function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setLoading] = useState(false); // New state variable

  const [bookingCount, setBookingCount] = useState(0); // Booking Count Variable;

  useEffect(() => {
    // Fetch the booking count for the selected class date
    const fetchBookingCount = async () => {
      try {
        const response = await fetch('https://izzy-hall-yoga.onrender.com/api/bookings/count');
        const data = await response.json();
        setBookingCount(data.count);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchBookingCount();
  }, [selectedDate]);

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
  
    // Validate form fields
    if (!name || !email || !selectedDate) {
      // Display an alert message indicating missing fields
      alert('Please fill in all required fields');
      return;
    }
  
    if (bookingCount >= 10) {
      // Display a message indicating that the class is fully booked
      return console.log(bookingCount);
    }
  
    const formData = { name, email, classTime, selectedDate };
  
    setLoading(true); // Start the loading state
  
    // Introduce a delay using setTimeout
    setTimeout(() => {
      fetch('https://izzy-hall-yoga.onrender.com/api/bookings', {
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
  
    console.log(bookingCount);
  };
  
  
  const handleAddToCalendar = () => {
    // Logic to add the booked class to the user's calendar
    // You can use a library or API for this functionality
    // For example, you can use the Google Calendar API or a third-party library like react-calendar
    console.log('Add to calendar functionality');
  };

  const getNextDayOfWeek = (date, dayOfWeek) => {
    const resultDate = new Date(date);
    const currentDayOfWeek = date.getDay();
    const daysToAdd = dayOfWeek > currentDayOfWeek ? dayOfWeek - currentDayOfWeek : 7 - currentDayOfWeek + dayOfWeek;
    resultDate.setDate(date.getDate() + daysToAdd);
    return resultDate;
  };
  
  
  const nextTuesday = getNextDayOfWeek(new Date(), 2);
  const nextWednesday = getNextDayOfWeek(new Date(), 3);
  

  return (
    <div className='form-div'>
      {bookingConfirmed ? (
        <section className='bookingConfirmedMessage fade-in'>
          <h1>Thank you!</h1>
          <p>Your booking has been confirmed.</p>
          <p>
            Your class is at {classTime} on{' '}
            {selectedDate ? new Date(selectedDate).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}!
          </p>
          <h2>Cash on arrival</h2>
          <button onClick={handleAddToCalendar}>Add to Calendar</button>
        </section>
      ) : (
        <form className={`form-container ${isLoading ? 'fade-out' : ''}`} onSubmit={handleSubmit}>
          <label htmlFor='name'>Name:</label>
          <input id='name' type='text' value={name} onChange={(event) => setName(event.target.value)} />
  
          <label htmlFor='email'>Email:</label>
          <input id='email' type='email' value={email} onChange={(event) => setEmail(event.target.value)} />
  
          <label htmlFor='selectedDate'>Select a Date:</label>
          <input
            id='selectedDate'
            type='date'
            min={nextTuesday.toISOString().slice(0, 10)}
            max={nextWednesday.toISOString().slice(0, 10)}
            value={selectedDate}
            onChange={handleDateChange}
          />
  
          <label htmlFor='classTime'>Class Time:</label>
          <input id='classTime' type='text' value={classTime} readOnly />
  
          <button type='submit' onClick={() => setLoading(true)}>
            Book Class
          </button>
        </form>
      )}
      {isLoading && (
        <div className='loading-overlay active'>
          <div className='loading-spinner'>
            <img src={SunImage} alt='Sun' className='rotate-slowly' />
          </div>
        </div>
      )}
    </div>
  );
  
}

export default BookingForm;
