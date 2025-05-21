const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const idioma = localStorage.getItem("idioma") || "es";

fetch("encuentros.json")
  .then(res => res.json())
  .then(encuentros => {
    const encuentro = encuentros.find(e => e.id === id);
    const contenedor = document.getElementById("contenido-encuentro");

    if (encuentro) {
      const titulo = encuentro.titulo?.[idioma] || encuentro.titulo?.es || "";
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

      contenedor.innerHTML = `
        <h1>${titulo}</h1>
        <p class="descripcion">${descripcion}</p>
        ${galeriaHTML}
        ${fotografo ? `<p class="fotografo">Foto: ${fotografo}</p>` : ""}
        <p class="fecha">${fecha}</p>
        <a href="encuentros.html" class="btn-leer">← ${traducir("volver")}</a>
      `;

      // Carrusel funcional
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

  const detenerCarrusel = () => {
    if (intervalo) clearInterval(intervalo);
  };

  flechaIzquierda.addEventListener("click", () => {
    retroceder();
    iniciarCarrusel(); // Reinicia intervalo después del clic
  });

  flechaDerecha.addEventListener("click", () => {
    avanzar();
    iniciarCarrusel();
  });

  // Iniciar automáticamente al cargar
  iniciarCarrusel();
}

    } else {
      contenedor.innerHTML = "<p>Encuentro no encontrado.</p>";
    }
  })
  .catch(err => {
    document.getElementById("contenido-encuentro").innerHTML = "<p>Error cargando el encuentro.</p>";
    console.error(err);
  });

function traducir(clave) {
  const traducciones = {
    volver: {
      es: "Volver a encuentros",
      eu: "Topaketetara itzuli",
      en: "Back to gatherings"
    }
  };
  return traducciones[clave]?.[idioma] || clave;
}
