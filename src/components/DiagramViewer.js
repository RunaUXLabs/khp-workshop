const image = document.getElementById('diagram');
const canvas = document.getElementById('canvas');
let width = 0;
function size(value) {
  width = Math.max(200, Math.min(15000, value));
  image.style.width = `${width}px`;
  document.getElementById('scale').textContent = `${Math.round(width / image.naturalWidth * 100)}%`;
}
function fit() { size(canvas.clientWidth - 24); }
image.addEventListener('load', fit);
if (image.complete && image.naturalWidth) fit();
document.getElementById('fit').onclick = fit;
document.getElementById('read').onclick = () => size(image.naturalWidth);
document.getElementById('plus').onclick = () => size(width * 1.25);
document.getElementById('minus').onclick = () => size(width / 1.25);
