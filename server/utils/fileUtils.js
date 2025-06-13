const fs = require('fs');
const path = require('path');

function eliminarArchivoSiExiste(rutaRelativa) {
  // Normaliza: remueve el prefijo / si existe
  const rutaNormalizada = rutaRelativa.replace(/^\/+/, '');

  // Verifica si ya contiene "public/" (mal uso)
  if (rutaNormalizada.startsWith('public/')) {
    console.warn("Ruta incorrecta detectada en eliminarArchivoSiExiste:", rutaNormalizada);
    return;
  }

  // Ruta final absoluta
  const ruta = path.resolve(__dirname, '../../public', rutaNormalizada);

  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
    console.log(`Archivo eliminado correctamente: ${ruta}`);
  } else {
    console.warn(`No se encontró el archivo a eliminar: ${ruta}`);
  }
}


function moverArchivoTempAPublico(archivo, carpetaDestino) {
  const ext = path.extname(archivo.originalname).toLowerCase();
  const nombre = Date.now() + ext;
  const destinoDir = path.resolve(__dirname, '../../public', carpetaDestino);
  if (!fs.existsSync(destinoDir)) fs.mkdirSync(destinoDir, { recursive: true });
  const destino = path.join(destinoDir, nombre);

  fs.renameSync(archivo.path, destino);

  // URL relativa desde /public
 const url = `/${path.relative(path.resolve(__dirname, '../../public'), destino).replace(/\\/g, '/')}`;
  return url;
}

module.exports = { eliminarArchivoSiExiste, moverArchivoTempAPublico };