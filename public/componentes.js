// Header 
document.getElementById('header').innerHTML = `
  <header class="header">
    <div class="contenedor-header">
      <div class="header-left">
        <button id="menu-toggle" class="hamburguesa" aria-label="Abrir menú">
          <i class="fa-solid fa-bars"></i>
        </button>
        <select id="lang-selector">
          <option value="es">ES</option>
          <option value="eu">EU</option>
          <option value="en">EN</option>
        </select>
        <button id="modo-toggle" class="modo-toggle" aria-label="Cambiar modo">
          <i class="fa-solid fa-moon"></i>
        </button>
      </div>
      <div class="header-right">
        <a href="index.html" class="titulo-principal">Premio Sebastiane</a>
        <a href="index.html" class="titulo-principal fecha-evento">19-27/09/2025</a>
      </div>
    </div>

    <div id="menu-desplegable" class="menu-desplegable oculto">
      <nav class="menu-column">
        <div class="menu-info">
          <a class="enlace-info">
            <span data-i18n="menu.info">Info</span>
            <span class="flecha-info">▼</span>
          </a>
          <div class="submenu">
            <a href="nosotros.html">Nosotros</a>
            <a href="voluntaries.html">Voluntaries</a>
          </div>
        </div>
        <a href="sebastiane.html" data-i18n="menu.sebastiane">Sebastiane</a>
        <a href="sebastiane_latino.html" data-i18n="menu.latino">Sebastiane Latino</a>
        <a href="encuentros.html" data-i18n="menu.encuentros">Encuentros</a>
        <a href="noticias.html" data-i18n="menu.noticias">Noticias</a>
        <a href="revistas.html" data-i18n="menu.revista">Revista</a>
      </nav>
    </div>
  </header>
`;

// Footer 
document.getElementById('footer').innerHTML = `
  <footer class="footer">
    <div class="footer-contenedor">

      <!-- Logo -->
      <div class="footer-logo">
        <a href="index.html">
          <img src="img/logo1.png" alt="Logo Premio Sebastiane" class="logo-footer" />
        </a>
      </div>

      <!-- Columnas agrupadas -->
      <div class="footer-columnas">
        <div class="footer-col">
          <h2 class="footer-titulo" data-i18n="footer.contacto">Contacto</h2>
          <p><a href="mailto:info@premiosebastiane.com" data-i18n="email">Email: info@premiosebastiane.com</a></p>
          <p>Tel: Prensa +34 606 270 229</p>
          <p>Dirección: Premio Sebastiane – GEHITU<br>Kolon 50, 20002 Donostia / San Sebastián</p>
        </div>
        <div class="footer-col">
          <h2 class="footer-titulo" data-i18n="footer.companeros">Compañeros de viaje</h2>
          <ul>
            <li><a href="https://www.gehitu.org/" target="_blank">Gehitu →</a></li>
            <li><a href="https://www.sansebastianfestival.com/es/" target="_blank">Festival de San Sebastián →</a></li>
            <li><a href="https://mugengainetik.org/" target="_blank">Mugen gainetik →</a></li>
            <li><a href="https://www.igualdad.gob.es/" target="_blank">Ministerio de Igualdad →</a></li>
            <li><a href="https://www.accioncultural.es/" target="_blank">Acción Cultural Española →</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-titulo" data-i18n="footer.redes">Redes sociales</h2>
          <div class="social-icons">
            <a href="https://www.facebook.com/premiosebastiane/" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://x.com/sebastianeaward" target="_blank"><i class="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com/premiosebastiane/" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/channel/UCUlFl78JAqWMObOJ5plFvZQ/featured" target="_blank"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

    </div>

    <div class="footer-copy">
      <p>&copy; ${new Date().getFullYear()} Premio SEBASTIANE</p>
    </div>
  </footer>
`;

function crearGrupoPatrocinadores(tituloClave, lista) {
  if (!lista || lista.length === 0) return '';
  
  let html = `<h2 data-i18n="${tituloClave}">${tituloClave}</h2>`;
  html += `<div class="patrocinadores-grupo">`;

  lista.forEach(p => {
    html += `
      <div class="patrocinador">
        <a href="${p.href}" target="_blank">
          <img src="${p.img}" alt="${p.alt}">
        </a>
      </div>`;
  });

  html += `</div>`;
  return html;
}

fetch("patrocinadores.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("patrocinadores");
    contenedor.innerHTML =
      crearGrupoPatrocinadores("organizadores", data.organizadores) +
      `<div id="carrusel-patrocinadores"></div>`;

    renderCarruselPersonalizado([...data.patrocinios, ...data.colaboradores]);
  });

  function renderCarruselPersonalizado(lista) {
  const contenedor = document.getElementById("carrusel-patrocinadores");
  if (!contenedor) return;

  let html = `
    <h2 data-i18n="patrocinios_colaboradores">Patrocinios y Colaboradores</h2>
    <div class="carrusel">
      <button class="carrusel-prev">&#10094;</button>
      <div class="carrusel-contenido">`;

  lista.forEach(p => {
    html += `
      <div class="carrusel-slide">
        <a href="${p.href}" target="_blank"><img src="${p.img}" alt="${p.alt}" /></a>
      </div>`;
  });

  html += `</div>
      <button class="carrusel-next">&#10095;</button>
      <div class="carrusel-bullets"></div>
    </div>`;

  contenedor.innerHTML = html;

  const slidesPerPage = 3;
  const slides = contenedor.querySelectorAll(".carrusel-slide");
  const totalPages = Math.ceil(slides.length / slidesPerPage);
  const contenidoSlides = contenedor.querySelector(".carrusel-contenido");
  const bullets = contenedor.querySelector(".carrusel-bullets");

let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % totalPages;
  actualizarVista();
}, 5000);

  function actualizarVista() {
    contenidoSlides.style.transform = `translateX(-${slideIndex * 100}%)`;
    bullets.querySelectorAll("span").forEach((b, i) => {
      b.classList.toggle("activo", i === slideIndex);
    });
  }

  slides.forEach((_, i) => {
    const span = document.createElement("span");
    span.addEventListener("click", () => {
      slideIndex = i;
      actualizarVista();
    });
    bullets.appendChild(span);
  });

  contenedor.querySelector(".carrusel-prev").addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + totalPages) % totalPages;
    actualizarVista();
  });

  contenedor.querySelector(".carrusel-next").addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % totalPages;
    actualizarVista();
  });

  actualizarVista();
}


document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu-desplegable");
  const modoToggle = document.getElementById("modo-toggle");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("oculto");
    });

    document.addEventListener("click", function(event) {
      if (!menu.classList.contains("oculto") &&
          !menu.contains(event.target) &&
          !toggle.contains(event.target)) {
        menu.classList.add("oculto");
      }
    });
  }

  if (localStorage.getItem('modo') === 'oscuro') {
    document.body.classList.add('dark-mode');
    if (modoToggle) {
      modoToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }

  if (modoToggle) {
    modoToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const oscuro = document.body.classList.contains("dark-mode");
      modoToggle.innerHTML = oscuro
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('modo', oscuro ? 'oscuro' : 'claro');
    });
  }
    const infoEnlace = document.querySelector('.menu-info > a');
    const infoBloque = document.querySelector('.menu-info');

    if (infoEnlace && infoBloque) {
      infoEnlace.addEventListener('click', (e) => {
        e.preventDefault(); 
        infoBloque.classList.toggle('mostrar-submenu');
      });
    }
});
