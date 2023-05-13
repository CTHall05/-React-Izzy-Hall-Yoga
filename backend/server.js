const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors()); // enable CORS for all routes
app.use(express.json());

// Define a global variable to store the booking count
let tuesdayBookingCount = 0;
let wednesdayBookingCount = 0;

// Reset the booking counts every Wednesday
setInterval(() => {
  const currentDay = new Date().getDay();
  if (currentDay === 4) { // Thursday (0 is Sunday, 1 is Monday, etc.)
    tuesdayBookingCount = 0;
    wednesdayBookingCount = 0;
    console.log('Booking counts reset to 0');
  }
}, 24 * 60 * 60 * 1000); // Check once every 24 hours


app.post('/api/bookings', (req, res) => {
  const { name, email, classTime, selectedDate } = req.body;

  // Check if the booking count has reached the limit (10)
  if (
    (new Date(selectedDate).getDay() === 2 && tuesdayBookingCount >= 10) ||
    (new Date(selectedDate).getDay() === 3 && wednesdayBookingCount >= 10)
  ) { 
    res.status(403).json({ message: 'Class fully booked' });
    return;
  }

  // Increment the booking count for the corresponding class day
  if (new Date(selectedDate).getDay() === 2) {
    tuesdayBookingCount++;
  } else if (new Date(selectedDate).getDay() === 3) {
    wednesdayBookingCount++;
  }

  // Fetch the booking count for the selected class day
  const bookingCount = new Date(selectedDate).getDay() === 2 ? tuesdayBookingCount : wednesdayBookingCount;

  // Assuming you're using Nodemailer to send the confirmation email
  const nodemailer = require('nodemailer');

  // Create a transporter using the SMTP configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'charlestaylorhall05@gmail.com', // Replace with your Gmail address
      pass: process.env.GMAIL_PASSWORD // Replace with your Gmail password or app password if 2-Step Verification is enabled
    }
  });

  const userMailOptions = {
    from: 'charlestaylorhall05@gmail.com',
    to: email,
    subject: 'Booking confirmation',
    text: `Dear ${name},\n\nThank you for booking at ${classTime} on ${selectedDate}.\n\nBest regards,\nIzzy Hall`
  };

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending confirmation email');
    } else {
      console.log('Confirmation email sent:', info.response);

      const ownerMailOptions = {
        from: 'charlestaylorhall05@gmail.com',
        to: 'charlestaylorhall05@gmail.com', // Replace with the email of the business owner
        subject: 'New Booking',
        text: `A new booking has been made by ${name} (${email}) for ${classTime} on ${selectedDate}.\n\n${bookingCount} people have already booked onto this class.`
      };

      transporter.sendMail(ownerMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending notification email:', error);
        } else {
          console.log('Notification email sent:', info.response);
        }
      });

      res.json({ message: 'Booking confirmed' });
    }
  });
});

// Add new routes for fetching the booking counts for each class day
app.get('/api/bookings/count/tuesday', (req, res) => {
  res.json({ count: tuesdayBookingCount });
});

app.get('/api/bookings/count/wednesday', (req, res) => {
  res.json({ count: wednesdayBookingCount });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


