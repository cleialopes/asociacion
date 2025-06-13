const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const DOCUMENTOS_JSON = path.join(__dirname, '../data/documentos.json');

exports.obtenerDocumentos = (req, res) => {
  try {
    const data = fs.readFileSync(DOCUMENTOS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json([]);
  }
};

exports.crearDocumento = (req, res) => {
  const nuevo = req.body;
  let documentos = [];

  try {
    documentos = JSON.parse(fs.readFileSync(DOCUMENTOS_JSON, 'utf-8'));
  } catch {}

  documentos.unshift(nuevo);
  fs.writeFileSync(DOCUMENTOS_JSON, JSON.stringify(documentos, null, 2));
  res.json({ ok: true });
};

exports.eliminarDocumento = (req, res) => {
  const id = req.params.id;
  let documentos = [];

  try {
    documentos = JSON.parse(fs.readFileSync(DOCUMENTOS_JSON, 'utf-8'));
  } catch {
    return res.status(500).json({ error: 'Error leyendo documentos.json' });
  }

  const index = documentos.findIndex(doc => doc.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Documento no encontrado' });
  }

  const doc = documentos[index];
  for (const lang of ['es', 'en', 'eu']) {
    if (doc.archivos?.[lang]) {
      eliminarArchivoSiExiste(doc.archivos[lang]);
    }
  }

  documentos.splice(index, 1);
  fs.writeFileSync(DOCUMENTOS_JSON, JSON.stringify(documentos, null, 2));
  res.json({ ok: true });
};



