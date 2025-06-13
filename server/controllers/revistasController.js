const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const REVISTAS_JSON = path.join(__dirname, '../data/revista.json');

function moverArchivo(archivo, destinoCarpeta) {
  const nombre = path.basename(archivo.path); 
  const destinoDir = path.resolve(__dirname, '../../public', destinoCarpeta);

  if (!fs.existsSync(destinoDir)) {
    fs.mkdirSync(destinoDir, { recursive: true });
  }

  const destino = path.join(destinoDir, nombre);
  fs.renameSync(archivo.path, destino); 
  return `/${destinoCarpeta}/${nombre}`; 
}

exports.obtenerRevistas = (req, res) => {
  try {
    const data = fs.readFileSync(REVISTAS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json([]);
  }
};

exports.crearRevista = (req, res) => {
  const { titulo_es, titulo_en, titulo_eu } = req.body;
  const archivos = req.files || {};

  const nueva = {
    id: Date.now().toString(),
    titulo: {
      es: titulo_es || "",
      en: titulo_en || "",
      eu: titulo_eu || ""
    },
    portada: "",
    archivo: {
      es: "",
      en: "",
      eu: ""
    }
  };

  if (archivos.portada?.[0]) {
    nueva.portada = moverArchivo(archivos.portada[0], 'img');
  }

  for (const lang of ['es', 'en', 'eu']) {
    if (archivos[`archivo_${lang}`]?.[0]) {
      nueva.archivo[lang] = moverArchivo(archivos[`archivo_${lang}`][0], 'pdfs');
    }
  }

  let revistas = [];
  try {
    revistas = JSON.parse(fs.readFileSync(REVISTAS_JSON, 'utf-8'));
  } catch {}

  revistas.unshift(nueva);
  fs.writeFileSync(REVISTAS_JSON, JSON.stringify(revistas, null, 2));
  res.json({ ok: true });
};

exports.eliminarRevista = (req, res) => {
  const id = req.params.id;
  let revistas = [];

  try {
    revistas = JSON.parse(fs.readFileSync(REVISTAS_JSON, 'utf-8'));
  } catch {
    return res.status(500).json({ error: 'Error leyendo revista.json' });
  }

  const index = revistas.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Revista no encontrada' });
  }

  const revista = revistas[index];
  if (revista.portada) eliminarArchivoSiExiste(revista.portada);

  for (const lang of ['es', 'en', 'eu']) {
    if (revista.archivo?.[lang]) eliminarArchivoSiExiste(revista.archivo[lang]);
  }

  revistas.splice(index, 1);
  fs.writeFileSync(REVISTAS_JSON, JSON.stringify(revistas, null, 2));
  res.json({ ok: true });
};

