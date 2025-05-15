let noticiasCargadas = 0;
const noticiasPorLote = 8;
let todasLasNoticias = [];

const idioma = localStorage.getItem("idioma") || "es";

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
    const titulo = noticia.titulo[idioma] || noticia.titulo["es"];
    const descripcion = noticia.descripcion[idioma] || noticia.descripcion["es"];
    const imagen = noticia.imagenes?.[0] || "img/imagen-defecto.webp";
    const fotografo = noticia.fotografo || "";

    const card = document.createElement("div");
    card.className = "noticia";
    card.innerHTML = `
  <img src="${imagen}" alt="${titulo}" class="noticia-imagen">
  <h3><a href="ver-noticia.html?id=${noticia.id}">${titulo}</a></h3>
`;
    contenedor.appendChild(card);
  });

  noticiasCargadas += noticiasPorLote;

  if (noticiasCargadas >= todasLasNoticias.length) {
    document.getElementById("btn-cargar-mas").style.display = "none";
  }
}

document.getElementById("btn-cargar-mas").addEventListener("click", mostrarNoticias);

function traducir(clave) {
  const traducciones = {
    leer_mas: {
      es: "Seguir leyendo",
      eu: "Irakurri gehiago",
      en: "Read more"
    }
  };
  return traducciones[clave]?.[idioma] || clave;
}
