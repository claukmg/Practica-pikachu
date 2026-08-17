import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../utils/api';

export function useFavoritos(token, alExpirar) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (!token) {
      setFavoritos([]);
      return;
    }

    let cancelado = false;

    fetch(`${API_BASE}/favoritos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((respuesta) => {
        if (respuesta.status === 401) {
          alExpirar?.();
          return null;
        }
        return respuesta.json();
      })
      .then((datos) => {
        if (!cancelado && datos) setFavoritos(datos.favoritos);
      })
      .catch(() => {});

    return () => {
      cancelado = true;
    };
  }, [token]);

  const esFavorito = useCallback((nombre) => favoritos.includes(nombre), [favoritos]);

  async function alternarFavorito(nombre) {
    const metodo = favoritos.includes(nombre) ? 'DELETE' : 'POST';
    const respuesta = await fetch(`${API_BASE}/favoritos/${nombre}`, {
      method: metodo,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (respuesta.status === 401) {
      alExpirar?.();
      return;
    }

    const datos = await respuesta.json();
    setFavoritos(datos.favoritos);
  }

  return { favoritos, esFavorito, alternarFavorito };
}
