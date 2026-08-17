import { useFetch } from '../hooks/useFetch';

export function TarjetaPokemon({ url, shiny, esFavorito, alternarFavorito, onSeleccionar }) {
  const { datos, cargando, error } = useFetch(url);

  if (cargando) {
    return (
      <div className="tarjeta-grid tarjeta-grid-cargando">
        <div className="pokebola-girando pokebola-girando-chica"></div>
      </div>
    );
  }

  if (error || !datos) {
    return <div className="tarjeta-grid tarjeta-grid-error">?</div>;
  }

  const sprite = shiny
    ? (datos.sprites.front_shiny || datos.sprites.front_default)
    : datos.sprites.front_default;

  return (
    <div className="tarjeta-grid">
      <button
        type="button"
        className={`boton-favorito ${esFavorito(datos.name) ? 'es-favorito' : ''}`}
        onClick={(evento) => {
          evento.stopPropagation();
          alternarFavorito(datos.name);
        }}
        aria-label={esFavorito(datos.name) ? 'quitar de favoritos' : 'agregar a favoritos'}
      >
        {esFavorito(datos.name) ? '★' : '☆'}
      </button>

      <button type="button" className="contenido-tarjeta" onClick={() => onSeleccionar(datos.name)}>
        <span className="numero-pokemon">#{String(datos.id).padStart(3, '0')}</span>
        <img className="sprite-pokemon" src={sprite} alt={datos.name} loading="lazy" />
        <p className="nombre-pokemon">{datos.name}</p>
        <div className="lista-tipos">
          {datos.types.map((t) => (
            <span key={t.type.name} className={`etiqueta-tipo tipo-${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
      </button>
    </div>
  );
}
