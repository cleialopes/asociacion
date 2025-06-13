const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.get('/', noticiasController.obtenerNoticias);
router.post('/', noticiasController.crearNoticia);
router.delete('/:index', noticiasController.eliminarNoticia);

module.exports = router;
