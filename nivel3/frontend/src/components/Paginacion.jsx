import { LIMITE_PAGINA } from '../utils/pokeapi';

export function Paginacion({ offset, total, onCambiarOffset }) {
  const desde = total === 0 ? 0 : offset + 1;
  const hasta = Math.min(offset + LIMITE_PAGINA, total);

  return (
    <nav className="paginacion" aria-label="paginación de pokémon">
      <button
        type="button"
        className="boton-paginacion"
        disabled={offset === 0}
        onClick={() => onCambiarOffset(Math.max(0, offset - LIMITE_PAGINA))}
      >
        ← anterior
      </button>

      <span className="texto-paginacion">
        {desde}–{hasta} de {total}
      </span>

      <button
        type="button"
        className="boton-paginacion"
        disabled={offset + LIMITE_PAGINA >= total}
        onClick={() => onCambiarOffset(offset + LIMITE_PAGINA)}
      >
        siguiente →
      </button>
    </nav>
  );
}
