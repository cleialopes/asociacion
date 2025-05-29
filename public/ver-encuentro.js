function traducir(clave) {
  const traducciones = {
    volver: {
      es: "Volver a encuentros",
      eu: "Topaketetara itzuli",
      en: "Back to gatherings"
    }
  };
  const idioma = localStorage.getItem("idioma") || "es";
  return traducciones[clave]?.[idioma] || clave;
}

function mostrarEncuentro(lang) {
  const idioma = lang || localStorage.getItem("idioma") || "es";
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  fetch("encuentros.json")
    .then(res => res.json())
    .then(encuentros => {
      const encuentro = encuentros.find(e => e.id === id);
      if (!encuentro) {
        document.getElementById("contenido-encuentro").innerHTML = "<p>Encuentro no encontrado.</p>";
        return;
      }

      const titulo = encuentro.titulo?.[idioma] || encuentro.titulo?.es || "Sin título";
      const descripcion = encuentro.descripcion?.[idioma] || encuentro.descripcion?.es || "";
      const imagenes = encuentro.imagenes || [];
      const fotografo = encuentro.fotografo || "";
      const fecha = encuentro.fecha || "";

      const galeriaHTML = imagenes.length > 0
        ? `<div class="carrusel">
            <button class="carrusel-flecha izquierda">‹</button>
            <div class="carrusel-contenedor">
              ${imagenes.map((src, index) => `
                <img src="${src}" alt="${titulo}" class="carrusel-imagen ${index === 0 ? 'activa' : ''}">
              `).join('')}
            </div>
            <button class="carrusel-flecha derecha">›</button>
          </div>`
        : "";

      const contenedor = document.getElementById("contenido-encuentro");
      contenedor.innerHTML = `
        <h1>${titulo}</h1>
        <p class="descripcion">${descripcion}</p>
        ${galeriaHTML}
        ${fotografo ? `<p class="fotografo">Foto: ${fotografo}</p>` : ""}
        <p class="fecha">${fecha}</p>
        <a href="encuentros.html" class="btn-leer">← ${traducir("volver")}</a>
      `;

      const imagenesCarrusel = document.querySelectorAll(".carrusel-imagen");
      const flechaIzquierda = document.querySelector(".carrusel-flecha.izquierda");
      const flechaDerecha = document.querySelector(".carrusel-flecha.derecha");

      if (imagenesCarrusel.length > 0 && flechaIzquierda && flechaDerecha) {
        let indice = 0;
        let intervalo;

        const mostrarImagen = (i) => {
          imagenesCarrusel.forEach((img, index) =>
            img.classList.toggle("activa", index === i)
          );
        };

        const avanzar = () => {
          indice = (indice + 1) % imagenesCarrusel.length;
          mostrarImagen(indice);
        };

        const retroceder = () => {
          indice = (indice - 1 + imagenesCarrusel.length) % imagenesCarrusel.length;
          mostrarImagen(indice);
        };

        const iniciarCarrusel = () => {
          if (intervalo) clearInterval(intervalo);
          intervalo = setInterval(avanzar, 4000);
        };

        flechaIzquierda.addEventListener("click", () => {
          retroceder();
          iniciarCarrusel();
        });

        flechaDerecha.addEventListener("click", () => {
          avanzar();
          iniciarCarrusel();
        });

        iniciarCarrusel();
      }
    })
    .catch(err => {
      document.getElementById("contenido-encuentro").innerHTML = "<p>Error cargando el encuentro.</p>";
      console.error(err);
    });
}
mostrarEncuentro();