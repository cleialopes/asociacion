const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const BASES_JSON = path.join(__dirname, '../data/bases_latino.json');

exports.guardarBasesLatino = (req, res) => {
  try {
    fs.writeFileSync(BASES_JSON, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo guardar bases_latino.json' });
  }
};

exports.eliminarBasesLatino = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(BASES_JSON, 'utf8'));
    const rutas = Object.values(data.latino.bases_pdf).filter(Boolean);

    rutas.forEach(ruta => eliminarArchivoSiExiste(ruta));

    const vacio = {
      latino: {
        id: "",
        titulo: { es: "", en: "", eu: "" },
        bases_pdf: { es: "", en: "", eu: "" }
      }
    };

    fs.writeFileSync(BASES_JSON, JSON.stringify(vacio, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudieron eliminar las bases ni sus archivos' });
  }
};

exports.obtenerBases = (req, res) => {
  try {
    const data = fs.readFileSync(BASES_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error al leer bases_latino.json:', err);
    res.status(500).json({ error: 'No se pudo leer el archivo' });
  }
};
