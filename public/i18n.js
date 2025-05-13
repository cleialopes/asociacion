const traducciones = {
    es: {
      "menu.sebastiane": "Sebastiane",
      "menu.latino": "Sebastiane Latino",
      "menu.revista": "Revista",
      "menu.eventos": "Eventos",
      "menu.noticias": "Noticias",
      "nosotros": "Quiénes somos",
      "descripcion": "Somos una asociación dedicada a promover...",
      "contacto": "Contacto",
      "email": "Email: contacto@asociacionxyz.org",
      "footer.contacto": "Contacto",
      "footer.companeros": "Compañeros de viaje",
      "footer.redes": "Redes sociales"
    },
    eu: {
      "menu.sebastiane": "Sebastiane",
      "menu.latino": "Sebastiane Latino",
      "menu.revista": "Aldizkaria",
      "menu.eventos": "Ekitaldiak",
      "menu.noticias": "Berriak",
      "nosotros": "Nor gara",
      "descripcion": "Kultura sustatzen duen elkartea gara...",
      "contacto": "Harremana",
      "email": "Emaila: kontaktua@asoziazioaeus.org",
      "footer.contacto": "Harremana",
      "footer.companeros": "Bidaiako lagunak",
      "footer.redes": "Sare sozialak"
    },
    en: {
      "menu.sebastiane": "Sebastiane",
      "menu.latino": "Sebastiane Latino",
      "menu.revista": "Magazine",
      "menu.eventos": "Events",
      "menu.noticias": "News",
      "nosotros": "About us",
      "descripcion": "We are an association dedicated to promoting culture...",
      "contacto": "Contact",
      "email": "Email: contact@asociacionxyz.org",
      "footer.contacto": "Contact",
      "footer.companeros": "Partners",
      "footer.redes": "Social Media"
    }
  };
  
  function cambiarIdioma(lang) {
    const t = traducciones[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const clave = el.getAttribute('data-i18n');
      if (t[clave]) el.textContent = t[clave];
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('lang-selector');
    if (selector) {
      $(selector).select2({
        templateResult: formatLangOption,
        templateSelection: formatLangOption,
        minimumResultsForSearch: Infinity
      });
  
      $(selector).on('change', function () {
        cambiarIdioma(this.value);
      });
    }
  });
  
  function formatLangOption(option) {
    return option.text;
  }
  