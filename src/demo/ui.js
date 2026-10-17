export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const badge = (text, tone='neutral') => `<span class="badge ${tone}">${escapeHtml(text)}</span>`;
export function personRow(member) {
  return `<div class="person"><span class="avatar">${member.name.slice(0,1)}</span><strong>${member.name}</strong><span class="person-status">${badge(!member.confirmed?'확인 기다리는 중':member.agreed?'이 후보에 동의':'조건 확인 완료',!member.confirmed?'warning':member.agreed?'success':'neutral')}</span></div>`;
}
