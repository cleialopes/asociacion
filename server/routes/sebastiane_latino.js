// routes/sebastiane_latino.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sebastianeLatinoController');

router.get('/sebastiane_latino', controller.obtenerTodo);
router.get('/sebastiane_latino/:anio/:seccion', controller.obtenerSeccion);
router.post('/sebastiane_latino/:anio/:seccion', controller.agregarEntrada);
router.delete('/sebastiane_latino/:anio/:seccion/:index', controller.eliminarEntrada);

module.exports = router;
