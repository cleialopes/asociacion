const traducciones = {
  es: {
    "menu.info": "Info",
    "menu.sebastiane": "Sebastiane",
    "menu.latino": "Sebastiane Latino",
    "menu.revista": "Revista",
    "menu.encuentros": "Encuentros",
    "menu.noticias": "Noticias",
    "nosotros": "Quiénes somos",
    "descripcion": "Somos una asociación dedicada a promover...",
    "contacto": "Contacto",
    "email": "Email: contacto@asociacionxyz.org",
    "footer.contacto": "Contacto",
    "footer.companeros": "Compañeros de viaje",
    "footer.redes": "Redes sociales",
    "sebastiane.titulo": "Sebastiane",
    "sebastiane.quees": "¿Qué es?",
    "sebastiane.descripcion": "El Premio Sebastiane es el reconocimiento a la mejor película LGTBI del Festival de San Sebastián en cualquiera de las secciones oficiales a concurso y que refleje los valores y la realidad de lesbianas, gais, transexuales y bisexuales."
  },
  eu: {
    "menu.info": "Info",
    "menu.sebastiane": "Sebastiane",
    "menu.latino": "Sebastiane Latino",
    "menu.revista": "Aldizkaria",
    "menu.encuentros": "Topaketak",
    "menu.noticias": "Berriak",
    "nosotros": "Nor gara",
    "descripcion": "Kultura sustatzen duen elkartea gara...",
    "contacto": "Harremana",
    "email": "Emaila: kontaktua@asoziazioaeus.org",
    "footer.contacto": "Harremana",
    "footer.companeros": "Bidaiako lagunak",
    "footer.redes": "Sare sozialak",
    "sebastiane.titulo": "Sebastiane",
    "sebastiane.quees": "Zer da?",
    "sebastiane.descripcion": "Sebastiane saria Donostiako Zinemaldiko lehiaketako edozein ataletan parte hartzen duten LGTBI film onenei ematen zaie, lesbianen, gayen, transexualen eta bisexualen errealitatea eta balioak islatzen dituztenei."
  },
  en: {
    "menu.info": "Info",
    "menu.sebastiane": "Sebastiane",
    "menu.latino": "Sebastiane Latino",
    "menu.revista": "Magazine",
    "menu.encuentros": "Gatherings",
    "menu.noticias": "News",
    "nosotros": "About us",
    "descripcion": "We are an association dedicated to promoting culture...",
    "contacto": "Contact",
    "email": "Email: contact@asociacionxyz.org",
    "footer.contacto": "Contact",
    "footer.companeros": "Partners",
    "footer.redes": "Social Media",
    "sebastiane.titulo": "Sebastiane",
    "sebastiane.quees": "What is it?",
    "sebastiane.descripcion": "The Sebastiane Award is given to the best LGTBI film of the San Sebastián Festival in any of the official competitive sections and that reflects the values and reality of lesbians, gays, transsexuals, and bisexuals."
  }
};

function cambiarIdioma(lang) {
  const t = traducciones[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const clave = el.getAttribute('data-i18n');
    if (t[clave]) el.textContent = t[clave];
  });
  localStorage.setItem('idioma', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('lang-selector');
  const idiomaGuardado = localStorage.getItem('idioma') || 'es'; // Idioma por defecto: español
  cambiarIdioma(idiomaGuardado);

  if (selector) {
    selector.value = idiomaGuardado; // mostrar seleccionado en el menú
    selector.addEventListener('change', function () {
      cambiarIdioma(this.value);
    });
  }
});

