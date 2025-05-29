fetch("revista.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("lista-revistas");
    data.forEach(revista => {
      const div = document.createElement("div");
      div.className = "revista modo-claro-oscuro";
      div.innerHTML = `
        <img src="${revista.portada}" alt="${revista.titulo}" class="portada-revista" data-pdf="${revista.archivo}">
        <h2>${revista.titulo}</h2>
      `;
      contenedor.appendChild(div);
    });

    // Abrir visor FlowPaper (con iframe)
    document.querySelectorAll(".portada-revista").forEach(img => {
      img.addEventListener("click", () => {
        const archivo = img.getAttribute("data-pdf");
        console.log("Imagen presionada. Archivo:", archivo);

        if (!archivo) {
          alert("Error: no se encontró el archivo.");
          return;
        }

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
  })
  .catch(error => console.error("Error cargando revistas:", error));

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cerrar-flowpaper").addEventListener("click", () => {
      document.getElementById("visor-flowpaper").classList.add("oculto");
      document.getElementById("flipbook-container").innerHTML = "";
    });
});