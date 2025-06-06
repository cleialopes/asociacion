document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("scroll-anios");
  let anioActivo = null;

  const diccionario = {
    es: {
      "Ganadora": "Ganadora",
      "New Directors": "New Directors",
      "Horizontes Latinos": "Horizontes Latinos",
      "Zabaltegi": "Zabaltegi",
      "Perlak": "Perlak",
      "Made in Spain": "Made in Spain",
      "Fuera de concurso": "Fuera de concurso",
      "No hay información para este año.": "No hay información para este año."
    },
    en: {
      "Ganadora": "Winner",
      "New Directors": "New Directors",
      "Horizontes Latinos": "Latin Horizons",
      "Zabaltegi": "Zabaltegi",
      "Perlak": "Perlak",
      "Made in Spain": "Made in Spain",
      "Fuera de concurso": "Out of Competition",
      "No hay información para este año.": "No information available for this year."
    },
    eu: {
      "Ganadora": "Irabazlea",
      "New Directors": "Zuzendari Berriak",
      "Horizontes Latinos": "Latino Horizontes",
      "Zabaltegi": "Zabaltegi",
      "Perlak": "Perlak",
      "Made in Spain": "Espainian Egina",
      "Fuera de concurso": "Lehiaketatik kanpo",
      "No hay información para este año.": "Urte honetarako informaziorik ez dago."
    }
  };

  function getIdiomaActual() {
    return document.getElementById("lang-selector")?.value || "es";
  }

  for (let anio = 2000; anio <= 2025; anio++) {
    const btn = document.createElement("button");
    btn.textContent = anio;
    btn.onclick = () => {
      document.querySelectorAll("#scroll-anios button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mostrarInfo(anio, true);
  };
    contenedor.appendChild(btn);
  }

  function mostrarInfo(anio, hacerScroll = true)  {
    anioActivo = anio;
    fetch("/api/sebastiane")
      .then(response => response.json())
      .then(data => {
        const idioma = getIdiomaActual();
        const traduccion = diccionario[idioma] || diccionario["es"];
        const info = data[anio];
        const contenedor = document.getElementById("contenido-anio-sebastiane");

        if (!info) {
          contenedor.innerHTML = `<h2>${anio}</h2><p>${traduccion["No hay información para este año."]}</p>`;
          return;
        }

        let html = `<h2>${anio}</h2>`;

        for (const seccion in info) {
          if (info[seccion].length > 0) {
            const tituloTraducido = traduccion[seccion] || seccion;
            html += `<h2>${tituloTraducido}</h2>`;
            html += `<div class=\"peliculas-seccion\">`;

            info[seccion].forEach(pelicula => {
              const img = pelicula.imagen || "img/default.jpg";

              const titulo = typeof pelicula.titulo === "object"
                ? pelicula.titulo[idioma] || pelicula.titulo["es"]
                : pelicula.titulo;

              const descripcion = typeof pelicula.descripcion === "object"
                ? pelicula.descripcion[idioma] || pelicula.descripcion["es"]
                : pelicula.descripcion;

              const director = typeof pelicula.director === "object"
                ? pelicula.director[idioma] || pelicula.director["es"]
                : pelicula.director;

              const pais = typeof pelicula.pais === "object"
                ? pelicula.pais[idioma] || pelicula.pais["es"]
                : pelicula.pais;

              html += `
                <div class="pelicula">
                  <a href="detalle.html?id=${pelicula.id}&fuente=sebastiane">
                    <img src="${img}" alt="${titulo}">
                  </a>
                  <h4>${titulo}</h4>
                </div>
              `;
            });

            html += `</div>`;
          }
        }

          contenedor.innerHTML = html;
       if (hacerScroll) {
          contenedor.scrollIntoView({ behavior: "smooth" });
        }
      });
  }

  document.getElementById("lang-selector")?.addEventListener("change", () => {
    if (anioActivo) {
      mostrarInfo(anioActivo, false); // ✅ sin scroll
    }
  });

  document.querySelector(".flecha.izquierda").addEventListener("click", () => {
    document.getElementById("scroll-anios").scrollLeft -= 200;
  });

  document.querySelector(".flecha.derecha").addEventListener("click", () => {
    document.getElementById("scroll-anios").scrollLeft += 200;
  });

  const anioActual = new Date().getFullYear();
  const anioPorDefecto = (anioActual >= 2000 && anioActual <= 2025) ? anioActual : 2024;
  anioActivo = anioPorDefecto;

  window.addEventListener("load", () => {
    mostrarInfo(anioPorDefecto, false); 
  });
});

fetch("/api/banner")
  .then(res => res.json())
  .then(data => {
    if (data.url) {
      const banner = document.getElementById("banner-sebastiane");
      if (!banner) return;
      banner.classList.remove("oculto");

      if (data.tipo === "imagen") {
        banner.innerHTML = `<img src="${data.url}" alt="Banner" />`;
      } else if (data.tipo === "video") {
        banner.innerHTML = `
          <video autoplay muted loop playsinline>
            <source src="${data.url}" type="video/mp4">
            Tu navegador no admite el video.
          </video>`;

        const video = banner.querySelector("video");
        video.addEventListener("pause", () => video.play());
      }
    }
  });

