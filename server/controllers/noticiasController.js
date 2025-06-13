const fs = require('fs');
const path = require('path');
const { eliminarArchivoSiExiste } = require('../utils/fileUtils');

const NOTICIAS_JSON = path.join(__dirname, '../data/noticias.json');

exports.obtenerNoticias = (req, res) => {
  try {
    if (!fs.existsSync(NOTICIAS_JSON)) return res.json([]);
    const data = fs.readFileSync(NOTICIAS_JSON, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    console.error('Error al leer noticias:', error);
    res.status(500).json([]);
  }
};

exports.crearNoticia = (req, res) => {
  const noticia = req.body;
  let noticias = [];

  try {
    if (fs.existsSync(NOTICIAS_JSON)) {
      const contenido = fs.readFileSync(NOTICIAS_JSON, 'utf-8');
      if (contenido.trim()) {
        noticias = JSON.parse(contenido);
      }
    }

    noticias.unshift(noticia);
    fs.writeFileSync(NOTICIAS_JSON, JSON.stringify(noticias, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error('Error al guardar la noticia:', error);
    res.status(500).json({ ok: false, error: 'Error al guardar la noticia' });
  }
};

exports.eliminarNoticia = (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index)) return res.status(400).json({ ok: false, error: 'Índice inválido' });

    const data = fs.existsSync(NOTICIAS_JSON)
      ? JSON.parse(fs.readFileSync(NOTICIAS_JSON, 'utf8'))
      : [];

    if (index >= 0 && index < data.length) {
      const noticia = data[index];

      // Elimina todas las imágenes asociadas
      if (Array.isArray(noticia.imagenes)) {
        noticia.imagenes.forEach((img) => eliminarArchivoSiExiste(img));
      }

      data.splice(index, 1);
      fs.writeFileSync(NOTICIAS_JSON, JSON.stringify(data, null, 2));
      res.json({ ok: true });
    } else {
      res.status(404).json({ ok: false, error: 'Índice fuera de rango' });
    }
  } catch (error) {
    console.error('❌ Error al eliminar la noticia:', error);
    res.status(500).json({ ok: false, error: 'Error interno al eliminar' });
  }
};
