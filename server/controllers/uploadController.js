const fs = require('fs');
const path = require('path');

const subirArchivo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se subió ningún archivo' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const nombre = Date.now() + ext;

  let carpeta = '';
  if (ext === '.pdf') {
    carpeta = 'pdfs';
  } else if (ext === '.mp4') {
    carpeta = 'video';
  } else {
    carpeta = 'img';
  }

 const destinoDir = path.resolve(__dirname, '../../public', carpeta);

  if (!fs.existsSync(destinoDir)) {
    fs.mkdirSync(destinoDir, { recursive: true });
  }

  const destino = path.join(destinoDir, nombre);
  fs.renameSync(req.file.path, destino);

  const url = `/${carpeta}/${nombre}`;
  res.json({ ok: true, url });
};

module.exports = { subirArchivo };
