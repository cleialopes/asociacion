window.etiquetas = window.etiquetas || {
  programa: {
    es: "Programa",
    eu: "Programa",
    en: "Program"
  },
  cartel: {
    es: "Cartel",
    eu: "Kartela",
    en: "Poster"
  },
  memoria: {
    es: "Memoria",
    eu: "Txostena",
    en: "Report"
  }
};
function cargarRevistas() {
  const idioma = localStorage.getItem("idioma") || "es";
  fetch("revista.json")
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("lista-revistas");
      contenedor.innerHTML = ""; // Limpiar antes de volver a cargar

      data.forEach(revista => {
        const div = document.createElement("div");
        div.className = "revista modo-claro-oscuro";
        div.innerHTML = `
          <img src="${revista.portada}" alt="${revista.titulo[idioma]}" class="portada-revista" data-pdf="${revista.archivo}">
          <h2>${revista.titulo[idioma] || revista.titulo["es"]}</h2>
        `;
        contenedor.appendChild(div);
      });

      document.querySelectorAll(".portada-revista").forEach(img => {
        img.addEventListener("click", () => {
          const archivo = img.getAttribute("data-pdf");
          if (!archivo) return;
          const visor = document.getElementById("visor-flowpaper");
          const contenedorFlip = document.getElementById("flipbook-container");
          visor.classList.remove("oculto");
          contenedorFlip.innerHTML = `
            <iframe 
              src="FlowPaper/index.html?PDF=/${archivo}"
              style="width:100%; height:100%; border:none; overflow:hidden;" 
              scrolling="no">
            </iframe>
          `;
        });
      });
    });
}

function cargarDocumentos() {
  const idioma = localStorage.getItem("idioma") || "es";
  fetch("documentos.json")
    .then(res => res.json())
    .then(data => {
      const columnas = {
        programa: document.querySelector('.columna:nth-child(1) ul'),
        cartel: document.querySelector('.columna:nth-child(2) ul'),
        memoria: document.querySelector('.columna:nth-child(3) ul')
      };

      columnas.programa.innerHTML = "";
      columnas.cartel.innerHTML = "";
      columnas.memoria.innerHTML = "";

      data.forEach(doc => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${etiquetas[doc.tipo][idioma]} ${doc.anio}</span>
          <ul class="idiomas">
            ${doc.archivos[idioma] 
              ? `<li><a href="${doc.archivos[idioma]}" target="_blank">${idioma.toUpperCase()}</a></li>` 
              : Object.entries(doc.archivos).map(([lang, path]) =>
                  `<li><a href="${path}" target="_blank">${lang.toUpperCase()}</a></li>`
                ).join('')}
          </ul>
        `;
        columnas[doc.tipo].appendChild(li);
      });
    });
}
document.addEventListener('DOMContentLoaded', () => {
  if (typeof cargarDocumentos === 'function') {
    cargarDocumentos();
  }
});