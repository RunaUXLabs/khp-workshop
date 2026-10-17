import { mountStandaloneDemoControls, publishDemoActor } from '../components/DemoControls.js';
import { people, initialState, evaluate, applyPreset } from './model.js';
import { ConditionScreen } from './ConditionScreen.js';
import { ComparisonScreen } from './ComparisonScreen.js';
import { escapeHtml as e } from './ui.js';
let state=initialState();
const params=new URLSearchParams(location.search);
if(['pending','conflict','ready','changed'].includes(params.get('scene')))applyPreset(state,params.get('scene'));
if(people.includes(params.get('actor')))state.actor=params.get('actor');
mountStandaloneDemoControls();
const root=document.getElementById('travel-app');
function render(){
 root.innerHTML=`<div class="demo"><header class="travel-header"><a class="wordmark" href="#" aria-label="같이 가는 여행 처음으로">같이<span>가는 여행</span><i>↗</i></a><span class="edition">수업용 데모</span></header><div class="trip-meta"><span>친구들과 가을 여행</span><span>4명 · 조건 v${state.version}</span></div><nav class="tabs" aria-label="서비스 화면"><button data-tab="conditions" class="${state.tab==='conditions'?'active':''}" aria-pressed="${state.tab==='conditions'}">내 조건 확인</button><button data-tab="compare" class="${state.tab==='compare'?'active':''}" aria-pressed="${state.tab==='compare'}">함께 후보 비교</button></nav><div class="actor"><span>현재 시점 · ${e(state.actor)}</span></div>${state.notice?`<p class="notice" role="status">${e(state.notice)}</p>`:''}${state.tab==='conditions'?ConditionScreen(state):ComparisonScreen(state)}<footer class="scenario"><p>수업용 예시 데이터 · 실제 AI·예약·외부 공유 미연결</p></footer></div>`;
 publishDemoActor(state.actor);
}
root.addEventListener('change',event=>{if(event.target.id==='actor'){state.actor=event.target.value;render();}});
root.addEventListener('submit',event=>{
 event.preventDefault(); if(event.target.id!=='condition-form'||!event.target.reportValidity())return;
 const form=new FormData(event.target),member=state.members.find(p=>p.name===state.actor);
 const next={date:form.get('date'),budget:Number(form.get('budget')),requirement:form.get('requirement'),visibility:form.get('visibility')};
 const changed=Object.keys(next).some(key=>member[key]!==next[key]);
 if(changed){state.version++;state.members.forEach(p=>p.agreed=false);state.finalized=false;}
 Object.assign(member,next,{confirmed:true});
 state.notice=changed?'수정한 조건을 저장했어요. 이전 동의와 확정은 해제하고 다시 확인해요.':'내 조건을 확인했어요. 이제 함께 후보를 비교해요.';
 state.tab='compare';render();
});
root.addEventListener('click',event=>{
 const button=event.target.closest('button'); if(!button||button.disabled)return;
 if(!button.dataset.tab&&!button.dataset.preset&&!button.dataset.candidate&&!button.dataset.action)return;
 if(button.dataset.tab){state.tab=button.dataset.tab;state.notice='';}
 if(button.dataset.preset){applyPreset(state,button.dataset.preset);state.actor=button.dataset.preset==='ready'?'지수':state.actor;}
 if(button.dataset.candidate&&state.candidate!==button.dataset.candidate){state.candidate=button.dataset.candidate;state.members.forEach(p=>p.agreed=false);state.finalized=false;}
 const action=button.dataset.action;
 if(action==='compare')state.tab='compare';
 if(action==='reset')state=initialState();
 if(action==='fill'){state.notice='공개 가능한 예시 문장으로 만든 초안이에요. 실제 AI 호출은 하지 않아요.';}
 if(action==='agree'){
  const result=evaluate(state);
  if(!result.pending.length&&!result.conflicts.length&&!state.members.some(p=>p.visibility==='나만 보기'))state.members.find(p=>p.name===state.actor).agreed=true;
 }
 if(action==='finalize'&&state.actor==='지수'&&evaluate(state).ready&&!state.members.some(p=>p.visibility==='나만 보기'))state.finalized=true;
 render();
});
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==(window.parent===window?window:window.parent))return;
 if(event.data?.type==='travel-actor'&&people.includes(event.data.actor)){state.actor=event.data.actor;render();return;}
 if(event.data?.type!=='travel-comparison')return;
 const scene=event.data.scene;if(!['conditions','pending','conflict','ready','changed'].includes(scene))return;
 state=initialState();if(scene!=='conditions')applyPreset(state,scene);
 if(people.includes(event.data.actor))state.actor=event.data.actor;else if(scene==='ready')state.actor='지수';render();
});
render();
