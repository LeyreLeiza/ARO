import express from "express";
import { query } from "./conectarBD.js";  // tu archivo de conexión a MariaDB

const app = express();
app.use(express.json()); // para procesar JSON si haces POST

// Ruta para obtener todos los puntos de interés
app.get("/puntos", async (req, res) => {
  try {
    // Consulta la tabla "puntos_interes"
    const puntos = await query(
      "SELECT NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM puntos_interes"
    );

    // Devuelve los datos como JSON
    res.json(puntos);
  } catch (err) {
    console.error("Error al consultar la BD:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/puntos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query(
      "SELECT NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM puntos_interes WHERE ID = ?",
      [id] // los parámetros van en un array para evitar SQL injection
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/puntos/tipo/:tipo", async (req, res) => {
  const tipo = req.params.tipo;
  try {
    const puntos = await query(
      "SELECT ID, NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat, TIPO FROM puntos_interes WHERE TIPO = ?",
      [tipo]
    );
    res.json(puntos);
  } catch (err) {
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const puntos = await query(
      "SELECT ID, NOMBRE_USUARIO TIPO FROM usuarios"
    );
    res.json(puntos);
  } catch (err) {
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const puntos = await query(
      "SELECT ID, NOMBRE_USUARIO TIPO FROM usuarios WHERE ID=?",
      [id]
    );
    res.json(puntos);
  } catch (err) {
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/eventos", async (req, res) => {
  try {
    // Consulta la tabla "puntos_interes"
    const puntos = await query(
      "SELECT NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM eventos"
    );

    // Devuelve los datos como JSON
    res.json(puntos);
  } catch (err) {
    console.error("Error al consultar la BD:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

app.get("/eventos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query(
      "SELECT NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM eventos WHERE ID = ?",
      [id] // los parámetros van en un array para evitar SQL injection
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});



// Puedes agregar más rutas si quieres filtrar, insertar, etc.
// Por ejemplo: /puntos/:id, /puntos/tipo, etc.

// Inicia el servidor en el puerto 3000
app.listen(3000, () =>
  console.log("Backend corriendo en http://localhost:3000")
);