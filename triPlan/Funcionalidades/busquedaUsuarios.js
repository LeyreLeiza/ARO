export const registrarUsuario = async ({ nombre_usuario, nombre, apellido, email, telefono, contraseña }) => {
  try {
    const response = await fetch("https://aro-1nwv.onrender.com/usuarios", {
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
    const response = await fetch("https://aro-1nwv.onrender.com/login", {
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
    const response = await fetch(`https://aro-1nwv.onrender.com/usuarios/${userId}/cambiar-contrasena`, {
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