// controllers/sebastianeLatinoController.js
const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const JSON_PATH = path.join(__dirname, '../data/sebastiane_latino.json');

function leerJSON() {
  try {
    return JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function guardarJSON(data) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
}

function obtenerTodo(req, res) {
  try {
    const data = leerJSON();
    res.json(data);
  } catch (e) {
    res.status(500).json({});
  }
}

function obtenerSeccion(req, res) {
  const { anio, seccion } = req.params;
  try {
    const data = leerJSON();
    const lista = data[anio]?.[seccion] || [];
    res.json(lista);
  } catch (e) {
    res.status(500).json([]);
  }
}

function agregarEntrada(req, res) {
  const { anio, seccion } = req.params;
  const { titulo, director, pais, descripcion, video, año, imagen } = req.body;

  const id = `latino-${Date.now()}`;
  const pelicula = {
    id,
    titulo,
    director,
    pais,
    descripcion,
    año: año || `${anio} | ?`,
    imagen: imagen || "",
    video: video || ""
  };

  const data = leerJSON();
  if (!data[anio]) data[anio] = {};
  if (!data[anio][seccion]) data[anio][seccion] = [];

  data[anio][seccion].push(pelicula);
  guardarJSON(data);

  res.json({ ok: true });
}

function eliminarEntrada(req, res) {
  const { anio, seccion, index } = req.params;
  const idx = parseInt(index);
  const data = leerJSON();

  if (!data[anio] || !data[anio][seccion]) {
    return res.status(404).json({ error: 'Sección o año no encontrados' });
  }

  const item = data[anio][seccion][idx];
  if (!item) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  if (item.imagen) eliminarArchivoSiExiste(item.imagen);

  data[anio][seccion].splice(idx, 1);
  guardarJSON(data);

  res.json({ ok: true });
}

module.exports = {
  obtenerTodo,
  obtenerSeccion,
  agregarEntrada,
  eliminarEntrada,
};
