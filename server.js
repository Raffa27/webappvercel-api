require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// CORS vor allen anderen Middleware
app.use(cors());  // Erlaubt alle Origins zunächst zum Testen

app.use(express.json());

// Test Route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log('Request body:', req.body);
    console.log('Email config:', {
      user: process.env.EMAIL_USER ? 'Vorhanden' : 'Fehlt',
      pass: process.env.EMAIL_PASS ? 'Vorhanden' : 'Fehlt'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Neue Kontaktanfrage von ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Telefon: ${phone || 'Nicht angegeben'}
        
        Nachricht:
        ${message}
      `
    };
    console.log('Mail options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent:', info);
    res.status(200).json({ message: 'Email erfolgreich gesendet' });
  } catch (error) {
    console.error('Detaillierter Fehler:', error);
    res.status(500).json({ 
      error: 'Email konnte nicht gesendet werden',
      details: error.message 
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

module.exports = app;