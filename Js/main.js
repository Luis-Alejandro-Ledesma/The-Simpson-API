const container = document.getElementById("characters-container");
const pagination = document.getElementById("pagination");
let currentPage = 1;
const limit = 50;
let allCharacters = [];

// Toggle del menú de filtros
const filterToggle = document.getElementById("filter-toggle");
const filterOptions = document.getElementById("filter-options");

filterToggle.addEventListener("click", () => {
  filterOptions.classList.toggle("hidden");
});

// Función para renderizar tarjeta
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

// Redirigir a vista individual
function verDetalles(nombre) {
  const nombreParam = encodeURIComponent(nombre);
  window.location.href = `character.html?nombre=${nombreParam}`;
}

// Cargar personajes
function loadCharacters(page = 1) {
  const API_URL = `https://apisimpsons.fly.dev/api/personajes?limit=${limit}&page=${page}`;
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allCharacters = data.docs;
      displayCharacters(allCharacters);
      renderPagination(page, data.totalPages || 10);
    })
    .catch(err => {
      console.error("Error al cargar personajes:", err);
      container.innerHTML = "<p>Error al cargar los personajes.</p>";
    });
}

function displayCharacters(list) {
  container.innerHTML = "";
  list.forEach(character => {
    container.innerHTML += renderCharacterCard(character);
  });
}

// Renderizar paginación
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

// Aplicar filtros
document.getElementById("applyFilters").addEventListener("click", () => {
  const estado = document.getElementById("estado").value;
  const ocupacion = document.getElementById("ocupacion").value.toLowerCase();
  const genero = document.getElementById("genero").value;

  const filtered = allCharacters.filter(p => {
    const matchEstado = estado ? p.Estado === estado : true;
    const matchGenero = genero ? p.Genero === genero : true;
    const matchOcupacion = ocupacion ? p.Ocupacion.toLowerCase().includes(ocupacion) : true;
    return matchEstado && matchGenero && matchOcupacion;
  });

  displayCharacters(filtered);
  pagination.innerHTML = ""; // quitar paginación en vista filtrada
});

// Buscador
const inputBusqueda = document.getElementById("name-filter");
const botonBuscar = document.getElementById("buscador");
const autocompleteList = document.getElementById("autocompleteList");

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
    if (!inputBusqueda.contains(e.target) && !autocompleteList.contains(e.target)) {
      autocompleteList.innerHTML = "";
    }
  }, 100);
});

function mostrarSugerencias(query) {
  autocompleteList.innerHTML = "";

  let sugerencias = [];
  if (query.length === 0) {
    sugerencias = [...allCharacters].sort(() => Math.random() - 0.5).slice(0, 3);
  } else {
    sugerencias = allCharacters
      .filter(p => p.Nombre.toLowerCase().startsWith(query))
      .slice(0, 3);
  }

  if (sugerencias.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin coincidencias";
    li.style.color = "#888";
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

  if (nombre === "") {
    pagination.innerHTML = "";
    return;
  }

  const resultados = allCharacters.filter(p =>
    p.Nombre.toLowerCase().startsWith(nombre)
  );

  if (resultados.length === 0) {
    container.innerHTML = "<p>No se encontró ningún personaje.</p>";
    pagination.innerHTML = "";
    return;
  }

  displayCharacters(resultados);
  pagination.innerHTML = "";
}

loadCharacters();