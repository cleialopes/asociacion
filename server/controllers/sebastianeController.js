const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const SEBASTIANE_JSON = path.join(__dirname, '..', 'data', 'sebastiane.json');

function agregarEntrada(req, res) {
  const { anio, seccion } = req.params;
  const { titulo, director, pais, descripcion, video, año, imagen } = req.body;

  const id = `pelicula-${Date.now()}`;
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

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, "utf-8"));
  } catch {}

  if (!data[anio]) data[anio] = {};
  if (!data[anio][seccion]) data[anio][seccion] = [];

  data[anio][seccion].push(pelicula);

  fs.writeFileSync(SEBASTIANE_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
}

function obtenerSeccion(req, res) {
  const { anio, seccion } = req.params;
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf-8'));
    const lista = data[anio]?.[seccion] || [];
    res.json(lista);
  } catch {
    res.status(500).json([]);
  }
}

function eliminarEntrada(req, res) {
  const { anio, seccion, index } = req.params;

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf8'));
  } catch {
    return res.status(500).json({ error: 'Error leyendo el archivo' });
  }

  if (!data[anio] || !data[anio][seccion]) {
    return res.status(404).json({ error: 'Sección o año no encontrados' });
  }

  const idx = parseInt(index);
  const item = data[anio][seccion][idx];

  if (!item) return res.status(404).json({ error: 'Índice no válido' });

  if (item.imagen) eliminarArchivoSiExiste(item.imagen);

  data[anio][seccion].splice(idx, 1);
  fs.writeFileSync(SEBASTIANE_JSON, JSON.stringify(data, null, 2));

  res.json({ ok: true });
}

function obtenerTodo(req, res) {
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf-8'));
    res.json(data);
  } catch {
    res.status(500).json({});
  }
}

module.exports = { agregarEntrada, obtenerSeccion, eliminarEntrada, obtenerTodo };