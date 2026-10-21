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

function promptPanel({ label, caption, phrase, context, followUp, followUpCaption, continuation = false }) {
  return `<section class="practice-entry${continuation ? ' practice-continuation' : ''}" aria-label="${escapeHtml(label)}">
    ${context ? `<p class="practice-context">${escapeHtml(context)}</p>` : ''}
    <p class="practice-caption">${escapeHtml(caption)}</p>
    <p class="practice-phrase">${escapeHtml(phrase)}</p>
    ${followUp ? `<p class="practice-caption">${escapeHtml(followUpCaption)}</p>
    <p class="practice-followup">${escapeHtml(followUp)}</p>` : ''}
  </section>`;
}

export function PracticeEntry(practice, number) {
  if (!practice) return '';
  const conversation = practice.mode === 'conversation';
  return promptPanel({
    label: `${number} 시작 안내`,
    caption: conversation ? 'AI에게 이렇게 말해보세요' : '먼저 해볼 것',
    phrase: practice.start,
    followUp: practice.steps?.length ? null : practice.followUp,
    followUpCaption: conversation ? '답을 받으면 이어서' : '살펴본 뒤'
  });
}

export function mountPracticeContinuations(root, practice, number) {
  const headings = [...root.querySelectorAll(':scope > h3')];
  for (const [index, step] of (practice?.steps || []).entries()) {
    const anchor = headings.find(node => node.textContent.trim() === step.before);
    if (!anchor) {
      console.warn(`Missing practice anchor: ${number} / ${step.before}`);
      continue;
    }
    anchor.insertAdjacentHTML('beforebegin', promptPanel({
      label: `${number} 후속 대화 ${index + 1}`,
      caption: '확인한 뒤 AI에게 이어서 말해보세요',
      context: step.check,
      phrase: step.prompt,
      continuation: true
    }));
  }
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
