const container = document.getElementById("characters-container");
let currentPage = 1;
const limit = 50;

function renderCharacterCard(character) {
  return `
    <div class="character-card" onclick="verDetalles('${character.Nombre}')">
      <img src="${character.Imagen}" alt="${character.Nombre}" class="character-img">
      <h2 class="character-name">${character.Nombre}</h2>
      <p class="character-gender">${character.Genero || "Genero no disponible"}</p>
      <p class="character-status">${character.Estado || "Estado no disponible"}</p>
    </div>
  `;
}

function verDetalles(nombre) {
  const nombreParam = encodeURIComponent(nombre);
  window.location.href = `character.html?nombre=${nombreParam}`;
}

function loadCharacters(page = 1) {
  const API_URL = `https://apisimpsons.fly.dev/api/personajes?limit=${limit}&page=${page}`;
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const personajes = data.docs;
      container.innerHTML = "";
      personajes.forEach(character => {
        container.innerHTML += renderCharacterCard(character);
      });
    })
    .catch(error => {
      console.error("Error al cargar personajes:", error);
      container.innerHTML = "<p>Error al cargar los personajes.</p>";
    });
}

loadCharacters();