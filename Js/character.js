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
const urlParams = new URLSearchParams(window.location.search);
const nombre = urlParams.get("nombre");
if (nombre) {
  loadCharacter(nombre);
} else {
  container.innerHTML = "<p>No se especificó ningún personaje.</p>";
}