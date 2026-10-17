export const people = ['지수', '민호', '서연', '도윤'];
export const candidates = [
  { id: 'saturday', title: '토요일, 가까운 곳으로', date: '토요일 출발', budget: 28, travel: '편도 1시간', available: true },
  { id: 'friday', title: '금요일, 조금 더 멀리', date: '금요일 출발', budget: 38, travel: '편도 3시간', available: false }
];
export function initialState() {
  return { tab: 'conditions', actor: '서연', version: 1, candidate: 'saturday', finalized: false,
    notice: '', members: people.map((name, i) => ({ name, budget: i === 2 ? 30 : 40, date: i === 1 ? '토요일 출발' : '토요일 출발', requirement: i === 3 ? '장거리 이동은 피하고 싶어요' : i === 2 ? '예산 안에서 정하고 싶어요' : '날짜가 맞으면 좋아요', visibility: '공유', confirmed: i !== 3, agreed: false })) };
}
export function evaluate(state) {
  const candidate = candidates.find(item => item.id === state.candidate);
  const pending = state.members.filter(member => !member.confirmed);
  const conflicts = state.members.filter(member => member.confirmed && (candidate.budget > member.budget || (member.date === '토요일 출발' && candidate.id === 'friday') || (member.requirement.includes('장거리') && candidate.id === 'friday')));
  const unagreed = state.members.filter(member => !member.agreed);
  return { candidate, pending, conflicts, unagreed, ready: !pending.length && !conflicts.length && !unagreed.length };
}
export function applyPreset(state, preset) {
  state.tab = 'compare'; state.finalized = false; state.candidate = 'saturday'; state.notice = '';
  state.members = initialState().members;
  state.members.forEach(member => {member.confirmed = true; member.agreed = false;});
  if (preset === 'pending') state.members[3].confirmed = false;
  if (preset === 'conflict') state.candidate = 'friday';
  if (preset === 'ready') state.members.forEach(member => member.agreed = true);
  if (preset === 'changed') {
    state.version++; state.members[2].confirmed = false;
    state.notice = '조건이 바뀌어 다시 확인이 필요해요. 이전 동의와 확정을 해제했어요.';
  }
}
