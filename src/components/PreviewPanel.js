export function mountPreviewPanels(root) {
  const cleanups = [];
  for (const media of root.querySelectorAll('img, iframe:not(.slido-presentation)')) {
    const isImage = media.tagName === 'IMG';
    const panel = document.createElement('section');
    panel.className = 'preview-panel';
    panel.setAttribute('aria-label', media.alt || media.title || '화면 미리보기');
    panel.innerHTML = `<div class="preview-toolbar"><span>화면 미리보기</span><div><button type="button" data-preview="minus" aria-label="축소">−</button><output aria-live="polite">100%</output><button type="button" data-preview="plus" aria-label="확대">+</button><button type="button" data-preview="fit">맞춤</button><button type="button" data-preview="expand" aria-expanded="false">확대 보기</button></div></div><div class="preview-viewport" tabindex="0" aria-label="미리보기 · 확대 후 스크롤"><div class="preview-space"><div class="preview-media"></div></div></div>`;
    media.before(panel);
    panel.querySelector('.preview-media').append(media);
    const viewport = panel.querySelector('.preview-viewport');
    const space = panel.querySelector('.preview-space');
    const inner = panel.querySelector('.preview-media');
    const expand = panel.querySelector('[data-preview="expand"]');
    const panButton = document.createElement('button');
    panButton.type = 'button'; panButton.dataset.preview = 'pan';
    panButton.textContent = '화면 이동';
    panButton.setAttribute('aria-pressed', String(isImage));
    expand.before(panButton);
    viewport.classList.toggle('can-pan', isImage);
    media.draggable = false;
    let drag = null;
    viewport.addEventListener('pointerdown', event => {
      if (!viewport.classList.contains('can-pan') || event.button !== 0) return;
      event.preventDefault();
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
    viewport.addEventListener('pointerup', stopDrag);
    viewport.addEventListener('pointercancel', stopDrag);
    viewport.addEventListener('lostpointercapture', stopDrag);
    let scale = 1, baseWidth = 480, baseHeight = 920, previousFocus;
    function draw() {
      media.style.width = `${baseWidth}px`;
      media.style.height = `${baseHeight}px`;
      inner.style.transform = `scale(${scale})`;
      space.style.width = `${baseWidth * scale}px`;
      space.style.height = `${baseHeight * scale}px`;
      panel.querySelector('output').value = `${Math.round(scale * 100)}%`;
    }
    function fit() {
      if (isImage && !media.naturalWidth) return;
      baseWidth = isImage ? media.naturalWidth : 480;
      baseHeight = isImage ? media.naturalHeight : 920;
      scale = Math.min(1, Math.max(0.05, (viewport.clientWidth - 24) / baseWidth));
      draw();
    }
    function close() {
      panel.classList.remove('is-expanded');
      panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
      expand.textContent = '확대 보기'; expand.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('preview-open');
      fit(); previousFocus?.focus();
    }
    panel.addEventListener('click', event => {
      const action = event.target.closest('[data-preview]')?.dataset.preview;
      if (action === 'pan') {
        const enabled = viewport.classList.toggle('can-pan');
        panButton.setAttribute('aria-pressed', String(enabled));
      }
      if (action === 'fit') fit();
      if (action === 'plus' || action === 'minus') {
        scale = Math.max(0.05, Math.min(3, scale * (action === 'plus' ? 1.25 : 0.8))); draw();
      }
      if (action === 'expand') {
        if (panel.classList.contains('is-expanded')) { close(); return; }
        previousFocus = document.activeElement;
        panel.classList.add('is-expanded');
        panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
        document.body.classList.add('preview-open');
        expand.textContent = '닫기'; expand.setAttribute('aria-expanded', 'true');
        fit(); expand.focus();
      }
    });
    function onKey(event) {
      if (!panel.classList.contains('is-expanded')) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
      if (event.key === 'Tab') {
        const items = [...panel.querySelectorAll('button, [tabindex="0"], iframe')];
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    }
    panel.addEventListener('keydown', onKey);
    // Frame focus does not bubble Escape to its parent page.
    media.addEventListener('load', () => {
      if (isImage) fit();
      else { try { media.contentDocument.addEventListener('keydown', event => {
        if (event.key === 'Escape') onKey(event);
      }); } catch {} }
    });
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    cleanups.push(() => observer.disconnect());
    fit();
  }
  return () => { cleanups.forEach(cleanup => cleanup()); document.body.classList.remove('preview-open'); };
}
