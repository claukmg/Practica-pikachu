import { TarjetaPokemon } from './TarjetaPokemon';

export function GridPokemon({ items, shiny, esFavorito, alternarFavorito, onSeleccionar }) {
  if (items.length === 0) {
    return <p className="mensaje-vacio">No hay pokémon para mostrar todavía.</p>;
  }

  return (
    <section className="grid-pokemon" aria-live="polite">
      {items.map((item) => (
        <TarjetaPokemon
          key={item.name}
          url={item.url}
          shiny={shiny}
          esFavorito={esFavorito}
          alternarFavorito={alternarFavorito}
          onSeleccionar={onSeleccionar}
        />
      ))}
    </section>
  );
}
