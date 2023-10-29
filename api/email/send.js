const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

app.post('/sendemail', async (req, res) => {
  const { content, title, destination } = req.body;

  try {
    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Configure the email options
    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: destination,
      subject: title,
      text: content
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});