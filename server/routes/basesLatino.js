const express = require('express');
const router = express.Router();
const basesLatinoController = require('../controllers/basesLatinoController');

router.get('/', basesLatinoController.obtenerBases);
router.post('/', basesLatinoController.guardarBasesLatino);
router.delete('/', basesLatinoController.eliminarBasesLatino);

module.exports = router;