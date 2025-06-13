const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const ENCUENTROS_JSON = path.join(__dirname, '../data/encuentros.json');

exports.obtenerEncuentros = (req, res) => {
  try {
    const data = fs.readFileSync(ENCUENTROS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json([]);
  }
};

exports.crearEncuentro = (req, res) => {
  const encuentro = req.body;
  let encuentros = [];

  try {
    encuentros = JSON.parse(fs.readFileSync(ENCUENTROS_JSON, 'utf-8'));
  } catch {}

  encuentros.unshift(encuentro);
  fs.writeFileSync(ENCUENTROS_JSON, JSON.stringify(encuentros, null, 2));
  res.json({ ok: true });
};

exports.eliminarEncuentro = (req, res) => {
  const id = parseInt(req.params.id);
  let data = JSON.parse(fs.readFileSync(ENCUENTROS_JSON, 'utf8'));

  const index = data.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Encuentro no encontrado' });
  }

  const item = data[index];

  if (item.imagenes && Array.isArray(item.imagenes)) {
    item.imagenes.forEach(img => eliminarArchivoSiExiste(img));
  }

  data.splice(index, 1);
  fs.writeFileSync(ENCUENTROS_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
};
