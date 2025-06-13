// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // Usa tu configuración personalizada
const { subirArchivo } = require('../controllers/uploadController');

// Ruta para subir archivo (campo: "archivo")
router.post('/upload', upload.single('imagen'), subirArchivo);

module.exports = router;
