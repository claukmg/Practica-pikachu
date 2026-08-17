import { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { URL_BASE } from '../utils/pokeapi';
import { CadenaEvolucion } from './CadenaEvolucion';

export function ModalDetalle({ nombre, shiny, esFavorito, alternarFavorito, onCerrar, onSeleccionar }) {
  const { datos, cargando, error } = useFetch(nombre ? `${URL_BASE}/${nombre}` : null);

  useEffect(() => {
    if (!nombre) return;
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, [nombre, onCerrar]);

  if (!nombre) return null;

  return (
    <div className="modal-overlay" onClick={(evento) => evento.target === evento.currentTarget && onCerrar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="detalle del pokémon">
        <button type="button" className="modal-cerrar" aria-label="cerrar" onClick={onCerrar}>
          &times;
        </button>

        {cargando && (
          <div className="estado-cargando">
            <div className="pokebola-girando"></div>
            <p>Cargando...</p>
          </div>
        )}

        {error && <div className="estado-error">{error}</div>}

        {datos && (
          <>
            <article className="tarjeta-pokemon">
              <button
                type="button"
                className={`boton-favorito boton-favorito-modal ${esFavorito(datos.name) ? 'es-favorito' : ''}`}
                onClick={() => alternarFavorito(datos.name)}
                aria-label={esFavorito(datos.name) ? 'quitar de favoritos' : 'agregar a favoritos'}
              >
                {esFavorito(datos.name) ? '★ favorito' : '☆ agregar a favoritos'}
              </button>

              <span className="numero-pokemon">#{String(datos.id).padStart(3, '0')}</span>
              <img
                className="sprite-pokemon"
                src={shiny ? (datos.sprites.front_shiny || datos.sprites.front_default) : datos.sprites.front_default}
                alt={datos.name}
              />
              <h2 className="nombre-pokemon">{datos.name}</h2>
              <div className="lista-tipos">
                {datos.types.map((t) => (
                  <span key={t.type.name} className={`etiqueta-tipo tipo-${t.type.name}`}>
                    {t.type.name}
                  </span>
                ))}
              </div>

              <div className="estadisticas">
                {datos.stats.slice(0, 4).map((s) => {
                  const porcentaje = Math.min(s.base_stat, 150) / 150 * 100;
                  return (
                    <div key={s.stat.name}>
                      <div className="fila-estadistica">
                        <span className="nombre-estadistica">{s.stat.name}</span>
                        <span className="valor-estadistica">{s.base_stat}</span>
                      </div>
                      <div className="barra-fondo">
                        <div className="barra-relleno" style={{ width: `${porcentaje}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <h3 className="titulo-seccion-modal">evoluciones</h3>
            <CadenaEvolucion idPokemon={datos.id} onSeleccionar={onSeleccionar} />
          </>
        )}
      </div>
    </div>
  );
}
