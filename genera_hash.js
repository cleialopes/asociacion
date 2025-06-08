const bcrypt = require('bcrypt');

const password = '1234'; // Cambia esto por la contraseña que quieras
const hash = bcrypt.hashSync(password, 10);

console.log('Hash generado:', hash);