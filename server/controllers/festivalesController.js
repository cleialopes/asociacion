const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const FESTIVALES_JSON = path.join(__dirname, '../data/festivales.json');

exports.crearFestival = (req, res) => {
  const nuevoFestival = req.body;
  let festivales = [];

  try {
    festivales = JSON.parse(fs.readFileSync(FESTIVALES_JSON, 'utf-8'));
  } catch {}

  festivales.push(nuevoFestival);
  fs.writeFileSync(FESTIVALES_JSON, JSON.stringify(festivales, null, 2));
  res.json({ ok: true });
};

exports.eliminarFestival = (req, res) => {
  const id = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync(FESTIVALES_JSON, 'utf8'));

  const index = data.findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Festival no encontrado' });
  }

  const item = data[index];

  if (item.imagen) {
    eliminarArchivoSiExiste(item.imagen);
  }

  data.splice(index, 1);
  fs.writeFileSync(FESTIVALES_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
};

exports.obtenerFestivales = (req, res) => {
  try {
    const data = fs.readFileSync(FESTIVALES_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error al leer festivales.json:', err);
    res.status(500).json({ error: 'No se pudo leer el archivo' });
  }
};
