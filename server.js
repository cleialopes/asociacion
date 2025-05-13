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

// API de eventos (igual que antes)
app.post('/api/eventos', upload.single('imagen'), (req, res) => {
  const evento = {
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    imagen: req.file ? `/uploads/${req.file.filename}` : null
  };

  let eventos = [];
  try {
    eventos = JSON.parse(fs.readFileSync('eventos.json', 'utf-8'));
  } catch (e) {}

  eventos.push(evento);
  fs.writeFileSync('eventos.json', JSON.stringify(eventos));
  res.json({ ok: true });
});

app.get('/api/eventos', (req, res) => {
  let eventos = [];
  try {
    eventos = JSON.parse(fs.readFileSync('eventos.json', 'utf-8'));
  } catch (e) {}

  res.json(eventos);
});

// Ruta para eliminar evento por índice
app.delete('/api/eventos/:index', (req, res) => {
  let eventos = [];
  try {
    eventos = JSON.parse(fs.readFileSync('eventos.json', 'utf-8'));
  } catch (e) {}

  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= eventos.length) {
    return res.status(400).json({ error: 'Índice inválido' });
  }

  eventos.splice(index, 1);
  fs.writeFileSync('eventos.json', JSON.stringify(eventos));
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
