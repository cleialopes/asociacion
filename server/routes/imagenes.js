const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  subirImagen,
  obtenerImagenes,
  eliminarImagen
} = require('../controllers/imagenesController');

router.get('/imagenes', obtenerImagenes);
router.post('/imagenes', upload.single('imagen'), subirImagen);
router.delete('/imagenes/:index', eliminarImagen);

module.exports = router;