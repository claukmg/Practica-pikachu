import { useEffect, useState } from 'react';

export function useFetch(url) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setDatos(null);
      setCargando(false);
      setError(null);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setError(null);

    fetch(url)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`No se encontró "${url.split('/').filter(Boolean).pop()}"`);
        return respuesta.json();
      })
      .then((json) => {
        if (!cancelado) setDatos(json);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [url]);

  return { datos, cargando, error };
}
