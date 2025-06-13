const express = require('express');
const router = express.Router();
const revistasController = require('../controllers/revistasController');
const upload = require('../config/multer');

router.get('/', revistasController.obtenerRevistas);

router.post(
  '/',
  upload.fields([
    { name: 'portada', maxCount: 1 },
    { name: 'archivo_es', maxCount: 1 },
    { name: 'archivo_en', maxCount: 1 },
    { name: 'archivo_eu', maxCount: 1 }
  ]),
  revistasController.crearRevista
);

router.delete('/:id', revistasController.eliminarRevista);

module.exports = router;
