const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server started on port 3000')
});

app.use(express.json());

app.post('/api/bookings', (req, res) => {
  // extract form data from the request body
  const { name, email, classType, dateTime } = req.body;

  // do something with the form data (e.g. save to a database)

  // send confirmation email to the user
  const userMailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Booking confirmation',
    text: `Dear ${name},\n\nThank you for booking ${classType} on ${dateTime}. We look forward to seeing you soon.\n\nBest regards,\nYour Yoga Studio`
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Confirmation email sent to ${email}: ${info.response}`);
    }
  });

  // send notification email to the business owner
  const ownerMailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com',
    subject: 'New booking',
    text: `${name} has booked ${classType} on ${dateTime}.`
  };

  transporter.sendMail(ownerMailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Notification email sent to business owner: ${info.response}`);
    }
  });

  // send response to the client
  res.status(200).send('Booking confirmed');
});
