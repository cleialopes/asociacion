document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tituloBuscado = params.get("titulo");
  const idioma = document.getElementById("lang-selector")?.value || "es";

  fetch("/api/sebastiane")
    .then(res => res.json())
    .then(data => {
      let pelicula = null;

      for (const anio in data) {
        for (const seccion in data[anio]) {
          for (const item of data[anio][seccion]) {
            const titulo = typeof item.titulo === "object" ? item.titulo[idioma] || item.titulo.es : item.titulo;
            if (titulo === tituloBuscado) {
              pelicula = item;
              break;
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
      const director = pelicula.director[idioma] || pelicula.director.es;
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
        return url; // retorna tal cual si ya es embed u otro tipo
        }

        const video = convertirAEmbed(pelicula.video);

      contenedor.innerHTML = `
  <img src="${img}" alt="${titulo}" />
  <ul class="ficha-pelicula">
    <li><strong>Título:</strong> ${titulo}</li>
    <li><strong>Director:</strong> ${director}</li>
    <li><strong>País:</strong> ${pais}</li>
    <li><strong>Año:</strong> ${pelicula.año}</li>
    <li><strong>Sinopsis:</strong> ${descripcion}</li>
  </ul>
  ${video ? `
    <h2>Trailer</h2>
    <div class="video-contenedor">
      <iframe src="${video}" frameborder="0" allowfullscreen></iframe>
    </div>` : ""}
`;
    });
});