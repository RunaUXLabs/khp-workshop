import { marked } from '../lib/markdown.js';
import { mountDemoComparisons } from './DemoComparison.js';
import { Cover } from './Cover.js';
import { enhanceResourceActions } from './ResourceActions.js';
import { mountPreviewPanels } from './PreviewPanel.js';
import { sectionNumbers, PracticeEntry, mountPracticeCheck, mountPracticeContinuations } from './PracticeGuide.js';
export function mountLecture(D, DOCS) {
      const secs = D.sections;
      const numbers = sectionNumbers(secs);
      document.title = D.title;
      document.getElementById('brandTitle').textContent = D.title;
      document.getElementById('brandSub').textContent = D.subtitle;
      document.getElementById('brandTitle').addEventListener('click', event => {
        event.preventDefault();
        goCover();
        closeMobile();
      });
      marked.use({ extensions: [{
        name: 'lectureStrong',
        level: 'inline',
        start(src) { return src.indexOf('**'); },
        tokenizer(src) {
          const match = /^\*\*([^\n]+?)\*\*/.exec(src);
          if (match) return { type: 'lectureStrong', raw: match[0], tokens: this.lexer.inlineTokens(match[1]) };
        },
        renderer(token) { return '<strong>' + this.parser.parseInline(token.tokens) + '</strong>'; }
      }] });
      // Single tildes denote ranges in the lesson, not strikethrough.
      marked.use({ tokenizer: { del(src) { if (src.startsWith('~~')) return false; } } });
      marked.setOptions({ breaks: true, gfm: true });

      const toc = document.getElementById('toc');
      const linkMap = {};
      let lastPart = null, curGroup = null;
      secs.forEach((s, i) => {
        if (s.part !== lastPart) {
          const lbl = document.createElement('div'); lbl.className = 'toc-group';
          const span = document.createElement('div'); span.className = 'toc-group-label';
          span.textContent = s.part; lbl.appendChild(span); toc.appendChild(lbl);
          curGroup = lbl; lastPart = s.part;
        }
        const a = document.createElement('a');
        a.textContent = numbers[i] + ' ' + (s.tocTitle || s.title); a.dataset.idx = i; a.href = '#' + s.id;
        if (s.detailDoc && DOCS[s.detailDoc]) a.classList.add('has-doc');
        a.dataset.search = (numbers[i] + ' ' + (s.tocTitle || s.title) + ' ' + s.title + ' ' + s.part + ' ' + s.body + ' ' + (s.practice?.start || '') + ' ' + (s.practice?.steps || []).map(step => step.check + ' ' + step.prompt).join(' ')).toLowerCase();
        a.addEventListener('click', event => { event.preventDefault(); go(i); closeMobile(); });
        curGroup.appendChild(a); linkMap[i] = a;
      });

      const contentEl = document.getElementById('content');
      const crumbEl = document.getElementById('crumb');
      const mainEl = document.getElementById('main');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const prevLabel = document.getElementById('prevLabel');
      const nextLabel = document.getElementById('nextLabel');
      let cur = -1;
      let cleanupPreviews = () => {};
      let cleanupComparisons = () => {};

      const detailFab = document.getElementById('detailFab');
      const docPanel = document.getElementById('docPanel');
      const docBackdrop = document.getElementById('docBackdrop');
      const docTitleEl = document.getElementById('docTitle');
      const docBodyEl = document.getElementById('docBody');
      let curDocKey = null, docRendered = null;
      let docRequest = 0;

      async function openDoc(key) {
        const doc = DOCS[key]; if (!doc) return;
        const request = ++docRequest;
        docTitleEl.textContent = doc.title || '심화 가이드';
        docPanel.querySelector('.label').textContent = doc.kind === 'conversation' ? '대화 샘플' : doc.kind === 'background' ? '페르소나 · 합성 배경 자료' : '심화 가이드';
        docBodyEl.scrollTop = 0;
        docPanel.classList.add('open'); docBackdrop.classList.add('open');
        if (docRendered === key) return;
        docRendered = null;
        docBodyEl.textContent = '자료를 불러오는 중입니다…';
        try {
          let body = doc.body;
          if (doc.source) {
            const response = await fetch(new URL('../../' + doc.source, import.meta.url), { cache: 'no-store' });
            if (!response.ok) throw new Error('자료를 불러오지 못했습니다.');
            body = await response.text();
          }
          if (request !== docRequest) return;
          docBodyEl.innerHTML = marked.parse(body);
          enhanceResourceActions(docBodyEl);
          for (const table of docBodyEl.querySelectorAll('table')) {
            const scroll = document.createElement('div');
            scroll.className = 'guide-table-scroll';
            scroll.tabIndex = 0;
            scroll.setAttribute('role', 'region');
            scroll.setAttribute('aria-label', '비교표 · 필요한 경우 가로로 스크롤');
            table.before(scroll);
            scroll.appendChild(table);
          }
          docRendered = key;
          docBodyEl.scrollTop = 0;
        } catch (error) {
          if (request === docRequest) docBodyEl.textContent = `${error.message} 잠시 후 다시 열어주세요.`;
        }
      }
      function closeDoc() { docRequest++; docPanel.classList.remove('open'); docBackdrop.classList.remove('open'); }
      function openLinkedGuide(event) {
        const button = event.target.closest('button[data-guide]');
        if (button) openDoc(button.dataset.guide);
      }
      contentEl.addEventListener('click', openLinkedGuide);
      docBodyEl.addEventListener('click', openLinkedGuide);
      detailFab.addEventListener('click', () => { if (curDocKey) openDoc(curDocKey); });
      document.getElementById('docClose').addEventListener('click', closeDoc);
      docBackdrop.addEventListener('click', closeDoc);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDoc(); });

      function escapeHtml(t) { return t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
      function goCover() {
        cleanupPreviews();
        cleanupComparisons();
        cur = -1;
        closeDoc();
        mainEl.classList.add('is-cover');
        crumbEl.textContent = '';
        contentEl.innerHTML = Cover(D.cover);
        Object.values(linkMap).forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        document.getElementById('brandTitle').setAttribute('aria-current', 'page');
        prevBtn.hidden = true;
        nextBtn.disabled = !secs.length;
        prevLabel.textContent = '';
        nextLabel.textContent = secs.length ? '수업 시작 · ' + numbers[0] + ' ' + (secs[0].tocTitle || secs[0].title) : '';
        mainEl.scrollTop = 0;
        curDocKey = null;
        detailFab.classList.remove('show');
        try { history.replaceState(null, '', '#cover'); } catch (_) { }
      }
      function go(i) {
        if (i === -1) { goCover(); return; }
        if (i < 0 || i >= secs.length) return;
        cur = i; const s = secs[i];
        cleanupPreviews();
        cleanupComparisons();
        mainEl.classList.remove('is-cover');
        prevBtn.hidden = false;
        document.getElementById('brandTitle').removeAttribute('aria-current');
        crumbEl.textContent = s.part;
        contentEl.innerHTML = '<h1><span class="page-number">' + numbers[i] + '</span> ' + escapeHtml(s.title) + '</h1>' + PracticeEntry(s.practice, numbers[i]) + marked.parse(s.body.trim());
        mountPracticeCheck(contentEl, s.practice, numbers[i]);
        mountPracticeContinuations(contentEl, s.practice, numbers[i]);
        cleanupComparisons = mountDemoComparisons(contentEl);
        cleanupPreviews = mountPreviewPanels(contentEl);
        enhanceResourceActions(contentEl);
        Object.values(linkMap).forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        linkMap[i].classList.add('active');
        linkMap[i].setAttribute('aria-current', 'page');
        prevBtn.disabled = false; nextBtn.disabled = (i === secs.length - 1);
        prevLabel.textContent = i > 0 ? numbers[i - 1] + ' ' + secs[i - 1].title : '표지 · 함께 시작하기';
        nextLabel.textContent = i < secs.length - 1 ? numbers[i + 1] + ' ' + secs[i + 1].title : '';
        mainEl.scrollTop = 0;
        curDocKey = (s.detailDoc && DOCS[s.detailDoc]) ? s.detailDoc : null;
        detailFab.classList.toggle('show', !!curDocKey);
        closeDoc();
        try { if (history.replaceState) history.replaceState(null, '', '#' + s.id); } catch (_) { }
      }
      prevBtn.addEventListener('click', () => go(cur - 1));
      nextBtn.addEventListener('click', () => go(cur + 1));
      document.addEventListener('keydown', e => {
        if (document.body.classList.contains('preview-open')) return;
        if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
        if (docPanel.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') go(cur - 1);
        if (e.key === 'ArrowRight') go(cur + 1);
      });

      const search = document.getElementById('search');
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        secs.forEach((s, i) => {
          const match = !q || linkMap[i].dataset.search.includes(q);
          linkMap[i].classList.toggle('hidden', !match);
        });
        document.querySelectorAll('.toc-group').forEach(g => {
          const links = g.querySelectorAll('a');
          const visible = Array.from(links).some(a => !a.classList.contains('hidden'));
          g.classList.toggle('hidden', links.length > 0 && !visible);
        });
      });

      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('backdrop');
      function closeMobile() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
      document.getElementById('menuToggle').addEventListener('click', () => {
        sidebar.classList.toggle('open'); backdrop.classList.toggle('show');
      });
      backdrop.addEventListener('click', closeMobile);

      window.addEventListener('hashchange', () => {
        const targetId = decodeURIComponent(location.hash.slice(1));
        if (!targetId || targetId === 'cover') { goCover(); closeMobile(); return; }
        const targetIndex = secs.findIndex(s => s.id === targetId);
        if (targetIndex >= 0) { go(targetIndex); closeMobile(); }
      });
      const hash = decodeURIComponent(location.hash.replace('#', ''));
      const startIdx = secs.findIndex(s => s.id === hash);
      if (startIdx < 0) goCover(); else go(startIdx);
    }
