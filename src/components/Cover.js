function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

export function Cover(config = {}) {
  const title = escapeHtml(config.title || '함께 시작하기');
  let url;
  try {
    url = new URL(config.slidoUrl);
    if (url.protocol !== 'https:') url = null;
    // Admin-launched URLs depend on the host window. Keep a standalone wall URL.
    if (url?.hostname === 'wall.sli.do' && url.searchParams.get('integration') === 'slido-admin') {
      url.searchParams.delete('integration');
      if (url.searchParams.get('utm_source') === 'slidoadmin') url.searchParams.delete('utm_source');
    }
  } catch { url = null; }
  if (!url) return `<section class="lecture-cover"><h1>${title}</h1><p>참여 화면을 준비하고 있습니다.</p></section>`;
  const src = escapeHtml(url.href);
  return `<section class="lecture-cover" aria-labelledby="coverTitle">
    <header class="cover-toolbar"><h1 id="coverTitle">${title}</h1><a href="${src}" target="_blank" rel="noopener noreferrer">Slido 새 창에서 보기 ↗</a></header>
    <iframe class="slido-presentation" src="${src}" title="Slido 프레젠테이션 · 학생들과 함께하는 화면" allow="fullscreen" allowfullscreen></iframe>
  </section>`;
}
