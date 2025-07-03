const container = document.getElementById("character-detail");
const loading = document.getElementById("loading");

function loadCharacter(nombre) {
  loading.style.display = "block";
  const API_URL = `https://apisimpsons.fly.dev/api/personajes?nombre=${encodeURIComponent(nombre)}&limit=1000`;
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const character = data.docs.find(c => c.Nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
      container.innerHTML = renderCharacterDetail(character);
      loading.style.display = "none";
    })
    .catch(error => {
      console.error("Error al cargar personaje:", error);
      container.innerHTML = "<p>Error al cargar el personaje.</p>";
      loading.style.display = "none";
    });
}

function renderCharacterDetail(character) {
  if (!character) {
    return "<p>Personaje no encontrado.</p>";
  }
  return `
    <div class="character-card">
      <button class="close-button" onclick="window.history.back()">✕</button>
      <img src="${character.Imagen}" alt="${character.Nombre}" class="character-img">
      <div class="character-info">
        <div class="character-meta">
          <div class="character-name"><strong>Nombre</strong> | ${character.Nombre}</div>
          <div class="character-gender"><strong>Género</strong> | ${character.Genero || "No disponible"}</div>
          <div class="character-status"><strong>Estado</strong> | ${character.Estado || "No disponible"}</div>
          <div class="character-occupation"><strong>Ocupación</strong> | ${character.Ocupacion || "No disponible"}</div>
        </div>
        <p class="character-history">${character.Historia || "No hay historia disponible."}</p>
      </div>
    </div>
  `;
}

const urlParams = new URLSearchParams(window.location.search);
const nombre = urlParams.get("nombre");
if (nombre) {
  loadCharacter(nombre);
} else {
  container.innerHTML = "<p>No se especificó ningún personaje.</p>";
}