// Apply the same resource controls to lecture text and lazily loaded guides.
export function enhanceResourceActions(root) {
  for (const element of root.querySelectorAll('a[href], button[data-guide]')) {
    if (element.querySelector('img') || element.classList.contains('resource-action')) continue;
    let kind = 'section', label = '페이지 이동', icon = '→';
    if (element.matches('button[data-guide]')) {
      kind = 'panel'; label = '패널 열기'; icon = '▤';
      element.setAttribute('aria-controls', 'docPanel');
    } else {
      const href = element.getAttribute('href');
      const url = new URL(href, document.baseURI);
      if (url.origin === location.origin && /\.(md|mmd|svg)$/i.test(url.pathname)) {
        kind = 'download'; label = '다운로드'; icon = '↓';
        element.setAttribute('download', '');
        element.removeAttribute('target');
      } else if (!href.startsWith('#')) {
        kind = 'window'; label = '새 창'; icon = '↗';
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      }
    }
    element.classList.add('resource-action');
    element.dataset.actionKind = kind;
    // The shared action hint owns the icon; authored labels may already include one.
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      walker.currentNode.textContent = walker.currentNode.textContent.replace(/[↗↓⬇📥🔗]\uFE0F?/gu, '');
    }
    const actionAlreadyNamed = kind === 'window' ? /새\s*창/.test(element.textContent)
      : kind === 'download' ? /내려받|다운로드/.test(element.textContent)
      : kind === 'panel' ? /패널\s*열기/.test(element.textContent) : false;
    const hint = document.createElement('span');
    hint.className = 'resource-action-hint';
    hint.textContent = actionAlreadyNamed ? icon : `${icon} ${label}`;
    if (actionAlreadyNamed) hint.setAttribute('aria-hidden', 'true');
    element.appendChild(hint);
  }
}
