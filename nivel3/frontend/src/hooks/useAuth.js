import { useState } from 'react';
import { API_BASE } from '../utils/api';

const CLAVE_TOKEN = 'pokedex-token';
const CLAVE_USUARIO = 'pokedex-usuario';

async function llamarAuth(ruta, datos) {
  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  const cuerpo = await respuesta.json();

  if (!respuesta.ok) {
    const detalle = cuerpo.detail;
    const mensaje = Array.isArray(detalle) ? detalle[0]?.msg : detalle;
    throw new Error(mensaje || 'No se pudo completar la operación');
  }

  return cuerpo;
}

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(CLAVE_TOKEN));
  const [usuario, setUsuario] = useState(() => localStorage.getItem(CLAVE_USUARIO));

  async function iniciarSesion(datos) {
    const cuerpo = await llamarAuth('/auth/login', datos);
    localStorage.setItem(CLAVE_TOKEN, cuerpo.access_token);
    localStorage.setItem(CLAVE_USUARIO, datos.usuario);
    setToken(cuerpo.access_token);
    setUsuario(datos.usuario);
  }

  async function registrarse(datos) {
    await llamarAuth('/auth/register', datos);
    await iniciarSesion(datos);
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    setToken(null);
    setUsuario(null);
  }

  return { token, usuario, iniciarSesion, registrarse, cerrarSesion };
}
