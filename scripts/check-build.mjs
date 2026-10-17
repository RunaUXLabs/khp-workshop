import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const lecture = JSON.parse(await readFile(path.join(dist, 'src/data/lecture.json'), 'utf8'));
const guides = JSON.parse(await readFile(path.join(dist, 'src/data/guides.json'), 'utf8'));
const ids = new Set(lecture.sections.map(section => section.id));
assert.equal(ids.size, lecture.sections.length, 'Section IDs must be unique');
const checked = new Set();
async function checkLink(link) {
  if (!link || /^(?:https?:|mailto:|data:)/i.test(link)) return;
  if (link.startsWith('#')) {
    assert.ok(ids.has(link.slice(1)), `Unknown section: ${link}`);
    return;
  }
  assert.ok(!link.startsWith('/'), `Asset must support a Pages repository subpath: ${link}`);
  const relative = decodeURIComponent(link.split(/[?#]/)[0]);
  if (checked.has(relative)) return;
  const resolved = path.resolve(dist, relative);
  const within = path.relative(dist, resolved);
  assert.ok(!within.startsWith('..') && !path.isAbsolute(within), `Asset escapes the deployment: ${link}`);
  assert.ok((await stat(resolved)).isFile(), `Missing deployed asset: ${link}`);
  checked.add(relative);
}
async function checkMarkdown(body) {
  for (const match of body.matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)) await checkLink(match[1]);
  for (const match of body.matchAll(/\b(?:src|href)="([^"]+)"/g)) await checkLink(match[1]);
  for (const match of body.matchAll(/data-guide="([^"]+)"/g)) assert.ok(guides[match[1]], `Unknown guide: ${match[1]}`);
}
for (const section of lecture.sections) {
  if (section.detailDoc) assert.ok(guides[section.detailDoc], `Missing detail guide: ${section.id}`);
  await checkMarkdown(section.body);
}
for (const guide of Object.values(guides)) {
  if (guide.source) {
    await checkLink(guide.source);
    await checkMarkdown(await readFile(path.join(dist, guide.source), 'utf8'));
  } else await checkMarkdown(guide.body);
}
for (const page of ['index.html', 'demo/index.html', 'demo-css/index.html', 'demo-seed/index.html', 'diagrams/travel-ui-flow.html', 'diagrams/travel-data-flow.html']) {
  await checkLink(page);
  const html = await readFile(path.join(dist, page), 'utf8');
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|#)/.test(match[1])) continue;
    await checkLink(path.posix.normalize(path.posix.join(path.posix.dirname(page), match[1])));
  }
}
for (const file of ['demo-seed/app.js', 'demo-seed/app.css', 'vendor/seed/all.css', 'vendor/seed/LICENSE', 'vendor/seed/NOTICE', '.nojekyll']) await checkLink(file);
console.log(`Build verified: ${lecture.sections.length} sections, ${Object.keys(guides).length} guides/backgrounds, ${checked.size} local assets; relative Pages paths and conversation sources resolve.`);
