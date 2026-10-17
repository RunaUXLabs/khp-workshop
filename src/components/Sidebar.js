export function Sidebar() {
  return `<aside class="sidebar" id="sidebar">
    <div class="brand">
      <h1><a id="brandTitle" href="#cover" aria-label="강의 표지로 돌아가기"></a></h1>
      <p id="brandSub"></p>
    </div>
    <div class="search-wrap"><input id="search" type="text" placeholder="🔍 목차 검색…" autocomplete="off"></div>
    <nav class="toc" id="toc"></nav>
  </aside>`;
}
