import { mountDemoControls } from './DemoControls.js';
const stages = [
  { id: 'initial', label: '01 · 최초 버전', url: 'demo/index.html', title: '최초 서비스 데모', description: '개별 CSS로 빠르게 만든 첫 결과입니다. 한 화면에 여러 입력을 모아 둔 구성을 살펴보세요.' },
  { id: 'css', label: '02 · SEED CSS 일부 적용', url: 'demo-css/index.html', title: 'SEED CSS 일부 적용 서비스 데모', description: '최초형의 HTML·입력 구성·동작은 그대로 두고 SEED 색상·모서리 토큰을 일부 적용한 중간 예시입니다. 공식 React 컴포넌트로 교체한 단계는 아닙니다.' },
  { id: 'mobile', label: '03 · 컴포넌트와 모바일 흐름', url: 'demo-seed/index.html', title: 'SEED 개선형 서비스 데모', description: '공식 SEED React 컴포넌트를 사용하고 날짜·예산·필수 조건·공유 범위를 나눴습니다. 확인 → 후보 선택 → 동의 → 확정까지 직접 진행해보세요.' },
];

export function mountDemoComparisons(container) {
  const cleanups = [];
  for (const host of container.querySelectorAll('[data-demo-comparison]')) {

    host.innerHTML = `<div class="design-stages" role="group" aria-label="디자인 발전 단계 선택">${stages.map(stage => `<button type="button" data-design-stage="${stage.id}" aria-pressed="false">${stage.label}</button>`).join('')}</div><section class="design-stage"><h3 data-stage-title></h3><p data-stage-description></p><aside data-demo-controls></aside><iframe class="stage-preview" loading="lazy"></iframe><p><a data-stage-open target="_blank" rel="noopener noreferrer">선택한 데모 새 창에서 보기 ↗</a></p><p class="stage-hint">버전을 전환하면 선택한 상황의 초기 상태로 시작합니다. 직접 입력한 값은 다른 버전으로 전달되지 않습니다.</p></section>`;
    const frame = host.querySelector('iframe');
    let currentStage;
    const controls = mountDemoControls(host.querySelector('[data-demo-controls]'), () => frame.contentWindow, { onChange: updateOpenLink });
    cleanups.push(controls.destroy);
    function updateOpenLink() {
      if (!currentStage) return;
      const url = new URL(currentStage.url, location.href);
      const {scene, actor} = controls.getState();
      url.searchParams.set('scene', scene); url.searchParams.set('actor', actor);
      host.querySelector('[data-stage-open]').href = url.href;
    }
    frame.addEventListener('load', controls.sendScene);
    function selectStage(id) {
      const stage = stages.find(stage => stage.id === id);
      if (!stage) return;
      host.querySelectorAll('[data-design-stage]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.designStage === id)));
      host.querySelector('[data-stage-title]').textContent = stage.label;
      host.querySelector('[data-stage-description]').textContent = stage.description;
      currentStage = stage; updateOpenLink();
      frame.title = stage.title;
      frame.src = stage.url;
    }
    host.addEventListener('click', event => {
      const stage = event.target.closest('[data-design-stage]');
      if (stage) { selectStage(stage.dataset.designStage); return; }

    });
    selectStage('initial');
  }
  // Intro and Figma examples embed a single demo without the version selector.
  for (const frame of container.querySelectorAll('iframe:not(.stage-preview)')) {
    if (!/^(demo|demo-css|demo-seed)\//.test(frame.getAttribute('src') || '')) continue;
    const host = document.createElement('aside');
    frame.before(host);
    const controls = mountDemoControls(host, () => frame.contentWindow);
    frame.addEventListener('load', controls.sendScene);
    cleanups.push(controls.destroy);
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
