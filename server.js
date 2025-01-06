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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email erfolgreich gesendet' });
  } catch (error) {
    console.error('Detaillierter Fehler:', error);
    res.status(500).json({ error: 'Email konnte nicht gesendet werden' });
  }
});

const PORT = process.env.PORT || 3001; // Ändere auf 3001
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});