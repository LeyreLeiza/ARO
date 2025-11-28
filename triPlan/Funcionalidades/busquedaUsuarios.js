export const registrarUsuario = async ({ nombre_usuario, nombre, apellido, email, telefono, contraseña }) => {
  try {
    const response = await fetch("https://aro-1nwv.onrender.com/usuarios?api_key=GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch("https://aro-1nwv.onrender.com/login?api_key=GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/cambiar-contrasena?api_key=GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/rutas-personalizadas?api_key=GW1FKVKqydjW8K0AJBmwpRgVhjx0mnNN2EuQv19PNW77M`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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