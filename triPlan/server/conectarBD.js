
// conectarBD.js
import mariadb from 'mariadb';


export const pool = mariadb.createPool({
    host: process.env.MARIA_HOST || '10.17.123.98', //localhost si servidor en mismo pc que app
    port: Number(process.env.MARIA_PORT) || 3306,
    user: process.env.MARIA_USER || 'usuario_remoto',
    password: process.env.MARIA_PASS || 'ProyectoARO',
    database: process.env.MARIA_DB || 'proyectoaro',
    connectionLimit: 5
});


export async function query(sql, params = []) { //sql → cadena de consulta SQL (SELECT, INSERT, etc.).
                                                //params → array de parámetros para consultas preparadas (evita inyección SQL)
  let conn;
  try {
    conn = await pool.getConnection();          // obtiene una conexión del pool
    const rows = await conn.query(sql, params); // ejecuta la consulta SQL
    return Array.isArray(rows) ? rows : [];     // devuelve solo los datos
  } finally {
    if (conn) conn.release();                   // libera la conexión de vuelta al pool
  }
}

//Ejecuta la consulta SELECT 1 AS ok simplemente para verificar que la base de datos responde.
//Devuelve true si la conexión es exitosa y false si falla.

export async function testConnection() {
    const r = await query('SELECT 1 AS ok');
    return r[0].ok === 1;
}
