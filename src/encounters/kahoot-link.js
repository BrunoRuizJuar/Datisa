export function kahootLink(value) {
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && (url.hostname === 'kahoot.com' || url.hostname.endsWith('.kahoot.com') ||
          url.hostname === 'kahoot.it' || url.hostname.endsWith('.kahoot.it'))) {
        const href = url.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
        return `<a class="encounter-action" href="${href}" target="_blank" rel="noopener noreferrer">Abrir Kahoot (otra pestaña) <span aria-hidden="true">↗</span></a>`;
      }
    } catch { /* La configuración todavía no contiene un enlace válido. */ }
  }
  return '<p class="encounter-status">El enlace de Kahoot está pendiente de configurar.</p>';
}
