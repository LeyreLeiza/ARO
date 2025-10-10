import express from "express";
import { query } from "./conectarBD.js"; // tu archivo de conexión a MariaDB

const app = express();
app.use(express.json()); // Middleware para procesar JSON en el body de las peticiones
const port = process.env.PORT || 10000;

//=============================================================================
// RUTAS PARA PUNTOS DE INTERÉS
//=============================================================================

// GET - Obtener todos los puntos de interés
app.get("/puntos", async (req, res) => {
  try {
    const puntos = await query(
      // Añadido ID y TIPO para que la respuesta sea más completa
      "SELECT ID, NOMBRE, TIPO, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM puntos_interes"
    );
    res.json(puntos);
  } catch (err) {
    console.error("Error al consultar la BD:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET - Obtener un punto por su ID
app.get("/puntos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "SELECT ID, NOMBRE, TIPO, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM puntos_interes WHERE ID = ?",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Punto no encontrado" });
    }
    res.json(result[0]); // Devolvemos el objeto, no el array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET - Obtener puntos por tipo
app.get("/puntos/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params;
    try {
      const puntos = await query(
        "SELECT ID, NOMBRE, TIPO, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM puntos_interes WHERE TIPO = ?",
        [tipo]
      );
      res.json(puntos);
    } catch (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    }
  });


// POST - Añadir un nuevo punto de interés
app.post("/puntos", async (req, res) => {
    const { nombre, tipo, lat, lon } = req.body;
  
    if (!nombre || !tipo || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: "Faltan datos requeridos (nombre, tipo, lat, lon)." });
    }
  
    try {
      const sql = "INSERT INTO puntos_interes (NOMBRE, TIPO, COORDENADAS) VALUES (?, ?, POINT(?, ?))";
      const resultado = await query(sql, [nombre, tipo, lon, lat]);
      res.status(201).json({ 
          mensaje: "Punto de interés creado con éxito",
          id: resultado.insertId 
      });
    } catch (err) {
      console.error("Error al insertar en la BD:", err);
      res.status(500).json({ error: "Error en la base de datos al insertar el punto." });
    }
  });


//=============================================================================
// RUTAS PARA USUARIOS
//=============================================================================

// GET - Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await query("SELECT ID, NOMBRE_USUARIO FROM usuarios");
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET - Obtener un usuario por ID
app.get("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const usuarios = await query("SELECT ID, NOMBRE_USUARIO FROM usuarios WHERE ID=?", [id]);
      if (usuarios.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuarios[0]);
    } catch (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    }
});

// POST - Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
    const { nombre_usuario, password } = req.body; // Asumiendo que pides password

    if (!nombre_usuario || !password) {
        return res.status(400).json({ error: "Faltan datos requeridos (nombre_usuario, password)." });
    }
    
    try {
        // En un caso real, la contraseña debería ser "hasheada" antes de guardarla.
        // Ejemplo: const hash = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO usuarios (NOMBRE_USUARIO, PASSWORD) VALUES (?, ?)";
        const resultado = await query(sql, [nombre_usuario, password]); // Aquí iría 'hash' en vez de 'password'
        res.status(201).json({
            mensaje: "Usuario creado con éxito",
            id: resultado.insertId
        });
    } catch (err) {
        // Manejar error de usuario duplicado (código ER_DUP_ENTRY)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "El nombre de usuario ya existe." });
        }
        console.error("Error al crear usuario:", err);
        res.status(500).json({ error: "Error en la base de datos al crear el usuario." });
    }
});


//=============================================================================
// RUTAS PARA EVENTOS
//=============================================================================

// GET - Obtener todos los eventos
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await query(
      "SELECT ID, NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM eventos"
    );
    res.json(eventos);
  } catch (err) {
    console.error("Error al consultar la BD:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET - Obtener un evento por ID
app.get("/eventos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "SELECT ID, NOMBRE, ST_X(COORDENADAS) AS lon, ST_Y(COORDENADAS) AS lat FROM eventos WHERE ID = ?",
      [id]
    );
    if (result.length === 0) {
        return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// POST - Crear un nuevo evento
app.post("/eventos", async (req, res) => {
    const { nombre, lat, lon } = req.body; // Añade más campos si los necesitas (fecha, descripción, etc.)
  
    if (!nombre || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: "Faltan datos requeridos (nombre, lat, lon)." });
    }
  
    try {
      const sql = "INSERT INTO eventos (NOMBRE, COORDENADAS) VALUES (?, POINT(?, ?))";
      const resultado = await query(sql, [nombre, lon, lat]);
      res.status(201).json({ 
          mensaje: "Evento creado con éxito",
          id: resultado.insertId 
      });
    } catch (err) {
      console.error("Error al insertar el evento:", err);
      res.status(500).json({ error: "Error en la base de datos al insertar el evento." });
    }
});


//=============================================================================
// Iniciar el servidor
//=============================================================================
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
