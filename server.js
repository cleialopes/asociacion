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
    const ext = path.extname(file.originalname); // conserva extensión
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesión
app.use(session({
  secret: 'secreto-super-seguro',
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Middleware para proteger /admin
app.use('/admin', (req, res, next) => {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/login.html');
  }
});

// Ruta de login (POST)
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

// Ruta logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Ruta GET del banner
app.get('/api/banner', (req, res) => {
  try {
    const data = fs.readFileSync('banner.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({ mostrar: false, tipo: "", url: "" });
  }
});

// Ruta POST del banner (con imagen o video)
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

// Esto "elimina" el banner al dejarlo oculto y vacío.
app.delete('/api/banner', (req, res) => {
  const banner = {
    mostrar: false,
    tipo: "",
    url: ""
  };
  fs.writeFileSync('banner.json', JSON.stringify(banner));
  res.json({ ok: true });
});

// API Sebastiane
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
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf-8'));
    if (data[anio] && data[anio][seccion]) {
      data[anio][seccion].splice(index, 1);
      fs.writeFileSync(SEBASTIANE_JSON, JSON.stringify(data, null, 2));
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "No encontrado" });
    }
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

app.get('/api/sebastiane', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('sebastiane.json', 'utf-8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({});
  }
});

// API Sebastiane Latino
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
  try {
    const data = JSON.parse(fs.readFileSync(SEBASTIANE_LATINO_JSON, 'utf-8'));
    if (data[anio] && data[anio][seccion]) {
      data[anio][seccion].splice(index, 1);
      fs.writeFileSync(SEBASTIANE_LATINO_JSON, JSON.stringify(data, null, 2));
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "No encontrado" });
    }
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// API Noticias
const NOTICIAS_JSON = 'noticias.json';

// Obtener todas las noticias
app.get('/api/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(NOTICIAS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json([]);
  }
});

// Añadir una nueva noticia
app.post('/api/noticias', (req, res) => {
  const noticia = req.body;
  let noticias = [];

  try {
    noticias = JSON.parse(fs.readFileSync(NOTICIAS_JSON, 'utf-8'));
  } catch (e) {}

  noticias.unshift(noticia); // Añadir al principio
  fs.writeFileSync(NOTICIAS_JSON, JSON.stringify(noticias, null, 2));
  res.json({ ok: true });
});

// Eliminar una noticia por índice
app.delete('/api/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index);
  try {
    let noticias = JSON.parse(fs.readFileSync(NOTICIAS_JSON, 'utf-8'));
    if (index >= 0 && index < noticias.length) {
      noticias.splice(index, 1);
      fs.writeFileSync(NOTICIAS_JSON, JSON.stringify(noticias, null, 2));
      res.json({ ok: true });
    } else {
      res.status(400).json({ error: 'Índice inválido' });
    }
  } catch (e) {
    res.status(500).json({ error: 'No se pudo eliminar la noticia' });
  }
});


app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió archivo' });
  }
  const extension = path.extname(req.file.originalname);
  const nombreArchivo = `${Date.now()}${extension}`;
  const destino = path.join(__dirname, 'public', 'img', nombreArchivo);

  fs.renameSync(req.file.path, destino);

  const url = `/img/${nombreArchivo}`;
  res.json({ url });
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
  try {
    let encuentros = JSON.parse(fs.readFileSync(ENCUENTROS_JSON, 'utf-8'));
    if (index >= 0 && index < encuentros.length) {
      encuentros.splice(index, 1);
      fs.writeFileSync(ENCUENTROS_JSON, JSON.stringify(encuentros, null, 2));
      res.json({ ok: true });
    } else {
      res.status(400).json({ error: 'Índice inválido' });
    }
  } catch (e) {
    res.status(500).json({ error: 'No se pudo eliminar el encuentro' });
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
  const fs = require('fs');
  const festivalesPath = path.join(__dirname, 'festivales.json');
  const index = parseInt(req.params.index);
  const festivales = JSON.parse(fs.readFileSync(festivalesPath));
  if (index >= 0 && index < festivales.length) {
    festivales.splice(index, 1);
    fs.writeFileSync(festivalesPath, JSON.stringify(festivales, null, 2));
    res.json({ ok: true });
  } else {
    res.status(400).json({ error: "Índice inválido" });
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



app.listen(3000, () => console.log('Servidor en http://localhost:3000'));