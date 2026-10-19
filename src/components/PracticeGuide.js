const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function sectionNumbers(sections) {
  const counts = new Map();
  return sections.map(section => {
    const category = Number(/^\d+/.exec(section.part)?.[0] || 0);
    const index = (counts.get(category) || 0) + 1;
    counts.set(category, index);
    return `${category}-${index}`;
  });
}

export function PracticeEntry(practice, number) {
  if (!practice) return '';
  const conversation = practice.mode === 'conversation';
  return `<section class="practice-entry" aria-label="${number} 시작 안내">
    <h2><span class="practice-number">${number}</span> 여기서 시작</h2>
    <p class="practice-caption">${conversation ? 'AI에게 이렇게 말해보세요' : '먼저 해볼 것'}</p>
    <p class="practice-phrase">${escapeHtml(practice.start)}</p>
    <p class="practice-caption">${conversation ? '답을 받으면 이어서' : '살펴본 뒤'}</p>
    <p class="practice-followup">${escapeHtml(practice.followUp)}</p>
  </section>`;
}

export function mountPracticeCheck(root, practice, number) {
  if (!practice) return;
  const checkpoint = document.createElement('section');
  checkpoint.className = 'practice-check' + (practice.decision ? ' is-decision' : '');
  checkpoint.setAttribute('aria-label', `${number} ${practice.decision || '중간 확인'}`);
  checkpoint.innerHTML = `<h3>${number} ${practice.decision ? '선택 지점 · ' + escapeHtml(practice.decision) : '잠깐 확인'}</h3>
    <p class="practice-question">${escapeHtml(practice.question)}</p>
    <p>${escapeHtml(practice.ifUnsure)}</p>${practice.decision ? '<p class="practice-decision-note">추천안을 보고 내가 선택한 뒤, AI에게 다음 작업을 이어가게 하세요.</p>' : ''}`;
  const headings = [...root.querySelectorAll('h3')].filter(node => !node.closest('details'));
  const anchor = practice.decision === '화면 수정 선택'
    ? headings.find(node => node.textContent.trim() === '실습 순서')
    : headings.find(node => node.textContent.trim() === '결과 점검');
  const fallback = headings.find(node => node.textContent.trim() === '브리프에 남길 것');
  if (anchor || fallback) (anchor || fallback).before(checkpoint);
  else root.append(checkpoint);
}
