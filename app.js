/**
 * Yohan Maldonado — Portfolio & Freelance Suite
 * Logic: Real-time Budget Calculator, Project Filters, Case Study Modal & FAQ
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initCalculator();
  initCaseModals();
  initFaqAccordion();
  initMobileNav();
});

/* ==========================================================================
   1. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (!card.classList.contains('active-filter-target')) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE WORKANA CALCULATOR
   ========================================================================== */
function initCalculator() {
  const form = document.getElementById('scope-form');
  const sumDaysEl = document.getElementById('sum-days');
  const sumBudgetEl = document.getElementById('sum-budget');
  const copyBtn = document.getElementById('btn-copy-proposal');
  const copyAlert = document.getElementById('copy-alert');

  const whatsappBtn = document.getElementById('btn-calc-whatsapp');

  if (!form) return;

  function recalculate() {
    // Project Type
    const selectedType = form.querySelector('input[name="projectType"]:checked');
    const baseDays = parseInt(selectedType?.getAttribute('data-base-days') || '4', 10);
    const basePrice = parseInt(selectedType?.getAttribute('data-base-price') || '120', 10);

    // Addons
    const checkedAddons = form.querySelectorAll('input[name="addons"]:checked');
    let addonDays = 0;
    let addonPrice = 0;
    checkedAddons.forEach(addon => {
      addonDays += parseInt(addon.getAttribute('data-days') || '0', 10);
      addonPrice += parseInt(addon.getAttribute('data-price') || '0', 10);
    });

    // Priority
    const selectedPriority = form.querySelector('input[name="priority"]:checked');
    const multiplier = parseFloat(selectedPriority?.getAttribute('data-multiplier') || '1');

    const totalDays = Math.round((baseDays + addonDays) * (multiplier > 1 ? 0.75 : 1)); // express reduces timeline by intensive dedication
    const minDays = Math.max(2, totalDays - 2);
    const maxDays = totalDays + 2;

    const totalPrice = Math.round((basePrice + addonPrice) * multiplier);
    const minPrice = Math.round(totalPrice * 0.95);
    const maxPrice = Math.round(totalPrice * 1.25);

    if (sumDaysEl) sumDaysEl.textContent = `~${minDays} a ${maxDays} días hábiles`;
    if (sumBudgetEl) sumBudgetEl.textContent = `$${minPrice} – $${maxPrice} USD`;

    if (whatsappBtn) {
      const typeTitle = selectedType?.closest('.calc-option')?.querySelector('.opt-title')?.textContent || 'Proyecto Web';
      const msg = `Hola Yohan, estuve usando el cotizador de tu portafolio para un "${typeTitle}" (~${minDays}-${maxDays} días, estimado: $${minPrice}-$${maxPrice} USD). Me gustaría darte los detalles para iniciar en Workana.`;
      whatsappBtn.href = `https://wa.me/573009446681?text=${encodeURIComponent(msg)}`;
    }
  }

  // Bind changes
  form.addEventListener('change', recalculate);
  recalculate();

  // Copy proposal button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const selectedType = form.querySelector('input[name="projectType"]:checked');
      const typeTitle = selectedType?.closest('.calc-option')?.querySelector('.opt-title')?.textContent || 'Proyecto Web';
      
      const checkedAddons = form.querySelectorAll('input[name="addons"]:checked');
      const addonsList = Array.from(checkedAddons).map(a => a.closest('.addon-checkbox')?.querySelector('.addon-name')?.textContent || '').filter(Boolean);

      const priorityText = form.querySelector('input[name="priority"]:checked')?.value === 'express' ? 'Prioritario / Express' : 'Estándar';
      const days = sumDaysEl?.textContent || 'A coordinar';
      const budget = sumBudgetEl?.textContent || 'A coordinar';

      const clipboardText = `Hola Yohan, revisé tu portafolio y me gustaría cotizar este proyecto para mi requerimiento en Workana:

• Tipo de solución: ${typeTitle}
• Módulos adicionales: ${addonsList.length ? addonsList.join(', ') : 'Alcance base'}
• Modalidad de entrega: ${priorityText}
• Estimación preliminar del cotizador: ${days} (${budget})

¿Podemos coordinar una llamada o hito en Workana para revisar los requerimientos detallados?`;

      navigator.clipboard.writeText(clipboardText).then(() => {
        if (copyAlert) {
          copyAlert.textContent = '✓ ¡Requerimiento copiado al portapapeles! Pégalo en tu mensaje de Workana.';
          setTimeout(() => {
            copyAlert.textContent = '';
          }, 4000);
        }
      }).catch(() => {
        if (copyAlert) copyAlert.textContent = 'Selecciona el texto manualmente para copiar.';
      });
    });
  }
}

/* ==========================================================================
   3. CASE STUDY MODAL DATA & CONTROLLER
   ========================================================================== */
const PROJECT_CASE_STUDIES = {
  eventconnect: {
    title: "EventConnect — Plataforma de Eventos & Ticketing Seguro",
    tagline: "Arquitectura Hexagonal, WebSockets en vivo, verificación QR criptográfica y Agente de Voz Super Admin.",
    challenge: "Las plataformas convencionales de venta de entradas sufren graves problemas de sobreventa por condiciones de carrera (race conditions), latencias altas bajo picos de tráfico y falta de interfaces operativas ágiles para administradores en campo.",
    solution: "Se diseñó un backend en Node.js/Express bajo Arquitectura Hexagonal con persistencia en SQLite con Write-Ahead Logging (WAL) para lecturas no bloqueantes ultrarrápidas y bloqueos de asiento efímeros vía Socket.io. Se integró validación criptográfica de tickets con códigos QR y un Agente de Voz para Super Admin con Web Speech API para consultas de telemetría y aforo en lenguaje natural.",
    architecturePoints: [
      "Conformidad total con ISO/IEC/IEEE 15289:2019 (Índice Maestro, SRS, SAD, STP/STR).",
      "Auditoría de ciberseguridad OWASP ASVS Nivel 2: JWT en cookies HttpOnly y mitigación estricta de CSRF/XSS.",
      "Diagramas de Arquitectura interactivos C4 Model generados con la skill Archify.",
      "11 de 11 pruebas automatizadas unitarias y de integración pasando (100% de éxito)."
    ],
    stack: "Node.js, Express, Angular SPA, Socket.io, SQLite WAL, OpenAPI 3.1, Web Speech API, Docker",
    links: [
      { text: "Ver Portal Interactivo en Vivo", url: "https://yohandvl.github.io/eventconnect/", primary: true },
      { text: "Explorar Código en GitHub", url: "https://github.com/YohanDvl/eventconnect", primary: false }
    ]
  },
  cartagena: {
    title: "Cartagena Tours — Plataforma de Reservas Turísticas",
    tagline: "Catálogo interactivo de tours, cotizador dinámico y panel de operadores.",
    challenge: "Los operadores turísticos locales en Cartagena dependían de procesos manuales por chat para cotizar itinerarios con extras (transporte, almuerzo, guías bilingües), perdiendo ventas por tiempos lentos de respuesta.",
    solution: "Se desarrolló una plataforma web de alto rendimiento con React + Vite y backend ligero en Node.js/SQLite. Los usuarios pueden explorar excursiones (Islas del Rosario, Ciudad Amurallada, Manglares, etc.), personalizar pasajeros y extras, y generar una reserva instantánea con cotización exacta.",
    architecturePoints: [
      "Tiempo de carga inferior a 1 segundo gracias a Vite y bundling optimizado de assets.",
      "Manejo de estado reactivo para filtros combinados (zona, precio, duración, tipo de tour).",
      "Diseño mobile-first pensado para turistas navegando en smartphones con conexiones móviles 4G.",
      "Panel interno para actualizar tarifas y disponibilidad en tiempo real."
    ],
    stack: "React, Vite, Node.js, Express, SQLite, Vanilla CSS Modular",
    links: [
      { text: "Ver Demo en Vivo", url: "https://yohandvl.github.io/cartagena-tours/", primary: true },
      { text: "Explorar Código en GitHub", url: "https://github.com/YohanDvl/cartagena-tours", primary: false }
    ]
  },
  prestamo: {
    title: "PrestamoApp — Core Financiero Cliente/Servidor TCP",
    tagline: "Arquitectura distribuida multihilo para cálculo y liquidación de créditos bancarios.",
    challenge: "Procesar simultáneamente cálculos de amortización financiera compleja para decenas de terminales bancarias sin la sobrecarga ni la latencia inherente del protocolo HTTP.",
    solution: "Se implementó un servidor socket TCP puro en Java 17 que gestiona un Thread Pool para concurrencia masiva. Cada hilo procesa peticiones de crédito, aplica algoritmos de amortización francesa/alemana con precisión decimal exacta y despacha los datos formateados junto con generación de certificados en PDF.",
    architecturePoints: [
      "Comunicación cliente-servidor mediante protocolo de sockets de baja sobrecarga.",
      "Procesamiento no bloqueante con hilos independientes de atención.",
      "Validación de tipos de interés, cuotas de gracia y balances en tiempo real.",
      "Generación de reportes bancarios exportables con la librería iText PDF."
    ],
    stack: "Java 17, TCP Sockets, Multithreading Concurrency, Swing UI, iText PDF",
    links: [
      { text: "Repositorio en GitHub", url: "https://github.com/YohanDvl/PrestamoApp", primary: true }
    ]
  },
  qr: {
    title: "Generador & Validador de Credenciales QR",
    tagline: "Aplicación híbrida móvil y web para control de acceso y ticketing offline.",
    challenge: "Validar accesos a recintos cerrados o eventos masivos en zonas con conectividad intermitente a internet sin congelar la entrada de asistentes.",
    solution: "Se diseñó una aplicación con Ionic, Angular y Capacitor capaz de operar tanto en navegadores de escritorio como en dispositivos móviles Android nativos. Utiliza almacenamiento reactivo local y renderizado vectorial de códigos QR para validación instantánea.",
    architecturePoints: [
      "Soporte multiplataforma garantizado mediante Capacitor runtime.",
      "Almacenamiento en local storage / SQLite nativo para validaciones fuera de línea.",
      "Escaneo rápido utilizando la cámara del dispositivo con respuesta visual en milisegundos."
    ],
    stack: "Angular, Ionic Framework, Capacitor, TypeScript, HTML5 Canvas",
    links: []
  }
};

function initCaseModals() {
  const modal = document.getElementById('case-modal');
  const modalBody = document.getElementById('modal-content-area');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = PROJECT_CASE_STUDIES[projectId];
    if (!data) return;

    let linksHtml = '';
    if (data.links && data.links.length) {
      linksHtml = `
        <div style="margin-top: 24px; display: flex; gap: 10px; flex-wrap: wrap;">
          ${data.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm ${l.primary ? 'btn-primary' : 'btn-secondary'}">
              ${l.text} &rarr;
            </a>
          `).join('')}
        </div>
      `;
    }

    const pointsHtml = data.architecturePoints.map(p => `<li style="margin-bottom: 8px; color: var(--text-secondary);">${p}</li>`).join('');

    modalBody.innerHTML = `
      <div class="modal-header-meta">
        <span class="badge badge-accent">Estudio de Caso Técnico</span>
        <h3 class="modal-title">${data.title}</h3>
        <p class="modal-subtitle">${data.tagline}</p>
      </div>

      <h4 class="modal-section-h">El Problema de Negocio</h4>
      <p class="modal-p">${data.challenge}</p>

      <h4 class="modal-section-h">La Solución Arquitectónica</h4>
      <p class="modal-p">${data.solution}</p>

      <h4 class="modal-section-h">Puntos Clave de Ingeniería & Calidad</h4>
      <ul style="padding-left: 20px; font-size: 0.92rem; margin-bottom: 18px;">
        ${pointsHtml}
      </ul>

      <h4 class="modal-section-h">Stack Tecnológico</h4>
      <p class="modal-p" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan);">
        ${data.stack}
      </p>

      ${linksHtml}
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all others for clean look
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
