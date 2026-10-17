const scenes = [['conditions','내 조건'],['pending','미응답'],['conflict','충돌'],['ready','전원 동의'],['changed','조건 변경']];
const people = ['지수','민호','서연','도윤'];
export function mountDemoControls(host, target, { scene = 'conditions', actor = '서연', onChange = () => {} } = {}) {
  host.classList.add('demo-controls');
  host.setAttribute('aria-label', '서비스 외부 실습 조작');
  host.innerHTML = `<div class="demo-controls-heading"><strong>실습 조작</strong><span>가상 참여자와 상황을 바꾸는 수업용 도구</span></div><div class="demo-controls-scenes" role="group" aria-label="확인할 상황">${scenes.map(([id,label])=>`<button type="button" data-scene="${id}" aria-pressed="false">${label}</button>`).join('')}</div><label class="demo-controls-actor">참여자 시점 <select aria-label="참여자 시점">${people.map(name=>`<option value="${name}">${name}${name==='지수'?' · 준비자':''}</option>`).join('')}</select></label><p>참여자를 바꿔도 같은 여행의 저장한 조건과 동의 상태는 이어집니다. 상황을 바꾸면 해당 예시의 초기 상태로 돌아갑니다.</p>`;
  function paint(){host.querySelector('select').value=actor;host.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scene===scene)));}
  function sendScene(){target()?.postMessage({type:'travel-comparison',scene,actor},location.origin);}
  function change(){paint();onChange({scene,actor});}
  host.addEventListener('click',event=>{const b=event.target.closest('[data-scene]');if(!b)return;scene=b.dataset.scene;if(scene==='ready')actor='지수';change();sendScene();});
  host.querySelector('select').addEventListener('change',event=>{actor=event.target.value;change();target()?.postMessage({type:'travel-actor',actor},location.origin);});
  function receive(event){if(event.origin!==location.origin||event.source!==target()||event.data?.type!=='travel-state'||!people.includes(event.data.actor))return;actor=event.data.actor;change();}
  window.addEventListener('message',receive);paint();
  return {sendScene, getState:()=>({scene,actor}),destroy:()=>window.removeEventListener('message',receive)};
}
export function mountStandaloneDemoControls(){
  if(window.parent!==window)return null;
  const host=document.createElement('aside');document.body.prepend(host);
  const params = new URLSearchParams(location.search);
  const scene = scenes.some(([id])=>id===params.get('scene')) ? params.get('scene') : 'conditions';
  const actor = people.includes(params.get('actor')) ? params.get('actor') : scene==='ready' ? '지수' : '서연';
  return mountDemoControls(host,()=>window,{scene,actor});
}
export function publishDemoActor(actor){(window.parent===window?window:window.parent).postMessage({type:'travel-state',actor},location.origin);}
