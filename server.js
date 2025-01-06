require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://webappvercel-kohl.vercel.app'],
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

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

const PORT = process.env.PORT || 3001; // Ändere auf 3001
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

module.exports = app;