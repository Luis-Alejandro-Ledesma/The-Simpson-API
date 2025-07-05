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
  renderPagination(page, data.totalPages || 10);

    })
    .catch(error => {
      console.error("Error al cargar personajes:", error);
      container.innerHTML = "<p>Error al cargar los personajes.</p>";
    });
}

function renderPagination(current, total) {
  pagination.innerHTML = "";
  if (current > 1) {
    pagination.innerHTML += `<button onclick="loadCharacters(${current - 1})">&laquo;</button>`;
  }
  for (let i = 1; i <= total; i++) {
    if (i === current) {
      pagination.innerHTML += `<button class="active">${i}</button>`;
    } else if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
      pagination.innerHTML += `<button onclick="loadCharacters(${i})">${i}</button>`;
    } else if (i === current - 3 || i === current + 3) {
      pagination.innerHTML += `<span>...</span>`;
    }
  }
  if (current < total) {
    pagination.innerHTML += `<button onclick="loadCharacters(${current + 1})">&raquo;</button>`;
  }
}

loadCharacters();

//intento de buscador

const inputBusqueda = document.getElementById("name-filter");
const botonBuscar = document.getElementById("buscador");
const autocompleteList = document.getElementById("autocompleteList");

let todosLosPersonajes = [];

loadCharacters();

fetch("https://apisimpsons.fly.dev/api/personajes?limit=1000")
  .then(res => res.json())
  .then(data => {
    todosLosPersonajes = data.docs;
  });

botonBuscar.addEventListener("click", buscarPersonaje);

inputBusqueda.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  mostrarSugerencias(query);
});

inputBusqueda.addEventListener("click", function () {
  const query = this.value.toLowerCase().trim();
  mostrarSugerencias(query);
});

document.addEventListener("click", function (e) {
  setTimeout(() => {
    if (
      !inputBusqueda.contains(e.target) &&
      !autocompleteList.contains(e.target)
    ) {
      autocompleteList.innerHTML = "";
    }
  }, 100);
});

function mostrarSugerencias(query) {
  autocompleteList.innerHTML = "";

  let sugerencias = [];

  if (query.length === 0) {
    sugerencias = [...todosLosPersonajes]
      .sort(() => Math.random() - 0)
      .slice(0, 3);
  } else {
    sugerencias = todosLosPersonajes
      .filter(p => p.Nombre.toLowerCase().startsWith(query))
      .slice(0, 3);
  }

  // Mostrar sugerencias o mensaje de "sin coincidencias"
  if (sugerencias.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin coincidencias";
    li.style.color = "#888"; // estilo opcional como un nombre gris
    li.style.cursor = "default";
    autocompleteList.appendChild(li);
    return;
  }

  sugerencias.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.Nombre;
    li.addEventListener("click", () => {
      inputBusqueda.value = p.Nombre;
      autocompleteList.innerHTML = "";
      buscarPersonaje();
    });
    autocompleteList.appendChild(li);
  });
}

function buscarPersonaje() {
  const nombre = inputBusqueda.value.toLowerCase().trim();
  container.innerHTML = "";
  autocompleteList.innerHTML = "";
  no_res.innerHTML = "";

  if (nombre === "") {
    no_res.innerHTML = "<p>Por favor ingresa un nombre para buscar.</p>";
    pagination.innerHTML = "";
    return;
  }

  const resultados = todosLosPersonajes
    .filter(p => p.Nombre.toLowerCase().startsWith(nombre))
    .sort((a, b) => a.Nombre.localeCompare(b.Nombre));

  if (resultados.length === 0) {
    no_res.innerHTML = "<p>No se encontró ningún personaje. :(</p>";
    pagination.innerHTML = "";
    return;
  }

  resultados.forEach(personaje => {
    container.innerHTML += renderCharacterCard(personaje);
  });

  pagination.innerHTML = "";
}