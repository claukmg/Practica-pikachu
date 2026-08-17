import { useEffect, useState } from 'react';
import './App.css';
import { Buscador } from './components/Buscador';
import { GridPokemon } from './components/GridPokemon';
import { Paginacion } from './components/Paginacion';
import { ModalDetalle } from './components/ModalDetalle';
import { Login } from './components/Login';
import { useFetch } from './hooks/useFetch';
import { useDebounce } from './hooks/useDebounce';
import { useFavoritos } from './hooks/useFavoritos';
import { useAuth } from './hooks/useAuth';
import { URL_BASE, LIMITE_PAGINA } from './utils/pokeapi';

export default function App() {
  const [offset, setOffset] = useState(0);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [shiny, setShiny] = useState(false);
  const [vista, setVista] = useState('todos');
  const [seleccionado, setSeleccionado] = useState(null);

  const { token, usuario, iniciarSesion, registrarse, cerrarSesion } = useAuth();
  const { favoritos, esFavorito, alternarFavorito } = useFavoritos(token, cerrarSesion);
  const terminoRetrasado = useDebounce(terminoBusqueda, 450);

  const { datos: lista, cargando, error } = useFetch(
    vista === 'todos' ? `${URL_BASE}?limit=${LIMITE_PAGINA}&offset=${offset}` : null
  );

  useEffect(() => {
    const termino = terminoRetrasado.toLowerCase().trim();
    if (termino) setSeleccionado(termino);
  }, [terminoRetrasado]);

  if (!token) {
    return <Login onIniciarSesion={iniciarSesion} onRegistrarse={registrarse} />;
  }

  const items =
    vista === 'favoritos'
      ? favoritos.map((nombre) => ({ name: nombre, url: `${URL_BASE}/${nombre}` }))
      : lista?.results ?? [];

  return (
    <main className="contenedor">
      <div className="barra-usuario">
        <span>conectado como <strong>{usuario}</strong></span>
        <button type="button" className="boton-cerrar-sesion" onClick={cerrarSesion}>
          cerrar sesión
        </button>
      </div>

      <header className="encabezado">
        <div className="pokebola-icono" aria-hidden="true">
          <img
            src="/assets/pokebola-personalizada.png"
            alt=""
            className="pokebola-personalizada"
            onError={(evento) => evento.target.remove()}
          />
        </div>
        <h1 className="titulo">pokédex</h1>
        <p className="subtitulo">· nivel 3 — react, favoritos y evoluciones ·</p>
      </header>

      <Buscador valor={terminoBusqueda} onCambiar={setTerminoBusqueda} />

      <div className="barra-controles">
        <label className="control-shiny">
          <input type="checkbox" checked={shiny} onChange={(e) => setShiny(e.target.checked)} />
          <span>✨ shiny</span>
        </label>

        <div className="control-vista">
          <button
            type="button"
            className={`boton-vista ${vista === 'todos' ? 'activo' : ''}`}
            onClick={() => setVista('todos')}
          >
            todos
          </button>
          <button
            type="button"
            className={`boton-vista ${vista === 'favoritos' ? 'activo' : ''}`}
            onClick={() => setVista('favoritos')}
          >
            ★ favoritos ({favoritos.length})
          </button>
        </div>
      </div>

      {vista === 'todos' && cargando && (
        <div className="estado-cargando">
          <div className="pokebola-girando"></div>
          <p>Cargando...</p>
        </div>
      )}

      {vista === 'todos' && error && <div className="estado-error">{error}</div>}

      {vista === 'favoritos' && items.length === 0 && (
        <p className="mensaje-vacio">Todavía no marcaste ningún pokémon como favorito.</p>
      )}

      {(vista === 'favoritos' || (!cargando && !error)) && (
        <GridPokemon
          items={items}
          shiny={shiny}
          esFavorito={esFavorito}
          alternarFavorito={alternarFavorito}
          onSeleccionar={setSeleccionado}
        />
      )}

      {vista === 'todos' && lista && (
        <Paginacion offset={offset} total={lista.count} onCambiarOffset={setOffset} />
      )}

      <ModalDetalle
        nombre={seleccionado}
        shiny={shiny}
        esFavorito={esFavorito}
        alternarFavorito={alternarFavorito}
        onCerrar={() => {
          setSeleccionado(null);
          setTerminoBusqueda('');
        }}
        onSeleccionar={setSeleccionado}
      />
    </main>
  );
}
