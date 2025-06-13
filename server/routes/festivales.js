const express = require('express');
const router = express.Router();
const festivalesController = require('../controllers/festivalesController');

router.get('/', festivalesController.obtenerFestivales);
router.post('/', festivalesController.crearFestival);
router.delete('/:id', festivalesController.eliminarFestival);

module.exports = router;
