const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/noticias.json', express.static(path.join(__dirname, 'noticias.json')));
app.use('/revista.json', express.static(path.join(__dirname, 'revista.json')));
app.use('/documentos.json', express.static(path.join(__dirname, 'documentos.json')));
app.use('/encuentros.json', express.static(path.join(__dirname, 'encuentros.json')));
app.use('/festivales.json', express.static(path.join(__dirname, 'festivales.json')));
app.use('/eventos.json', express.static(path.join(__dirname, 'eventos.json')));
app.use('/patrocinadores.json', express.static(path.join(__dirname, 'patrocinadores.json')));
app.use('/bases_latino.json', express.static(path.join(__dirname, 'bases_latino.json')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'secreto-super-seguro',
  resave: false,
  saveUninitialized: true
}));

app.use('/admin', (req, res, next) => {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/login.html');
  }
});

app.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  const datos = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

  const existe = datos.find(u => u.usuario === usuario && u.password === password);
  if (existe) {
    req.session.usuario = usuario;
    res.redirect('/admin/index.html');
  } else {
    res.send('<h3>Credenciales inválidas. <a href="/login.html">Intentar de nuevo</a></h3>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

function eliminarArchivoSiExiste(rutaRelativa) {
  const ruta = path.join(__dirname, 'public', rutaRelativa.replace(/^\/+/, ''));
  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
    console.log(`Archivo eliminado: ${ruta}`);
  } else {
    console.log(`Archivo no encontrado: ${ruta}`);
  }
}

app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });

  const ext = path.extname(req.file.originalname).toLowerCase();
  const nombre = Date.now() + ext;

  let destinoDir = '';
  if (ext === '.pdf') {
    destinoDir = path.join(__dirname, 'public', 'pdfs');
  } else {
    destinoDir = path.join(__dirname, 'public', 'img');
  }

  if (!fs.existsSync(destinoDir)) fs.mkdirSync(destinoDir, { recursive: true });

  const destino = path.join(destinoDir, nombre);
  fs.renameSync(req.file.path, destino);

  const url = `/${path.relative(path.join(__dirname, 'public'), destino).replace(/\\/g, '/')}`;
  res.json({ url });
});

app.get('/api/banner', (req, res) => {
  try {
    const data = fs.readFileSync('banner.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({ mostrar: false, tipo: "", url: "" });
  }
});

app.post('/api/banner', upload.single('archivo'), (req, res) => {
  const mostrar = req.body.mostrar === 'true';
  const tipo = req.body.tipo;
  let url = req.body.url || "";

  if (req.file) {
    url = `/uploads/${req.file.filename}`;
  }

  const banner = { mostrar, tipo, url };
  fs.writeFileSync('banner.json', JSON.stringify(banner));
  res.json({ ok: true });

});

app.delete('/api/banner', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('banner.json', 'utf8'));

    if (data.url) {
      eliminarArchivoSiExiste(data.url);
    }

    const vacio = { url: "" };
    fs.writeFileSync('banner.json', JSON.stringify(vacio, null, 2));

    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando banner:", err);
    res.status(500).json({ error: 'No se pudo eliminar el banner' });
  }
});

app.get('/api/banner-nosotros', (req, res) => {
  try {
    const data = fs.readFileSync('banner_nosotros.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({ mostrar: false, tipo: "", url: "" });
  }
});

app.post('/api/banner-nosotros', (req, res) => {
  const mostrar = req.body.mostrar === true || req.body.mostrar === 'true';
  const tipo = req.body.tipo;
  const url = req.body.url || "";

  const banner = { mostrar, tipo, url };
  fs.writeFileSync('banner_nosotros.json', JSON.stringify(banner, null, 2));
  res.json({ ok: true });
});

app.delete('/api/banner-nosotros', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('banner_nosotros.json', 'utf8'));

    if (data.url) {
      eliminarArchivoSiExiste(data.url);
    }

    const vacio = { mostrar: false, tipo: "", url: "" };
    fs.writeFileSync('banner_nosotros.json', JSON.stringify(vacio, null, 2));

    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando banner nosotros:", err);
    res.status(500).json({ error: 'No se pudo eliminar el banner de nosotros' });
  }
});

app.get('/api/banner-voluntaries', (req, res) => {
  try {
    const data = fs.readFileSync('banner_voluntaries.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({ mostrar: false, tipo: "", url: "" });
  }
});

app.post('/api/banner-voluntaries', upload.single('archivo'), (req, res) => {
  const mostrar = req.body.mostrar === true || req.body.mostrar === 'true';
  const tipo = req.body.tipo;
  let url = req.body.url || "";

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const nombre = Date.now() + ext;

    let destinoDir = ext === '.mp4'
      ? path.join(__dirname, 'public', 'videos')
      : path.join(__dirname, 'public', 'img');

    if (!fs.existsSync(destinoDir)) fs.mkdirSync(destinoDir, { recursive: true });

    const destino = path.join(destinoDir, nombre);
    fs.renameSync(req.file.path, destino);

    url = `/${path.relative(path.join(__dirname, 'public'), destino).replace(/\\/g, '/')}`;
  }

  const banner = { mostrar, tipo, url };
  fs.writeFileSync('banner_voluntaries.json', JSON.stringify(banner, null, 2));
  res.json({ ok: true });
});


app.delete('/api/banner-voluntaries', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('banner_voluntaries.json', 'utf8'));

    if (data.url) {
      eliminarArchivoSiExiste(data.url);
    }

    const vacio = { mostrar: false, tipo: "", url: "" };
    fs.writeFileSync('banner_voluntaries.json', JSON.stringify(vacio, null, 2));

    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando banner voluntaries:", err);
    res.status(500).json({ error: 'No se pudo eliminar el banner de voluntaries' });
  }
});

const SEBASTIANE_JSON = 'sebastiane.json';

app.post('/api/sebastiane/:anio/:seccion', (req, res) => {
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
  } catch (e) {}

  if (!data[anio]) data[anio] = {};
  if (!data[anio][seccion]) data[anio][seccion] = [];

  data[anio][seccion].push(pelicula);

  fs.writeFileSync(SEBASTIANE_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.get('/api/sebastiane/:anio/:seccion', (req, res) => {
  const { anio, seccion } = req.params;
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf-8'));
    const lista = data[anio]?.[seccion] || [];
    res.json(lista);
  } catch (e) {
    res.status(500).json([]);
  }
});

app.delete('/api/sebastiane/:anio/:seccion/:index', (req, res) => {
  const { anio, seccion, index } = req.params;
  const data = JSON.parse(fs.readFileSync('sebastiane.json', 'utf8'));

  if (!data[anio] || !data[anio][seccion]) {
    return res.status(404).json({ error: 'Sección o año no encontrados' });
  }

  const idx = parseInt(index);
  const item = data[anio][seccion][idx];

  if (!item) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  if (item.imagen) {
    eliminarArchivoSiExiste(item.imagen);
  }

  data[anio][seccion].splice(idx, 1);

  fs.writeFileSync('sebastiane.json', JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.get('/api/sebastiane', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('sebastiane.json', 'utf-8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({});
  }
});

app.get('/api/sebastiane_latino', (req, res) => {
  try {
    const data = fs.readFileSync('sebastiane_latino.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({});
  }
});

const SEBASTIANE_LATINO_JSON = 'sebastiane_latino.json';

app.get('/api/sebastiane_latino/:anio/:seccion', (req, res) => {
  const { anio, seccion } = req.params;
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_LATINO_JSON, 'utf-8'));
    const lista = data[anio]?.[seccion] || [];
    res.json(lista);
  } catch (e) {
    res.status(500).json([]);
  }
});

app.post('/api/sebastiane_latino/:anio/:seccion', (req, res) => {
  const { anio, seccion } = req.params;
  const { titulo, director, pais, descripcion, video, año, imagen } = req.body;

  const id = `latino-${Date.now()}`;

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
    data = JSON.parse(fs.readFileSync(SEBASTIANE_LATINO_JSON, "utf-8"));
  } catch (e) {}

  if (!data[anio]) data[anio] = {};
  if (!data[anio][seccion]) data[anio][seccion] = [];

  data[anio][seccion].push(pelicula);
  fs.writeFileSync(SEBASTIANE_LATINO_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.delete('/api/sebastiane_latino/:anio/:seccion/:index', (req, res) => {
  const { anio, seccion, index } = req.params;
  const data = JSON.parse(fs.readFileSync('sebastiane_latino.json', 'utf8'));

  if (!data[anio] || !data[anio][seccion]) {
    return res.status(404).json({ error: 'Sección o año no encontrados' });
  }

  const idx = parseInt(index);
  const item = data[anio][seccion][idx];

  if (!item) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  if (item.imagen) {
    eliminarArchivoSiExiste(item.imagen);
  }

  data[anio][seccion].splice(idx, 1);

  fs.writeFileSync('sebastiane_latino.json', JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

const NOTICIAS_JSON = 'noticias.json';

app.get('/api/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(NOTICIAS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

app.post('/api/noticias', (req, res) => {
  const noticia = req.body;
  let noticias = [];

  try {
    noticias = JSON.parse(fs.readFileSync(NOTICIAS_JSON, 'utf-8'));
  } catch (e) {}

  noticias.unshift(noticia); 
  fs.writeFileSync(NOTICIAS_JSON, JSON.stringify(noticias, null, 2));
  res.json({ ok: true });
});

app.delete('/api/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = JSON.parse(fs.readFileSync('noticias.json', 'utf8'));

  if (index >= 0 && index < data.length) {
    const noticia = data[index];

    if (noticia.imagen) {
      eliminarArchivoSiExiste(noticia.imagen);
    }

    data.splice(index, 1);

    fs.writeFileSync('noticias.json', JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Índice inválido' });
  }
});

const ENCUENTROS_JSON = 'encuentros.json';

app.get('/api/encuentros', (req, res) => {
  try {
    const data = fs.readFileSync(ENCUENTROS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

app.post('/api/encuentros', (req, res) => {
  const encuentro = req.body;
  let encuentros = [];

  try {
    encuentros = JSON.parse(fs.readFileSync(ENCUENTROS_JSON, 'utf-8'));
  } catch (e) {}

  encuentros.unshift(encuentro);
  fs.writeFileSync(ENCUENTROS_JSON, JSON.stringify(encuentros, null, 2));
  res.json({ ok: true });
});

app.delete('/api/encuentros/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = JSON.parse(fs.readFileSync('encuentros.json', 'utf8'));

  if (index >= 0 && index < data.length) {
    const item = data[index];

    if (item.imagen) {
      eliminarArchivoSiExiste(item.imagen);
    }

    data.splice(index, 1);
    fs.writeFileSync('encuentros.json', JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Índice no válido' });
  }
});


const FESTIVALES_JSON = 'festivales.json';

app.post('/api/festivales', (req, res) => {
  const nuevoFestival = req.body;
  let festivales = [];

  try {
    festivales = JSON.parse(fs.readFileSync(FESTIVALES_JSON, 'utf-8'));
  } catch (e) {}

  festivales.push(nuevoFestival);
  fs.writeFileSync(FESTIVALES_JSON, JSON.stringify(festivales, null, 2));
  res.json({ ok: true });
});

app.delete('/api/festivales/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = JSON.parse(fs.readFileSync('festivales.json', 'utf8'));

  if (index >= 0 && index < data.length) {
    const item = data[index];

    if (item.imagen) {
      eliminarArchivoSiExiste(item.imagen);
    }

    data.splice(index, 1);
    fs.writeFileSync('festivales.json', JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Índice no válido' });
  }
});

const EVENTOS_JSON = 'eventos.json';

app.get('/api/eventos', (req, res) => {
  try {
    const data = fs.readFileSync(EVENTOS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

app.post('/api/eventos', (req, res) => {
  const evento = req.body;
  let eventos = [];

  try {
    eventos = JSON.parse(fs.readFileSync(EVENTOS_JSON, 'utf-8'));
  } catch (e) {}

  eventos.push(evento);
  fs.writeFileSync(EVENTOS_JSON, JSON.stringify(eventos, null, 2));
  res.json({ ok: true });
});

app.delete('/api/eventos/:index', (req, res) => {
  const index = parseInt(req.params.index);
  try {
    let eventos = JSON.parse(fs.readFileSync(EVENTOS_JSON, 'utf-8'));
    if (index >= 0 && index < eventos.length) {
      eventos.splice(index, 1);
      fs.writeFileSync(EVENTOS_JSON, JSON.stringify(eventos, null, 2));
      res.json({ ok: true });
    } else {
      res.status(400).json({ error: 'Índice inválido' });
    }
  } catch (e) {
    res.status(500).json({ error: 'No se pudo eliminar el evento' });
  }
});

const PATROCINADORES_JSON = 'patrocinadores.json';

app.post('/api/patrocinadores', (req, res) => {
  const { tipo, nuevo } = req.body;

  if (!['organizadores', 'patrocinios', 'colaboradores'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(PATROCINADORES_JSON, 'utf-8'));
  } catch (e) {
    data = { organizadores: [], patrocinios: [], colaboradores: [] };
  }

  data[tipo].push(nuevo);

  try {
    fs.writeFileSync(PATROCINADORES_JSON, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al guardar patrocinador' });
  }
});

app.delete('/api/patrocinadores/:tipo/:index', (req, res) => {
  const { tipo, index } = req.params;
  const data = JSON.parse(fs.readFileSync('patrocinadores.json', 'utf8'));

  if (!data[tipo]) {
    return res.status(404).json({ error: 'Tipo de patrocinador no válido' });
  }

  const idx = parseInt(index);
  const item = data[tipo][idx];

  if (!item) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  if (item.imagen) {
    eliminarArchivoSiExiste(item.imagen);
  }

  data[tipo].splice(idx, 1);
  fs.writeFileSync('patrocinadores.json', JSON.stringify(data, null, 2));
  res.json({ ok: true });
});


app.post('/api/bases_latino', (req, res) => {
  try {
    fs.writeFileSync('bases_latino.json', JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo guardar bases_latino.json' });
  }
});

app.delete('/api/bases_latino', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('bases_latino.json', 'utf8'));
    const rutas = Object.values(data.latino.bases_pdf).filter(Boolean);

    rutas.forEach(ruta => eliminarArchivoSiExiste(ruta));

    const vacio = {
      latino: {
        id: "",
        titulo: { es: "", en: "", eu: "" },
        bases_pdf: { es: "", en: "", eu: "" }
      }
    };

    fs.writeFileSync('bases_latino.json', JSON.stringify(vacio, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudieron eliminar las bases ni sus archivos' });
  }
});

const REVISTAS_JSON = 'revista.json';

app.get('/api/revistas', (req, res) => {
  try {
    const data = fs.readFileSync(REVISTAS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

app.post('/api/revistas', (req, res) => {
  const nueva = req.body;
  let revistas = [];

  try {
    revistas = JSON.parse(fs.readFileSync(REVISTAS_JSON, 'utf-8'));
  } catch (e) {}

  revistas.unshift(nueva);
  fs.writeFileSync(REVISTAS_JSON, JSON.stringify(revistas, null, 2));
  res.json({ ok: true });
});

app.delete('/api/revistas/:index', (req, res) => {
  const index = parseInt(req.params.index);
  let revistas = [];

  try {
    revistas = JSON.parse(fs.readFileSync(REVISTAS_JSON, 'utf-8'));
  } catch (e) {
    return res.status(500).json({ error: 'Error leyendo revista.json' });
  }

  if (index < 0 || index >= revistas.length) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  const revista = revistas[index];

  if (revista.portada) eliminarArchivoSiExiste(revista.portada);
  for (const lang of ["es", "en", "eu"]) {
    if (revista.archivo?.[lang]) eliminarArchivoSiExiste(revista.archivo[lang]);
  }

  revistas.splice(index, 1);
  fs.writeFileSync(REVISTAS_JSON, JSON.stringify(revistas, null, 2));
  res.json({ ok: true });
});

const DOCUMENTOS_JSON = 'documentos.json';

// Obtener lista de documentos
app.get('/api/documentos', (req, res) => {
  try {
    const data = fs.readFileSync(DOCUMENTOS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

// Guardar nuevo documento
app.post('/api/documentos', (req, res) => {
  const nuevo = req.body;
  let documentos = [];

  try {
    documentos = JSON.parse(fs.readFileSync(DOCUMENTOS_JSON, 'utf-8'));
  } catch (e) {}

  documentos.unshift(nuevo);
  fs.writeFileSync(DOCUMENTOS_JSON, JSON.stringify(documentos, null, 2));
  res.json({ ok: true });
});

// Eliminar documento por índice
app.delete('/api/documentos/:index', (req, res) => {
  const index = parseInt(req.params.index);
  let documentos = [];

  try {
    documentos = JSON.parse(fs.readFileSync(DOCUMENTOS_JSON, 'utf-8'));
  } catch (e) {
    return res.status(500).json({ error: 'Error leyendo documentos.json' });
  }

  if (index < 0 || index >= documentos.length) {
    return res.status(404).json({ error: 'Índice no válido' });
  }

  const doc = documentos[index];
  for (const lang of ["es", "en", "eu"]) {
    if (doc.archivos?.[lang]) {
      eliminarArchivoSiExiste(doc.archivos[lang]);
    }
  }

  documentos.splice(index, 1);
  fs.writeFileSync(DOCUMENTOS_JSON, JSON.stringify(documentos, null, 2));
  res.json({ ok: true });
});


app.listen(3000, () => console.log('Servidor en http://localhost:3000'));