const express = require('express');
const router = express.Router();
const encuentrosController = require('../controllers/encuentrosController');

router.get('/', encuentrosController.obtenerEncuentros);
router.post('/', encuentrosController.crearEncuentro);
router.delete('/:id', encuentrosController.eliminarEncuentro);

module.exports = router;
