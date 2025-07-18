const container = document.getElementById("characters-container");
const paginationTop = document.getElementById('pagination-top');
const paginationBottom = document.getElementById('pagination-bottom');
const no_res = document.getElementById("no_res");
const inputBusqueda = document.getElementById("name-filter");
const botonBuscar = document.getElementById("buscador");
const autocompleteList = document.getElementById("autocompleteList");
const loading = document.getElementById("loading");

let currentPage = 1;
const limit = 50;
let allCharacters = [];
let filteredCharacters = [];

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

async function loadAllCharacters() {
  loading.style.display = "block"; 
  container.innerHTML = "";

  let page = 1;
  let hasMore = true;
  allCharacters = [];

    const API_URL = `https://apisimpsons.fly.dev/api/personajes?limit=676`;
    const res = await fetch(API_URL);
    const data = await res.json();
    allCharacters = allCharacters.concat(data.docs);
console.log(allCharacters);
    if (data.docs.length < 50) {
      hasMore = false;
    } else {
      page++;
    }
  
allCharacters.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  filteredCharacters = allCharacters;
  displayCharacters(filteredCharacters, 1);
  loading.style.display = "none"; 
}

function displayCharacters(array, page) {
  currentPage = page;
  container.innerHTML = "";

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = array.slice(start, end);

  paginated.forEach(character => {
    container.innerHTML += renderCharacterCard(character);
  });

  renderPagination(array.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / limit);

    paginationTop.innerHTML = "";
    paginationBottom.innerHTML = "";

    if (totalPages <= 1) return;
    let paginationHTML = "";

    if (currentPage > 1) {
        paginationHTML += `<button onclick="displayCharacters(filteredCharacters, ${currentPage - 1})">&laquo;</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `<button onclick="displayCharacters(filteredCharacters, ${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="displayCharacters(filteredCharacters, ${currentPage + 1})">&raquo;</button>`;
    }
    paginationTop.innerHTML = paginationHTML;
    paginationBottom.innerHTML = paginationHTML;
}


function aplicarFiltros() {
  const estado = document.getElementById("estado").value;
  const ocupacion = document.getElementById("ocupacion").value.toLowerCase().trim();
  const genero = document.getElementById("genero").value;

  filteredCharacters = allCharacters.filter(character => {
    const matchEstado = estado === "" || character.Estado === estado;
    const matchGenero = genero === "" || character.Genero === genero;
    const matchOcupacion =
      ocupacion === "" ||
      (character.Ocupacion && character.Ocupacion.toLowerCase().includes(ocupacion));

    return matchEstado && matchGenero && matchOcupacion;
  });

  if (filteredCharacters.length === 0) {
    container.innerHTML = "";
    no_res.innerHTML = "<p>No se encontraron personajes con esos filtros.</p>";
    paginationTop.innerHTML = "";
    paginationBottom.innerHTML = "";
  } else {
    displayCharacters(filteredCharacters, 1);
  }
  return;
}

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
});
botonBuscar.addEventListener("click", buscarPersonaje);
    autocompleteList.appendChild(li);
  });
}
no_res.innerHTML = "";

function buscarPersonaje() {
  const nombre = inputBusqueda.value.toLowerCase().trim();
  container.innerHTML = "";
  autocompleteList.innerHTML = "";
  no_res.innerHTML = "";

  if (nombre === "") {
    no_res.innerHTML = "<p>Por favor ingresa un nombre para buscar.</p>";
    paginationTop.innerHTML = "";
    paginationBottom.innerHTML = "";
    return;
  }

  const resultados = allCharacters
    .filter(p => p.Nombre.toLowerCase().startsWith(nombre))
    .sort((a, b) => a.Nombre.localeCompare(b.Nombre));

  if (resultados.length === 0) {
    no_res.innerHTML = "<p>No se encontró ningún personaje. :(</p>";
    paginationTop.innerHTML = "";
    paginationBottom.innerHTML = "";
    return;
  }

  filteredCharacters = resultados;
  displayCharacters(filteredCharacters, 1);
}

document.getElementById("applyFilters").addEventListener("click", aplicarFiltros);

document.getElementById("filter-toggle").addEventListener("click", () => {
  const options = document.getElementById("filter-options");
  options.classList.toggle("hidden");
});

inputBusqueda.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  mostrarSugerencias(query);
});

inputBusqueda.addEventListener("mousedown", function () {
  const query = this.value.toLowerCase().trim();
  mostrarSugerencias(query);
});

document.addEventListener("mousedown", function (e) {
  if (!inputBusqueda.contains(e.target) && !autocompleteList.contains(e.target)) {
    autocompleteList.innerHTML = "";
  }
});


loadAllCharacters();
window.addEventListener("pageshow", function (event) {
  const navType = performance.getEntriesByType("navigation")[0]?.type;
  if (event.persisted || navType === "back_forward") {
    window.location.reload(); 
  }
});