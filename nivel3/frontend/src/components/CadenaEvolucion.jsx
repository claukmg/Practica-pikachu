import { useFetch } from '../hooks/useFetch';
import { URL_ESPECIE, idDesdeUrl, spriteDesdeId } from '../utils/pokeapi';

function construirEtapas(cadena) {
  const etapas = [];
  let nivelActual = [{ especie: cadena.species, detalle: null }];

  while (nivelActual.length > 0) {
    etapas.push(nivelActual);
    nivelActual = nivelActual.flatMap(({ especie }) => {
      const nodo = buscarNodo(cadena, especie.name);
      return nodo.evolves_to.map((hijo) => ({
        especie: hijo.species,
        detalle: hijo.evolution_details[0] ?? null,
      }));
    });
  }

  return etapas;
}

function buscarNodo(nodo, nombre) {
  if (nodo.species.name === nombre) return nodo;
  for (const hijo of nodo.evolves_to) {
    const encontrado = buscarNodo(hijo, nombre);
    if (encontrado) return encontrado;
  }
  return null;
}

function describirDetalle(detalle) {
  if (!detalle) return null;

  const disparador = detalle.trigger?.name;

  if (disparador === 'level-up') {
    if (detalle.relative_physical_stats === 1) return `nivel ${detalle.min_level} (ataque > defensa)`;
    if (detalle.relative_physical_stats === -1) return `nivel ${detalle.min_level} (defensa > ataque)`;
    if (detalle.relative_physical_stats === 0) return `nivel ${detalle.min_level} (ataque = defensa)`;
    if (detalle.min_level) return `nivel ${detalle.min_level}`;
    if (detalle.min_happiness) return 'amistad alta';
    if (detalle.min_affection) return 'cariño alto';
    if (detalle.min_beauty) return 'belleza alta';
    if (detalle.known_move) return `sabe ${detalle.known_move.name.replace(/-/g, ' ')}`;
    if (detalle.known_move_type) return `sabe mov. tipo ${detalle.known_move_type.name}`;
    if (detalle.location) return `en ${detalle.location.name.replace(/-/g, ' ')}`;
    if (detalle.time_of_day) return detalle.time_of_day === 'day' ? 'de día' : 'de noche';
    return 'subir de nivel';
  }

  if (disparador === 'trade') {
    return detalle.held_item
      ? `intercambio + ${detalle.held_item.name.replace(/-/g, ' ')}`
      : 'intercambio';
  }

  if (disparador === 'use-item') {
    return detalle.item?.name.replace(/-/g, ' ') ?? 'objeto';
  }

  if (disparador === 'shed') return 'con espacio libre';

  return disparador?.replace(/-/g, ' ') ?? null;
}

export function CadenaEvolucion({ idPokemon, onSeleccionar }) {
  const { datos: especie } = useFetch(`${URL_ESPECIE}/${idPokemon}`);
  const { datos: cadena, cargando } = useFetch(especie?.evolution_chain?.url ?? null);

  if (cargando || !cadena) {
    return (
      <div className="estado-cargando-chico">
        <div className="pokebola-girando pokebola-girando-chica"></div>
      </div>
    );
  }

  const etapas = construirEtapas(cadena.chain);

  return (
    <div className="cadena-evolucion">
      {etapas.map((etapa, indice) => (
        <div className="etapa-evolucion" key={indice} style={{ animationDelay: `${indice * 0.12}s` }}>
          {indice > 0 && <span className="flecha-evolucion">→</span>}
          <div className="especies-etapa">
            {etapa.map(({ especie: especieEvolucion, detalle }) => {
              const id = idDesdeUrl(especieEvolucion.url);
              const esActual = Number(id) === Number(idPokemon);
              const condicion = describirDetalle(detalle);
              return (
                <div className="columna-evolucion" key={especieEvolucion.name}>
                  <button
                    type="button"
                    className={`chip-evolucion ${esActual ? 'chip-evolucion-actual' : ''}`}
                    onClick={() => onSeleccionar(especieEvolucion.name)}
                  >
                    <img src={spriteDesdeId(id)} alt={especieEvolucion.name} loading="lazy" />
                    <span>{especieEvolucion.name}</span>
                  </button>
                  {condicion && <span className="condicion-evolucion">{condicion}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
