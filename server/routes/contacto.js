const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'mail.premiosebastiane.com', // o el SMTP real
  port: 465, // o 587 si no usas SSL
  secure: true, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios' });
  }

  const mailOptions = {
    from: `"${nombre}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: 'Nuevo mensaje del formulario de voluntaries',
    html: `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong><br>${mensaje}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ ok: true, mensaje: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ ok: false, mensaje: 'Error al enviar el mensaje' });
  }
});

module.exports = router;
