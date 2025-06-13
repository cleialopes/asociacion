const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const PATROCINADORES_JSON = path.join(__dirname, '../data/patrocinadores.json');

const TIPOS_VALIDOS = ['organizadores', 'patrocinios', 'colaboradores'];

exports.crearPatrocinador = (req, res) => {
  const { tipo, nuevo } = req.body;

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(PATROCINADORES_JSON, 'utf-8'));
  } catch {
    data = { organizadores: [], patrocinios: [], colaboradores: [] };
  }

  data[tipo].push(nuevo);

  try {
    fs.writeFileSync(PATROCINADORES_JSON, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Error al guardar patrocinador' });
  }
};

exports.eliminarPatrocinador = (req, res) => {
  const { tipo, id } = req.params;

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de patrocinador no válido' });
  }

  let data = JSON.parse(fs.readFileSync(PATROCINADORES_JSON, 'utf-8'));
  const index = data[tipo].findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Patrocinador no encontrado' });
  }

  const item = data[tipo][index];

  if (item.imagen) {
    eliminarArchivoSiExiste(item.imagen);
  }

  data[tipo].splice(index, 1);
  fs.writeFileSync(PATROCINADORES_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
};

exports.obtenerPatrocinadores = (req, res) => {
  try {
    const data = fs.readFileSync(PATROCINADORES_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error al leer patrocinadores.json:', error);
    res.status(500).json({ error: 'Error al leer datos' });
  }
};