const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/documentosController');

router.get('/', documentosController.obtenerDocumentos);
router.post('/', documentosController.crearDocumento);
router.delete('/:id', documentosController.eliminarDocumento);

module.exports = router;
