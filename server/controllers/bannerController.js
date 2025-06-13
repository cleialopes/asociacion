const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste, moverArchivoTempAPublico } = require('../utils/fileUtils');

function getRutaJson(nombre) {
  return path.join(__dirname, '..', 'data', `${nombre}.json`);
}

function manejarBanner(nombre, req, res) {
  try {
    const data = fs.readFileSync(getRutaJson(nombre), 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.json(nombre === 'banner-nosotros'
      ? { mostrar: false, tipo: "", url: "" }
      : { tipo: "", url: "" });
  }
}

function manejarPostBanner(nombre, req, res) {
  const mostrar = req.body.mostrar === 'true' || req.body.mostrar === true;
  const tipo = req.body.tipo;
  let url = req.body.url || "";

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const carpeta = ext === '.mp4' ? 'video' : 'img';
    url = moverArchivoTempAPublico(req.file, carpeta);
  }

  const banner = { tipo, url };
  if (nombre === 'banner-nosotros') banner.mostrar = mostrar;

  fs.writeFileSync(getRutaJson(nombre), JSON.stringify(banner, null, 2));
  res.json({ ok: true });
}

function manejarDeleteBanner(nombre, req, res) {
  try {
    const rutaJson = getRutaJson(nombre);
    const data = JSON.parse(fs.readFileSync(rutaJson, 'utf-8'));
    if (data.url) eliminarArchivoSiExiste(data.url);

    const vacio = nombre === 'banner-nosotros'
      ? { mostrar: false, tipo: "", url: "" }
      : { tipo: "", url: "" };

    fs.writeFileSync(rutaJson, JSON.stringify(vacio, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error(`Error eliminando ${nombre}:`, err);
    res.status(500).json({ error: `No se pudo eliminar el banner de ${nombre}` });
  }
}


module.exports = { manejarBanner, manejarPostBanner, manejarDeleteBanner };