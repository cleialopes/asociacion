function traducir(clave) {
  const idioma = localStorage.getItem("idioma") || "es";
  if (!window.traducciones || !window.traducciones[idioma]) return clave;
  return window.traducciones[idioma][clave] || clave;
}
function mostrarDetalle(tituloBuscado, idioma, fuente) {
  fetch(`/api/${fuente}`)
    .then(res => res.json())
    .then(data => {
      let pelicula = null;

      for (const anio in data) {
        for (const seccion in data[anio]) {
          for (const item of data[anio][seccion]) {
            if (item.id === tituloBuscado) {
              pelicula = item;
            }
          }
          if (pelicula) break;
        }
        if (pelicula) break;
      }

      const contenedor = document.getElementById("detalle-pelicula");

      if (!pelicula) {
        contenedor.innerHTML = "<p>Película no encontrada.</p>";
        return;
      }

      const img = pelicula.imagen || "img/default.jpg";
      const titulo = pelicula.titulo[idioma] || pelicula.titulo.es;
      const director = typeof pelicula.director === "object"
  ? (pelicula.director[idioma] || pelicula.director.es || "")
  : pelicula.director;
      const pais = pelicula.pais[idioma] || pelicula.pais.es;
      const descripcion = pelicula.descripcion[idioma] || pelicula.descripcion.es;

      function convertirAEmbed(url) {
        if (!url) return "";
        if (url.includes("youtube.com/watch?v=")) {
          return url.replace("watch?v=", "embed/");
        }
        if (url.includes("youtu.be/")) {
          return url.replace("youtu.be/", "www.youtube.com/embed/");
        }
        return url;
      }

      const video = convertirAEmbed(pelicula.video);

      contenedor.innerHTML = `
        <img src="${img}" alt="${titulo}" />
        <ul class="ficha-pelicula">
          <li><strong>${traducir("titulo")}</strong> ${titulo}</li>
          <li><strong>${traducir("director")}</strong> ${director}</li>
          <li><strong>${traducir("pais")}</strong> ${pais}</li>
          <li><strong>${traducir("anio")}</strong> ${pelicula.año}</li>
          <li><strong>${traducir("sinopsis")}</strong> ${descripcion}</li>
        </ul>
        ${video ? `
          <h2>${traducir("trailer")}</h2>
          <div class="video-contenedor">
            <iframe src="${video}" frameborder="0" allowfullscreen></iframe>
          </div>` : ""}
        <a href="javascript:history.back()" class="btn-leer">← ${traducir("volver")}</a>
      `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const fuente = params.get("fuente") === "latino" ? "sebastiane_latino" : "sebastiane";
  const idioma = localStorage.getItem("idioma") || "es";

  // Ejecutar de inmediato
  mostrarDetalle(id, idioma, fuente);

  // Si el usuario cambia el idioma manualmente después, volver a mostrar traducido
  const selector = document.getElementById("selector-idioma");
  if (selector) {
    selector.addEventListener("change", () => {
      const nuevoIdioma = selector.value;
      localStorage.setItem("idioma", nuevoIdioma);
      mostrarDetalle(id, nuevoIdioma, fuente);
    });
  }
});

document.getElementById("lang-selector")?.addEventListener("change", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const fuente = params.get("fuente") === "latino" ? "sebastiane_latino" : "sebastiane";
  const nuevoIdioma = document.getElementById("lang-selector").value;
  mostrarDetalle(id, nuevoIdioma, fuente);
});
window.mostrarDetalle = mostrarDetalle;
