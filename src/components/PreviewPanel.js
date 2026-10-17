export function mountPreviewPanels(root) {
  const cleanups = [];
  for (const image of root.querySelectorAll('img')) {
    const panel = document.createElement('section');
    panel.className = 'preview-panel';
    panel.setAttribute('aria-label', image.alt || '이미지 미리보기');
    panel.innerHTML = `<div class="preview-toolbar"><span>드래그해서 이동</span><div><button type="button" data-preview="minus" aria-label="축소">−</button><output aria-live="polite">100%</output><button type="button" data-preview="plus" aria-label="확대">+</button><button type="button" data-preview="fit">맞춤</button><button type="button" data-preview="original">100%</button></div></div><div class="preview-viewport can-pan" tabindex="0" aria-label="이미지 · 드래그 또는 방향키로 이동"><div class="preview-space"><div class="preview-media"></div></div></div>`;
    image.before(panel);
    panel.querySelector('.preview-media').append(image);
    image.draggable = false;
    const viewport = panel.querySelector('.preview-viewport');
    const space = panel.querySelector('.preview-space');
    const inner = panel.querySelector('.preview-media');
    let scale = 1, fitMode = true, lastWidth = 0, drag;
    function draw() {
      if (!image.naturalWidth) return;
      image.style.width = `${image.naturalWidth}px`;
      image.style.height = `${image.naturalHeight}px`;
      inner.style.transform = `scale(${scale})`;
      space.style.width = `${image.naturalWidth * scale}px`;
      space.style.height = `${image.naturalHeight * scale}px`;
      panel.querySelector('output').value = `${Math.round(scale * 100)}%`;
    }
    function fit() {
      if (!image.naturalWidth) return;
      scale = Math.min(1, Math.max(0.01, (viewport.clientWidth - 24) / image.naturalWidth));
      draw();
      viewport.scrollTo(0, 0);
    }
    function zoom(next) {
      fitMode = false;
      const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / scale;
      const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / scale;
      scale = Math.max(0.01, Math.min(4, next));
      draw();
      viewport.scrollLeft = centerX * scale - viewport.clientWidth / 2;
      viewport.scrollTop = centerY * scale - viewport.clientHeight / 2;
    }
    panel.addEventListener('click', event => {
      const action = event.target.closest('[data-preview]')?.dataset.preview;
      if (action === 'fit') { fitMode = true; fit(); }
      if (action === 'original') zoom(1);
      if (action === 'plus') zoom(scale * 1.25);
      if (action === 'minus') zoom(scale / 1.25);
    });
    viewport.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); viewport.focus();
      drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', event => {
      if (!drag) return;
      viewport.scrollLeft = drag.left - (event.clientX - drag.x);
      viewport.scrollTop = drag.top - (event.clientY - drag.y);
    });
    const stopDrag = () => { drag = null; viewport.classList.remove('is-dragging'); };
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) viewport.addEventListener(event, stopDrag);
    viewport.addEventListener('keydown', event => {
      const movement = { ArrowLeft: [-60, 0], ArrowRight: [60, 0], ArrowUp: [0, -60], ArrowDown: [0, 60] }[event.key];
      if (movement) { event.preventDefault(); event.stopPropagation(); viewport.scrollBy(...movement); }
    });
    image.addEventListener('load', () => fitMode ? fit() : draw());
    const observer = new ResizeObserver(() => {
      if (viewport.clientWidth === lastWidth) return;
      lastWidth = viewport.clientWidth;
      if (fitMode) fit();
    });
    observer.observe(viewport);
    cleanups.push(() => observer.disconnect());
    fit();
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
