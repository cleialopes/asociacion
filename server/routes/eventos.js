const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

router.get('/', eventosController.obtenerEventos);
router.post('/', eventosController.crearEvento);
router.delete('/:id', eventosController.eliminarEvento);

module.exports = router;
