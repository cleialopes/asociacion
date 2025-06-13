const express = require('express');
const router = express.Router();
const {
  agregarEntrada,
  obtenerSeccion,
  eliminarEntrada,
  obtenerTodo
} = require('../controllers/sebastianeController');

router.post('/sebastiane/:anio/:seccion', agregarEntrada);
router.get('/sebastiane/:anio/:seccion', obtenerSeccion);
router.delete('/sebastiane/:anio/:seccion/:index', eliminarEntrada);
router.get('/sebastiane', obtenerTodo);

module.exports = router;