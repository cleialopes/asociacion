const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// ==== LOGIN ====
exports.login = (req, res) => {
  const { usuario, password } = req.body;
  let datos = [];

  const rutaUsuarios = path.join(__dirname, '..', 'usuarios.json');
    console.log('Ruta usada para leer usuarios:', rutaUsuarios);
  try { 
    datos = JSON.parse(fs.readFileSync(rutaUsuarios, 'utf-8'));
  } catch (e) {
    console.error('Error al leer usuarios.json:', e);
    return res.send('<h3>Error leyendo archivo de usuarios. <a href="/login.html">Volver</a></h3>');
  }

  const user = datos.find(u => u.usuario === usuario);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.usuario = usuario;
    return res.redirect('/admin');
  }

  res.send('<h3>Acceso denegado. <a href="/login.html">Volver</a></h3>');
};

// ==== LOGOUT ====
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
};

// ==== REDIRECCIÓN /admin ====
exports.redireccionAdmin = (req, res) => {
  if (req.session.usuario) {
    res.redirect('/admin/index.html');
  } else {
    res.redirect('/login.html');
  }
};

// ==== REDIRECCIÓN raíz ====
exports.redireccionRaiz = (req, res) => {
  res.redirect('/admin');
};

// ==== CAMBIO DE PASSWORD ====
exports.cambiarPassword = (req, res) => {
  if (!req.session.usuario) return res.redirect('/login.html');

  const { anterior, nueva } = req.body;
  let datos = [];

  const rutaUsuarios = path.join(__dirname, '..', 'usuarios.json');

  try {
    datos = JSON.parse(fs.readFileSync(rutaUsuarios, 'utf-8'))
  } catch (e) {
    return res.send('<h3>Error leyendo usuarios. <a href="/cambiar-password">Volver</a></h3>');
  }

  const index = datos.findIndex(u => u.usuario === req.session.usuario);
  if (index === -1) return res.send('Usuario no encontrado');

  const user = datos[index];
  if (!bcrypt.compareSync(anterior, user.password)) {
    return res.send('<h3>Contraseña actual incorrecta. <a href="/cambiar-password">Intentar de nuevo</a></h3>');
  }

  datos[index].password = bcrypt.hashSync(nueva, 10);
  fs.writeFileSync(rutaUsuarios, JSON.stringify(datos, null, 2));
  res.redirect('/admin/index.html?cambio=ok');
};


// ==== GET CAMBIO DE PASSWORD ====
exports.formCambiarPassword = (req, res) => {
  if (!req.session.usuario) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'cambiar-password.html'));
};
