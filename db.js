const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'plataformas',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;