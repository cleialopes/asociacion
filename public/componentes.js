// Header con clases aplicadas
document.getElementById('header').innerHTML = `
  <header class="header">
    <div class="contenedor-header">
      <a href="index.html">
        <img src="img/logo1.png" alt="Logo" class="logo" />
      </a>
      <nav class="menu">
        <a href="sebastiane.html" data-i18n="menu.sebastiane">Sebastiane</a>
        <a href="sebastiane_latino.html" data-i18n="menu.latino">Sebastiane Latino</a>
        <a href="encuentros.html" data-i18n="menu.eventos">Encuentros</a>
        <a href="noticias.html" data-i18n="menu.noticias">Noticias</a>
        <a href="revistas.html" data-i18n="menu.revista">Revista</a>
        
      </nav>
      <select id="lang-selector">
        <option value="es">ES</option>
        <option value="eu">EU</option>
        <option value="en">EN</option>
      </select>
    </div>
  </header>
`;

document.getElementById('footer').innerHTML = `
  <footer class="footer">
    <div class="footer-contenedor">
      <div class="footer-col">
        <h2 data-i18n="footer.contacto">Contacto</h2>
        <p data-i18n="email">Email: info@premiosebastiane.com</p>
        <p>Tel: Prensa +34 606 270 229</p>
        <p>Dirección: Premio Sebastiane – GEHITU
Kolon 50, 20002 Donostia / San Sebastián</p>
      </div>
      <div class="footer-col">
        <h2 data-i18n="footer.companeros">Compañeros de viaje</h2>
        <ul>
          <li><a href="https://www.gehitu.org/" target="_blank">Gehitu →</a></li>
          <li><a href="https://www.sansebastianfestival.com/es/" target="_blank">Festival de San Sebastián→</a></li>
          <li><a href="https://mugengainetik.org/" target="_blank">Mugen gainetik →</a></li>
          <li><a href="https://www.igualdad.gob.es/" target="_blank">Ministerio de Igualdad →</a></li>
          <li><a href="https://www.accioncultural.es/" target="_blank">Acción Cultural Española →</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2 data-i18n="footer.redes">Redes sociales</h2>
        <div class="social-icons">
          <a href="https://www.facebook.com/premiosebastiane/" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="https://x.com/sebastianeaward" target="_blank"><i class="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com/premiosebastiane/" target="_blank"><i class="fab fa-instagram"></i></a>
          <a href="https://www.youtube.com/channel/UCUlFl78JAqWMObOJ5plFvZQ/featured" target="_blank"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-copy">
      <p>&copy; ${new Date().getFullYear()} Premio SEBASTIANE</p>
    </div>
  </footer>
`;
