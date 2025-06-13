const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const path = require('path');


// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: '<h3>Demasiados intentos. Intenta más tarde. <a href="/login.html">Volver</a></h3>'
});

// Cambiar contraseña
router.get('/cambiar-password', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'cambiar-password.html'));
});
router.post('/cambiar-password', authController.cambiarPassword);

// Login, logout, admin y raíz
router.post('/login', loginLimiter, authController.login);
router.get('/logout', authController.logout);
router.get('/admin', authController.redireccionAdmin);
router.get('/', authController.redireccionRaiz);

module.exports = router;


