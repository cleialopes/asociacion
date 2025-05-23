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

  for (let anio = 2013; anio <= 2025; anio++) {
    const btn = document.createElement("button");
    btn.textContent = anio;
    btn.onclick = () => {
      document.querySelectorAll("#scroll-anios button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mostrarInfo(anio);
    };
    contenedor.appendChild(btn);
  }

  function mostrarInfo(anio) {
    anioActivo = anio;
    fetch("/api/sebastiane_latino")
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
            html += `<div class="peliculas-seccion">`;

            info[seccion].forEach(pelicula => {
              const img = pelicula.imagen;

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
                <div class="pelicula modo-claro-oscuro">
                  <img src="${img}" alt="${titulo}">
                  <div>
                    <h4>${titulo}</h4>
                    <p><em>${pelicula.año}</em></p>
                    <p><strong>${director}</strong> – ${pais}</p>
                    <p>${descripcion}</p>
                  </div>
                </div>
              `;
            });

            html += `</div>`;
          }
        }

        contenedor.innerHTML = html;
        contenedor.scrollIntoView({ behavior: "smooth" });
      });
  }

  document.getElementById("lang-selector")?.addEventListener("change", () => {
    if (anioActivo) {
      mostrarInfo(anioActivo);
    }
  });

  document.querySelector(".flecha.izquierda").addEventListener("click", () => {
    document.getElementById("scroll-anios").scrollLeft -= 200;
  });

  document.querySelector(".flecha.derecha").addEventListener("click", () => {
    document.getElementById("scroll-anios").scrollLeft += 200;
  });

 const params = new URLSearchParams(window.location.search);
const anioURL = parseInt(params.get("anio")) || 2024;

mostrarInfo(anioURL);
anioActivo = anioURL;

// Activar botón del año correspondiente (opcional, solo para destacar el botón activo)
const btns = document.querySelectorAll("#scroll-anios button");
btns.forEach(btn => {
  if (parseInt(btn.textContent) === anioURL) {
    btn.classList.add("active");
  }
});
});
