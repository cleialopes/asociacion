
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

const authMiddleware = require('./server/middlewares/authMiddleware');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secreto-super-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000, httpOnly: true }
}));


app.use('/admin', authMiddleware);
app.use('/api', require('./server/routes/contacto'));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', require('./server/routes/auth'));
app.use('/api', require('./server/routes/banners'));
app.use('/api', require('./server/routes/imagenes'));
app.use('/api', require('./server/routes/sebastiane'));
app.use('/api', require('./server/routes/upload'));
app.use('/api', require('./server/routes/sebastiane_latino'));
app.use('/api/noticias', require('./server/routes/noticias'));
app.use('/api/encuentros', require('./server/routes/encuentros'));
app.use('/api/festivales', require('./server/routes/festivales'));
app.use('/api/eventos', require('./server/routes/eventos'));
app.use('/api/patrocinadores', require('./server/routes/patrocinadores'));
app.use('/api/bases_latino', require('./server/routes/basesLatino'));
app.use('/api/revistas', require('./server/routes/revistas'));
app.use('/api/documentos', require('./server/routes/documentos'));

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));