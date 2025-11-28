export const registrarUsuario = async ({ nombre_usuario, nombre, apellido, email, telefono, contraseña }) => {
  try {
    const response = await fetch("https://aro-1nwv.onrender.com/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ nombre_usuario, nombre, apellido, email, telefono, contraseña }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loginUsuario = async (email, password) => {
  try {
    const response = await fetch("https://aro-1nwv.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: "No se pudo conectar con el servidor" };
  }
};

export const cambioContraseñaUsuario = async (userId, nueva_contraseña, vieja_contraseña) => {
  try {
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/cambiar-contrasena`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ nueva_contraseña, vieja_contraseña }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: "No se pudo conectar con el servidor" };
  }
};


export const insertarRutaPersonalizada = async ({ userId, nombre, descripcion, puntos }) => {
  try {
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/rutas-personalizadas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ nombre, descripcion, puntos }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const actualizarRutaPersonalizada = async ({ userId, rutaId, nombre, descripcion, puntos }) => {
  try {
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/rutas-personalizadas/${rutaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
      body: JSON.stringify({ nombre, descripcion, puntos }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const eliminarRutaPersonalizada = async ({ userId, rutaId }) => {
  try {
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/rutas-personalizadas/${rutaId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M"
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};