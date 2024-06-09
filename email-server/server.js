const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maliksaddique133@gmail.com', 
    //   pass: 'your-email-password',  
    },
  });

  const mailOptions = {
    from: email,
    to: 'maliksaddique139@gmail.com', 
    subject: 'Contact Us Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
