const express = require('express');
const router = express.Router();
const patrocinadoresController = require('../controllers/patrocinadoresController');

router.get('/', patrocinadoresController.obtenerPatrocinadores);
router.post('/', patrocinadoresController.crearPatrocinador);
router.delete('/:tipo/:id', patrocinadoresController.eliminarPatrocinador);

module.exports = router;
