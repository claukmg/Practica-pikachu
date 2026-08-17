import { useState } from 'react';

export function Login({ onIniciarSesion, onRegistrarse }) {
  const [modo, setModo] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (modo === 'login') {
        await onIniciarSesion({ usuario, password });
      } else {
        await onRegistrarse({ usuario, password });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="pantalla-login">
      <div className="tarjeta-login">
        <div className="pokebola-icono" aria-hidden="true">
          <img
            src="/assets/pokebola-personalizada.png"
            alt=""
            className="pokebola-personalizada"
            onError={(evento) => evento.target.remove()}
          />
        </div>
        <h1 className="titulo">pokédex</h1>
        <p className="subtitulo">· {modo === 'login' ? 'inicia sesión' : 'crea tu cuenta'} ·</p>

        <form className="formulario-login" onSubmit={manejarEnvio}>
          <input
            type="text"
            className="entrada"
            placeholder="usuario"
            autoComplete="username"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
            minLength={3}
            required
          />
          <input
            type="password"
            className="entrada"
            placeholder="contraseña"
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            minLength={6}
            required
          />

          {error && <p className="error-login">{error}</p>}

          <button type="submit" className="boton" disabled={cargando}>
            {cargando ? 'un momento...' : modo === 'login' ? 'entrar' : 'crear cuenta'}
          </button>
        </form>

        <button
          type="button"
          className="enlace-cambiar-modo"
          onClick={() => {
            setModo(modo === 'login' ? 'registro' : 'login');
            setError('');
          }}
        >
          {modo === 'login' ? '¿no tienes cuenta? regístrate' : '¿ya tienes cuenta? inicia sesión'}
        </button>
      </div>
    </main>
  );
}
