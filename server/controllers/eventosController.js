const fs = require('fs');
const path = require('path');

const EVENTOS_JSON = path.join(__dirname, '../data/eventos.json');

exports.obtenerEventos = (req, res) => {
  try {
    const data = fs.readFileSync(EVENTOS_JSON, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json([]);
  }
};

exports.crearEvento = (req, res) => {
  const evento = req.body;
  let eventos = [];

  try {
    eventos = JSON.parse(fs.readFileSync(EVENTOS_JSON, 'utf-8'));
  } catch {}

  eventos.push(evento);
  fs.writeFileSync(EVENTOS_JSON, JSON.stringify(eventos, null, 2));
  res.json({ ok: true });
};

exports.eliminarEvento = (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let eventos = JSON.parse(fs.readFileSync(EVENTOS_JSON, 'utf-8'));
    const index = eventos.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Si más adelante los eventos incluyen imágenes:
    // if (eventos[index].imagen) {
    //   eliminarArchivoSiExiste(eventos[index].imagen);
    // }

    eventos.splice(index, 1);
    fs.writeFileSync(EVENTOS_JSON, JSON.stringify(eventos, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'No se pudo eliminar el evento' });
  }
};
