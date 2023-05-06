const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // enable CORS for all routes

app.use(express.json());

app.post('/api/bookings', (req, res) => {
  const { name, email, classTime, selectedDate } = req.body;

  // Do something with the form data (e.g., save to a database)

  // Assuming you're using Nodemailer to send the confirmation email
  const nodemailer = require('nodemailer');

// Create a transporter using the SMTP configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'charlestaylorhall05@gmail.com', // Replace with your Gmail address
      pass: 'zdcqktcgxjrecjqe' // Replace with your Gmail password or app password if 2-Step Verification is enabled
    }
  });

  // // Use the transporter to send an email
  // const mailOptions = {
  //   from: 'charlestaylorhall05@gmail.com', // Replace with your Gmail address
  //   to: 'charlestaylorhall05@gmail.com',
  //   subject: 'Hello',
  //   text: 'This is a test email.'
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error('Error sending email:', error);
  //   } else {
  //     console.log('Email sent:', info.response);
  //   }
  // });



  const userMailOptions = {
    from: 'charlestaylorhall05@gmail.com',
    to: email,
    subject: 'Booking confirmation',
    text: `Dear ${name},\n\nThank you for booking at ${classTime} on ${selectedDate}. We look forward to seeing you soon.\n\nBest regards,\nYour Yoga Studio`
  };

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending confirmation email');
    } else {
      console.log('Confirmation email sent:', info.response);

      // Optionally, send notification email to the business owner
      // const ownerMailOptions = { ... };

      // res.status(200).send('Booking confirmed');
      res.json({ message: 'Booking confirmed' });
    }
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
