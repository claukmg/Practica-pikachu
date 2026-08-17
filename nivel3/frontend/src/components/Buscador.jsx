export function Buscador({ valor, onCambiar }) {
  return (
    <form className="buscador" onSubmit={(evento) => evento.preventDefault()}>
      <span className="prompt-simbolo" aria-hidden="true">&gt;</span>
      <input
        type="text"
        className="entrada"
        placeholder="pikachu, 25, gengar..."
        autoComplete="off"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
      />
      {valor && (
        <button type="button" className="boton boton-limpiar" onClick={() => onCambiar('')}>
          limpiar
        </button>
      )}
    </form>
  );
}
