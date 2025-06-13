const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { manejarBanner, manejarPostBanner, manejarDeleteBanner } = require('../controllers/bannerController');

const rutas = [
  'banner-index',
  'banner',
  'banner-nosotros',
  'banner-voluntaries',
  'banner-sebastiane-latino',
  'banner-encuentros'
];

rutas.forEach((ruta) => {
  router.get(`/${ruta}`, (req, res) => manejarBanner(ruta, req, res));
  router.post(`/${ruta}`, upload.single('archivo'), (req, res) => manejarPostBanner(ruta, req, res));
  router.delete(`/${ruta}`, (req, res) => manejarDeleteBanner(ruta, req, res));
});

module.exports = router;