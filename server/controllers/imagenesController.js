const fs = require('fs');
const path = require('path');
const { moverArchivoTempAPublico } = require('../utils/fileUtils');

const IMAGENES_JSON = path.join(__dirname, '..', 'data', 'imagenes.json');

function obtenerImagenes(req, res) {
  try {
    const data = fs.readFileSync(IMAGENES_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.json([]);
  }
}

function subirImagen(req, res) {
  const { alt, titulo_es, titulo_en, titulo_eu, link } = req.body;
  const archivo = req.file;

  if (!archivo) return res.status(400).json({ ok: false, error: "Falta archivo." });

  const src = moverArchivoTempAPublico(archivo, 'img');

  const nuevaImagen = {
    src,
    alt,
    link,
    titulo: {
      es: titulo_es || "",
      en: titulo_en || "",
      eu: titulo_eu || ""
    }
  };

  let imagenes = [];
  try {
    imagenes = JSON.parse(fs.readFileSync(IMAGENES_JSON, "utf-8"));
  } catch {}

  imagenes.push(nuevaImagen);
  fs.writeFileSync(IMAGENES_JSON, JSON.stringify(imagenes, null, 2));

  res.json({ ok: true });
}

function eliminarImagen(req, res) {
  const index = parseInt(req.params.index);
  if (isNaN(index)) return res.status(400).json({ ok: false, error: "Índice inválido" });

  let imagenes = [];
  try {
    imagenes = JSON.parse(fs.readFileSync(IMAGENES_JSON, "utf-8"));
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Error leyendo imagenes.json" });
  }

  const imagen = imagenes[index];
  if (!imagen) return res.status(404).json({ ok: false, error: "Imagen no encontrada" });

  const ruta = path.join(__dirname, '..', 'public', imagen.src.replace(/^\/+/g, ''));
  if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

  imagenes.splice(index, 1);
  fs.writeFileSync(IMAGENES_JSON, JSON.stringify(imagenes, null, 2));
  res.json({ ok: true });
}

module.exports = { obtenerImagenes, subirImagen, eliminarImagen };