const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

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

app.post('/api/sebastiane/:anio/:seccion', upload.single('imagen'), (req, res) => {
  const { anio, seccion } = req.params;
  const { titulo, director, pais, descripcion } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : "";

  const pelicula = { titulo, director, pais, descripcion, imagen };

  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(SEBASTIANE_JSON, 'utf-8'));
  } catch (e) {}

  if (!data[anio]) data[anio] = {};
  if (!data[anio][seccion]) data[anio][seccion] = [];

  data[anio][seccion].push(pelicula);

  fs.writeFileSync(SEBASTIANE_JSON, JSON.stringify(data, null, 2));
  res.json({ ok: true });
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

app.get('/api/sebastiane_latino', (req, res) => {
  try {
    const data = fs.readFileSync('sebastiane_latino.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({});
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
