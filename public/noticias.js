let noticiasCargadas = 0;
const noticiasPorLote = 8;
let todasLasNoticias = [];

fetch('noticias.json')
  .then(res => res.json())
  .then(noticias => {
    todasLasNoticias = noticias;
    mostrarNoticias();
  })
  .catch(error => console.error("Error al cargar las noticias:", error));

function mostrarNoticias() {
  const contenedor = document.getElementById("contenedor-noticias");
  const siguienteLote = todasLasNoticias.slice(noticiasCargadas, noticiasCargadas + noticiasPorLote);

  siguienteLote.forEach(noticia => {
    const card = document.createElement("div");
    card.className = "noticia";
    card.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}" class="noticia-imagen">
      <h3>${noticia.titulo}</h3>
      <p>${noticia.descripcion}</p>
      <span class="fecha">${noticia.fecha}</span>
      <a href="noticia.html?id=${noticia.id}" class="btn-leer">Seguir leyendo</a>
    `;
    contenedor.appendChild(card);
  });

  noticiasCargadas += noticiasPorLote;

  if (noticiasCargadas >= todasLasNoticias.length) {
    document.getElementById("btn-cargar-mas").style.display = "none";
  }
}

document.getElementById("btn-cargar-mas").addEventListener("click", mostrarNoticias);
