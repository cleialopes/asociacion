document.addEventListener("DOMContentLoaded", () => {
  const infoPorAnio = {
    2000: "Información del año 2000...",
    2001: "Contenido para 2001...",
    2002: "Datos de 2002...",
    2023: "Premios Sebastiane en la edición 2023...",
    2025: "Celebración especial 25 aniversario en 2025."
  };

  const contenedor = document.getElementById("scroll-anios");

  // Generar los botones dos veces para simular bucle infinito
  for (let i = 0; i < 2; i++) {
    for (let anio = 2000; anio <= 2025; anio++) {
      const btn = document.createElement("button");
      btn.textContent = anio;
      btn.onclick = () => mostrarInfo(anio);
      contenedor.appendChild(btn);
    }
  }

  function mostrarInfo(anio) {
  fetch("sebastiane.json")
    .then(response => response.json())
    .then(data => {
      const info = data[anio];
      const contenedor = document.getElementById("contenido-anio-sebastiane");
      if (!info) {
        contenedor.innerHTML = `<h2>${anio}</h2><p>No hay información para este año.</p>`;
        return;
      }

      let html = `<h2>${anio}</h2>`;

      for (const seccion in info) {
        if (info[seccion].length > 0) {
          html += `<h3>${seccion}</h3>`;
          html += `<div class="peliculas-seccion">`;

          info[seccion].forEach(pelicula => {
            html += `
              <div class="pelicula">
                <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
                <div>
                  <h4>${pelicula.titulo}</h4>
                  <p><strong>${pelicula.director}</strong> – ${pelicula.pais}</p>
                  <p>${pelicula.descripcion}</p>
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

  // Scroll infinito con pausa al pasar el ratón
  const scrollContainer = document.getElementById("scroll-anios");
  let scrollStep = 1;
  let autoScrollInterval;

  function iniciarScroll() {
    autoScrollInterval = setInterval(() => {
      scrollContainer.scrollLeft += scrollStep;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
    }, 15);
  }

  function detenerScroll() {
    clearInterval(autoScrollInterval);
  }

  iniciarScroll();

  scrollContainer.addEventListener("mouseenter", detenerScroll);
  scrollContainer.addEventListener("mouseleave", iniciarScroll);

  document.querySelector(".flecha.izquierda").addEventListener("click", () => {
  scrollContainer.scrollLeft -= 200;
});

document.querySelector(".flecha.derecha").addEventListener("click", () => {
  scrollContainer.scrollLeft += 200;
});
});
