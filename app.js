
const URL_BASE = 'https://pokeapi.co/api/v2/pokemon';

const formulario = document.getElementById('form-busqueda');
const input = document.getElementById('input-pokemon');
const resultado = document.getElementById('resultado');
const modalOverlay = document.getElementById('modal-overlay');
const modalCerrar = document.getElementById('modal-cerrar');


function abrirModal() {
  modalOverlay.hidden = false;
}

function cerrarModal() {
  modalOverlay.hidden = true;
}

modalCerrar.addEventListener('click', cerrarModal);

modalOverlay.addEventListener('click', (evento) => {
  if (evento.target === modalOverlay) cerrarModal();
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !modalOverlay.hidden) cerrarModal();
});


async function obtenerPokemon(busqueda) {
  const respuesta = await fetch(`${URL_BASE}/${busqueda}`);

  if (!respuesta.ok) {
    throw new Error(`"${busqueda}" no existe. Revisa el nombre o el número`);
  }

  return respuesta.json();
}


function crearTarjetaPokemon(datos) {
  const tipos = datos.types
    .map(t => `<span class="etiqueta-tipo tipo-${t.type.name}">${t.type.name}</span>`)
    .join('');

  const stats = datos.stats
    .slice(0, 4)
    .map(s => {
      const porcentaje = Math.min(s.base_stat, 150) / 150 * 100;
      return `
        <div class="fila-estadistica">
          <span class="nombre-estadistica">${s.stat.name}</span>
          <span class="valor-estadistica">${s.base_stat}</span>
        </div>
        <div class="barra-fondo">
          <div class="barra-relleno" style="width:${porcentaje}%"></div>
        </div>
      `;
    })
    .join('');

  return `
    <article class="tarjeta-pokemon">
      <span class="numero-pokemon">#${String(datos.id).padStart(3, '0')}</span>
      <img class="sprite-pokemon" src="${datos.sprites.front_default}" alt="${datos.name}">
      <h2 class="nombre-pokemon">${datos.name}</h2>
      <div class="lista-tipos">${tipos}</div>
      <div class="estadisticas">${stats}</div>
    </article>
  `;
}


function mostrarCargando() {
  resultado.innerHTML = `
    <div class="estado-cargando">
      <div class="pokebola-girando"></div>
      <p>Cargando...</p>
    </div>
  `;
}

function mostrarError(mensaje) {
  resultado.innerHTML = `
    <div class="estado-error">
      <p>${mensaje}</p>
    </div>
  `;
}

async function buscarPokemon(evento) {
  evento.preventDefault(); // evita que la página se recargue

  const busqueda = input.value.toLowerCase().trim();
  if (!busqueda) return;

  abrirModal();
  mostrarCargando();

  try {
    const datos = await obtenerPokemon(busqueda);
    resultado.innerHTML = crearTarjetaPokemon(datos);
  } catch (error) {
    mostrarError(error.message);
  }
}

formulario.addEventListener('submit', buscarPokemon);
