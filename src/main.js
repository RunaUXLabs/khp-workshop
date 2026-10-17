import { Sidebar } from './components/Sidebar.js';
import { GuidePanel } from './components/GuidePanel.js';
import { LectureContent } from './components/LectureContent.js';
import { mountLecture } from './components/LectureController.js';

try {
  const responses = await Promise.all(['lecture', 'guides'].map(name => fetch(new URL(`./data/${name}.json`, import.meta.url), { cache: 'no-store' })));
  if (responses.some(response => !response.ok)) throw new Error('강연 자료를 불러오지 못했습니다.');
  const [lecture, guides] = await Promise.all(responses.map(response => response.json()));
  document.getElementById('app').innerHTML = GuidePanel() + '<div class="layout">' + Sidebar() + LectureContent() + '</div>';
  mountLecture(lecture, guides);
} catch (error) {
  const message = document.createElement('p');
  message.textContent = `${error.message} 로컬에서는 pnpm dev로 실행하세요.`;
  document.getElementById('app').replaceChildren(message);
}
