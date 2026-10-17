import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, HStack, Text } from '@seed-design/react';
import { ActionButton } from './seed-design/ui/action-button';
import { TextField, TextFieldInput, TextFieldTextarea } from './seed-design/ui/text-field';
import { RadioSelectBoxRoot, RadioSelectBoxItem, RadioSelectBoxRadiomark } from './seed-design/ui/select-box';
import { Badge } from './seed-design/ui/badge';
import { Callout } from './seed-design/ui/callout';
import { initialState, candidates, people, evaluate, applyPreset } from '../demo/model.js';

const steps = ['welcome', 'date', 'budget', 'requirement', 'privacy', 'review', 'candidates', 'consent', 'complete'];
const titles = ['같이 가는 여행', '언제 떠날 수 있나요?', '얼마까지 쓸 수 있나요?', '꼭 지키고 싶은 조건은요?', '어디까지 공유할까요?', '내 조건을 확인해주세요', '우리에게 맞는 여행 찾기', '이 여행으로 함께 갈까요?', '함께 갈 여행이 정해졌어요'];
const descriptions = ['서로의 조건을 먼저 맞추면, 여행을 정하기 쉬워져요.', '출발 가능한 날짜를 하나 골라주세요.', '교통·숙소·식비를 포함한 1인 총예산이에요.', '친구들이 여행을 정할 때 고려할 내용을 알려주세요.', '공유한 조건만 친구들과 함께 비교해요.', '확인 후 친구들과 후보를 비교할 수 있어요.', '가격과 이동시간을 살펴보고 후보를 골라주세요.', '조건이 맞는지 확인하고 각자 동의해주세요.', '모두가 같은 조건과 후보에 동의했어요.'];
const snapshot = state => structuredClone(state);
export function Choice({ label, value, onChange, items }) {
  return <RadioSelectBoxRoot label={label} value={value} onValueChange={onChange}>
    {items.map(item => <RadioSelectBoxItem key={item.value} {...item} suffix={<RadioSelectBoxRadiomark />} />)}
  </RadioSelectBoxRoot>;
}
export function Detail({ label, children }) {
  return <VStack gap="x1" py="x3"><Text textStyle="t3Regular" color="fg.neutralSubtle">{label}</Text><Text textStyle="t5Medium">{children}</Text></VStack>;
}
export default function App() {
  const [state, setState] = useState(initialState);
  const [step, setStep] = useState('welcome');
  const [draft, setDraft] = useState(() => ({ ...initialState().members[2], budget: '30' }));
  const [tools, setTools] = useState(false);
  const heading = useRef(null);
  const content = useRef(null);
  const me = state.members.find(member => member.name === state.actor);
  const status = evaluate(state);
  const privateMembers = state.members.filter(member => member.visibility !== '공유');
  const blocked = status.pending.length > 0 || status.conflicts.length > 0 || privateMembers.length > 0;
  const ready = status.ready && !privateMembers.length;
  const index = steps.indexOf(step);
  function move(next) { setStep(next); }
  function mutate(change) { setState(previous => { const next = snapshot(previous); change(next); return next; }); }
  function resetDraft(member) { setDraft({ ...member, budget: String(member.budget) }); }
  function actor(name) { mutate(next => { next.actor = name; }); resetDraft(state.members.find(member => member.name === name)); }
  useEffect(() => { heading.current?.focus({ preventScroll: true }); if(content.current)content.current.scrollTop=0; }, [step]);
  useEffect(() => {
    function receive(event) {
      if (event.origin !== location.origin || event.data?.type !== 'travel-comparison') return;
      const scene = event.data.scene;
      if (!['conditions', 'pending', 'conflict', 'ready', 'changed'].includes(scene)) return;
      const next = initialState();
      if (scene !== 'conditions') applyPreset(next, scene);
      if (scene === 'ready') next.actor = '지수';
      setState(next); resetDraft(next.members.find(member => member.name === next.actor));
      setStep(scene === 'conditions' ? 'welcome' : 'consent'); setTools(false);
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  function save() {
    mutate(next => {
      const member = next.members.find(item => item.name === next.actor);
      const changed = ['date', 'requirement', 'visibility'].some(key => member[key] !== draft[key]) || member.budget !== Number(draft.budget);
      Object.assign(member, draft, { budget: Number(draft.budget), confirmed: true });
      if (changed || !me.confirmed) {
        next.version++; next.members.forEach(item => { item.agreed = false; }); next.finalized = false;
        next.notice = '조건을 저장했어요. 현재 조건으로 모두 다시 동의해주세요.';
      }
    });
    move('candidates');
  }
  const validBudget = /^\d+(\.\d)?$/.test(draft.budget) && Number(draft.budget) > 0 && Number(draft.budget) <= 1000;
  const next = { welcome: 'date', date: 'budget', budget: 'requirement', requirement: 'privacy', privacy: 'review', candidates: 'consent' };
  const buttonLabel = { welcome: '내 조건 입력하기', date: '예산 입력하기', budget: '필수 조건 입력하기', requirement: '공유 범위 정하기', privacy: '입력한 조건 확인하기', review: '이 조건으로 저장하기', candidates: '선택한 후보 확인하기' };
  return <VStack height="100dvh" maxWidth="480px" mx="auto" bg="bg.layerDefault" gap={0}>
    <HStack as="header" flexShrink={0} px="x4" py="x3" justify="space-between" align="center">
      {index > 0 && step !== 'complete' ? <ActionButton variant="ghost" size="small" onClick={() => move(steps[index - 1])}>이전</ActionButton> : <Text textStyle="t4Bold">같이 가는 여행</Text>}
      <Text textStyle="t3Regular" color="fg.neutralSubtle">{state.actor}님의 여행</Text>
    </HStack>
    <VStack as="main" ref={content} minHeight={0} overflowY="auto" px="x5" pt="x6" pb="x6" gap="x6" flexGrow={1}>
      <VStack gap="x3">
        <HStack gap="x2"><Badge variant="weak" tone="brand">친구 4명 · 주말 여행</Badge>{index >= 1 && index <= 5 && <Badge variant="weak">조건 입력 {index}/5</Badge>}</HStack>
        <Text as="h1" ref={heading} tabIndex={-1} textStyle="screenTitle">{titles[index]}</Text>
        <Text as="p" textStyle="t5Regular" color="fg.neutralSubtle">{descriptions[index]}</Text>
      </VStack>
      {step === 'welcome' && <VStack gap="x5">
        <Box bg="bg.neutralWeak" borderRadius="r3" p="x4">
          <Detail label="이번 여행의 약속">말하지 못한 조건도 먼저 확인해요</Detail>
          <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">날짜 → 예산 → 필수 조건을 입력하고, 모두가 동의한 여행을 함께 정해요.</Text>
        </Box>
        <HStack justify="space-between"><Text textStyle="t4Medium">조건 확인 현황</Text><Text textStyle="t4Bold">{state.members.filter(m => m.confirmed).length}/4명</Text></HStack>
        {state.members.map(m => <HStack key={m.name} justify="space-between"><Text textStyle="t4Regular">{m.name}{m.name === state.actor ? ' (나)' : ''}</Text><Badge tone={m.confirmed ? 'positive' : 'neutral'} variant="weak">{m.confirmed ? '확인 완료' : '입력 대기'}</Badge></HStack>)}
      </VStack>}
      {step === 'date' && <Choice label="출발 가능한 날짜" value={draft.date} onChange={date => setDraft({ ...draft, date })} items={[{value:'토요일 출발',label:'토요일 출발',description:'금요일에는 출발하기 어려워요'},{value:'금·토 모두 가능',label:'금·토 모두 가능',description:'어느 날 출발해도 괜찮아요'}]} />}
      {step === 'budget' && <VStack gap="x5">
        <TextField label="1인 최대 예산" suffix="만원" value={draft.budget} onValueChange={({ value }) => setDraft({ ...draft, budget: value })} invalid={!validBudget} errorMessage="0보다 크고 1,000 이하인 금액을 입력해주세요." description="예: 30만원 · 입력한 금액을 넘는 후보는 따로 알려드려요." required><TextFieldInput inputMode="decimal" autoComplete="off" /></TextField>
        <Callout tone="neutral" description="최대 예산은 꼭 지켜야 하는 조건으로 비교해요. 실제 결제는 진행하지 않아요." />
      </VStack>}
      {step === 'requirement' && <TextField label="꼭 지켜야 할 조건" value={draft.requirement} onValueChange={({value}) => setDraft({...draft,requirement:value})} maxGraphemeCount={100} description="예: 장거리 이동은 피하고 싶어요. 없다면 ‘없음’이라고 적어주세요." required><TextFieldTextarea rows={4} /></TextField>}
      {step === 'privacy' && <Choice label="내 조건의 공유 범위" value={draft.visibility} onChange={visibility => setDraft({...draft,visibility})} items={[{value:'공유',label:'친구들에게 공유',description:'함께 조건을 비교하고 여행을 확정할 수 있어요'},{value:'나만 보기',label:'나만 보기',description:'내용은 숨겨져요. 함께 비교하려면 나중에 공유로 바꿔주세요'}]} />}
      {step === 'review' && <VStack gap="x2">
        <Detail label="출발 날짜">{draft.date}</Detail><Detail label="최대 예산">1인 {draft.budget}만원</Detail><Detail label="필수 조건">{draft.requirement}</Detail><Detail label="공유 범위">{draft.visibility}</Detail>
        <ActionButton variant="neutralWeak" size="medium" onClick={() => move('date')}>조건 수정하기</ActionButton>
      </VStack>}
      {step === 'candidates' && <VStack gap="x5">
        {state.notice && <Callout tone="informative" description={state.notice} />}
        <Choice label="비교할 여행 후보" value={state.candidate} onChange={candidate => mutate(next => {if(next.candidate !== candidate){next.candidate=candidate;next.members.forEach(m=>{m.agreed=false;});next.finalized=false;}})} items={candidates.map(candidate=>({value:candidate.id,label:candidate.title,description:`1인 ${candidate.budget}만원 · ${candidate.travel}`}))} />
        <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">수업용 예시 후보예요. 실시간 여행 상품이나 AI 추천 결과가 아니에요.</Text>
      </VStack>}
      {step === 'consent' && <VStack gap="x5">
        {state.notice && <Callout tone="informative" description={state.notice} />}
        <Box bg="bg.neutralWeak" borderRadius="r3" p="x4"><Text as="h2" textStyle="t6Bold">{status.candidate.title}</Text><Detail label="예상 비용 · 이동시간">1인 {status.candidate.budget}만원 · {status.candidate.travel}</Detail></Box>
        <Callout tone={blocked ? 'warning' : ready ? 'positive' : 'informative'} title={blocked ? '먼저 확인할 내용이 있어요' : ready ? '모두 동의했어요' : '친구들의 동의를 모으고 있어요'} description={privateMembers.length ? '공유하지 않은 조건이 있어요. 당사자가 공유 범위를 바꿔야 함께 비교할 수 있어요.' : status.pending.length ? `${status.pending.map(m=>m.name).join(', ')}님의 조건 확인을 기다려요.` : status.conflicts.length ? '맞지 않는 조건이 있어요. 후보를 바꾸거나 각자 조건을 수정해주세요.' : ready ? '방장 지수가 여행을 확정할 수 있어요.' : `${4-status.unagreed.length}/4명이 이 후보에 동의했어요.`} />
        <VStack gap="x4" aria-label="친구별 확인 상태">{state.members.map(m => <HStack key={m.name} justify="space-between" align="center" gap="x3"><VStack gap="x1"><Text textStyle="t4Medium">{m.name}{m.name===state.actor?' (나)':''}</Text><Text textStyle="t3Regular" color="fg.neutralSubtle">{m.visibility !== '공유' && m.name !== state.actor ? '공유 범위 확인 필요' : !m.confirmed ? '조건 확인 필요' : status.conflicts.some(c=>c.name===m.name) ? (m.visibility === '공유' ? '조건이 맞지 않아요' : '공유 범위 확인 필요') : m.visibility !== '공유' ? '나만 보기' : '조건이 맞아요'}</Text></VStack><Badge variant="weak" tone={m.agreed?'positive':'neutral'}>{m.agreed?'동의 완료':'확인 중'}</Badge></HStack>)}</VStack>
        <ActionButton variant="neutralWeak" size="medium" onClick={()=>move('candidates')}>다른 후보 비교하기</ActionButton>
        <ActionButton variant="ghost" size="medium" onClick={()=>{resetDraft(me);move('date');}}>내 조건 수정하기</ActionButton>
      </VStack>}
      {step === 'complete' && <VStack gap="x5"><Badge tone="positive" variant="weak">전원 동의 · 확정 완료</Badge><Detail label="함께 정한 여행">{status.candidate.title}</Detail><Detail label="예상 비용">1인 {status.candidate.budget}만원</Detail><Detail label="함께 가는 사람">지수 · 민호 · 서연 · 도윤</Detail><Callout tone="positive" description="조건을 바꾸면 이전 동의와 확정이 해제돼요. 바뀐 내용으로 다시 확인할 수 있어요." /></VStack>}
    </VStack>
    <VStack as="footer" flexShrink={0} bg="bg.layerDefault" px="x5" py="x4" gap="x2" borderColor="stroke.neutralMuted" borderWidth={1}>
      {buttonLabel[step] && <ActionButton size="large" variant="brandSolid" disabled={(step==='budget'&&!validBudget)||(step==='requirement'&&!draft.requirement.trim())} onClick={()=>step==='review'?save():move(next[step])}>{buttonLabel[step]}</ActionButton>}
      {step === 'consent' && <>
        {!me.agreed && <ActionButton variant="brandSolid" size="large" disabled={blocked} onClick={()=>mutate(next=>{next.members.find(m=>m.name===next.actor).agreed=true;})}>이 후보에 동의하기</ActionButton>}
        {me.agreed && !ready && <Text textStyle="t4Medium" align="center">동의했어요. 친구들의 확인을 기다려요.</Text>}
        {(ready || state.actor==='지수') && <ActionButton variant="brandSolid" size="large" disabled={!ready||state.actor!=='지수'} onClick={()=>{mutate(next=>{next.finalized=true;});move('complete');}}>여행 확정하기</ActionButton>}
        {blocked && <Text textStyle="t3Regular" color="fg.neutralSubtle">조건 확인과 공유가 끝나면 동의할 수 있어요.</Text>}
        {ready && state.actor!=='지수' && <Text textStyle="t3Regular" color="fg.neutralSubtle">방장 지수가 마지막으로 확정해요.</Text>}
      </>}
      {step==='complete' && <ActionButton variant="neutralWeak" size="large" onClick={()=>{resetDraft(me);move('date');}}>내 조건 변경하기</ActionButton>}
    </VStack>
    <VStack as="aside" flexShrink={0} maxHeight="55dvh" overflowY="auto" px="x5" py="x4" gap="x3" bg="bg.neutralWeak">
      <ActionButton variant="ghost" size="small" aria-expanded={tools} onClick={()=>setTools(!tools)}>실습 설정 {tools?'닫기':'열기'}</ActionButton>
      {tools && <><Text textStyle="t3Regular" color="fg.neutralSubtle">실제 로그인 없이 참여자를 바꾸는 수업용 기능이에요. 입력 내용은 새로고침하면 초기화돼요.</Text><Choice label="실습할 참여자" value={state.actor} onChange={name=>{actor(name);if(['date','budget','requirement','privacy','review'].includes(step))move('date');}} items={people.map(name=>({value:name,label:name+(name==='지수'?' · 방장':'')}))}/></>}
    </VStack>
  </VStack>;
}
