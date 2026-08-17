export const URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
export const URL_ESPECIE = 'https://pokeapi.co/api/v2/pokemon-species';
export const LIMITE_PAGINA = 20;

export function idDesdeUrl(url) {
  const partes = url.split('/').filter(Boolean);
  return partes[partes.length - 1];
}

export function spriteDesdeId(id, shiny = false) {
  const ruta = shiny ? 'shiny/' : '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ruta}${id}.png`;
}
