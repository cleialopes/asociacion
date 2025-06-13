
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

const authMiddleware = require('./middlewares/authMiddleware');


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
app.use('/api', require('./routes/contacto'));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/banners'));
app.use('/api', require('./routes/imagenes'));
app.use('/api', require('./routes/sebastiane'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/sebastiane_latino'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/encuentros', require('./routes/encuentros'));
app.use('/api/festivales', require('./routes/festivales'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/patrocinadores', require('./routes/patrocinadores'));
app.use('/api/bases_latino', require('./routes/basesLatino'));
app.use('/api/revistas', require('./routes/revistas'));
app.use('/api/documentos', require('./routes/documentos'));

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));