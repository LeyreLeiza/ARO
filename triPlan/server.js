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

// Puedes agregar más rutas si quieres filtrar, insertar, etc.
// Por ejemplo: /puntos/:id, /puntos/tipo, etc.

// Inicia el servidor en el puerto 3000
app.listen(3000, () =>
  console.log("Backend corriendo en http://localhost:3000")
);
